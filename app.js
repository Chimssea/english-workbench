/* ============================================================
   英语工作台 · 应用逻辑
   全部离线：朗读用系统语音合成，跟读用浏览器语音识别，
   进度存在 localStorage，不联网、不上传。
   ============================================================ */
(function () {
  'use strict';

  /* ---------------- 工具 ---------------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));

  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => (
    { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]
  ));

  const todayKey = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const dayKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const addDays = (dateStr, n) => {
    const [y, m, d] = dateStr.split('-').map(Number);
    const dt = new Date(y, m - 1, d);
    dt.setDate(dt.getDate() + n);
    return dayKey(dt);
  };
  const daysBetween = (a, b) => {
    const [y1, m1, d1] = a.split('-').map(Number);
    const [y2, m2, d2] = b.split('-').map(Number);
    return Math.round((new Date(y2, m2 - 1, d2) - new Date(y1, m1 - 1, d1)) / 86400000);
  };

  const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let toastTimer = null;
  function toast(msg) {
    const el = $('#toast');
    el.textContent = msg;
    el.classList.add('is-on');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('is-on'), 2200);
  }

  /* ---------------- 存储 ---------------- */
  const KEY = 'english-workbench-v1';

  const defaultState = () => ({
    settings: {
      examDate: '',
      minutesPerDay: 30,
      voiceURI: '',
      rate: 0.9,
      onboarded: false,
      lastExportAt: 0
    },
    days: {},        // { '2026-03-01': { p: n, s: n, w: n } }
    words: {},       // { word: { s: 0..5, due: 'YYYY-MM-DD', seen, ok } }
    zk: {},          // 中考单元词：{ 'family': { s, due, seen, right, wrong } }
    phonics: {},     // { '/iː/': 1..3 }
    speak: {},       // { topicId: { best, tries } }
    cet4: {          // { id: true }
      listening: {}, reading: {}, writing: {}, translation: {}
    }
  });

  let state;
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      state = raw ? Object.assign(defaultState(), JSON.parse(raw)) : defaultState();
      // 保证嵌套结构完整
      const d = defaultState();
      state.settings = Object.assign(d.settings, state.settings || {});
      state.cet4 = Object.assign(d.cet4, state.cet4 || {});
    } catch (e) {
      state = defaultState();
    }
  }
  let saveTimer = null;

  /* 存储可用性：个别浏览器在 file:// 下会关掉 localStorage。
     这种情况必须当场说清楚，不能让用户学了一个月才发现一次都没存上。 */
  const STORAGE_OK = (() => {
    try {
      localStorage.setItem('__wb_probe', '1');
      localStorage.removeItem('__wb_probe');
      return true;
    } catch (e) {
      return false;
    }
  })();

  let saveState = { at: null, ok: STORAGE_OK, error: STORAGE_OK ? '' : '浏览器不允许本地存储' };

  function writeNow() {
    if (!STORAGE_OK) {
      saveState = { at: null, ok: false, error: '浏览器不允许本地存储' };
      return false;
    }
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      saveState = { at: Date.now(), ok: true, error: '' };
      return true;
    } catch (e) {
      saveState = {
        at: null,
        ok: false,
        error: e && e.name === 'QuotaExceededError' ? '存储空间已满' : String(e && e.message || e)
      };
      return false;
    }
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveTimer = null;
      if (!writeNow()) toast('进度没保存上：' + saveState.error);
      document.dispatchEvent(new CustomEvent('wb-saved'));
    }, 120);
  }

  /* 关页面 / 切到后台时，把防抖窗口里那次写入立刻落盘，
     否则"做完最后一张卡就关掉"这一下正好会丢。 */
  function flushSave() {
    if (saveTimer) {
      clearTimeout(saveTimer);
      saveTimer = null;
      writeNow();
      document.dispatchEvent(new CustomEvent('wb-saved'));
    }
  }

  /* 相对时间，用于"上次保存 / 上次导出" */
  function ago(ts) {
    if (!ts) return '从未';
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 45) return '刚刚';
    if (s < 3600) return Math.floor(s / 60) + ' 分钟前';
    if (s < 86400) return Math.floor(s / 3600) + ' 小时前';
    return Math.floor(s / 86400) + ' 天前';
  }

  /* 一份进度里有啥，用来说清"导出的是什么、导入的会覆盖什么" */
  function summarize(data) {
    const days = data && data.days ? data.days : {};
    const keys = Object.keys(days);
    let activeDays = 0;
    keys.forEach((k) => {
      const r = days[k];
      if (r && (r.p || r.s || r.w)) activeDays++;
    });
    return {
      activeDays,
      words: Object.keys((data && data.words) || {}).length,
      phonics: Object.keys((data && data.phonics) || {}).length,
      topics: Object.keys((data && data.speak) || {}).length,
      cet4: Object.values((data && data.cet4) || {}).reduce((a, o) => a + Object.keys(o || {}).length, 0)
    };
  }

  /* 侧栏底部的"已保存"小字：让保存这件事一直看得见，而不是只在出错时才出现 */
  function saveStatusText() {
    if (!STORAGE_OK) return { ok: false, text: '不会保存 · 浏览器禁止本地存储' };
    if (!saveState.ok) return { ok: false, text: '没存上 · ' + saveState.error };
    if (!saveState.at) return { ok: true, text: '尚无改动' };
    return { ok: true, text: '已保存 · ' + ago(saveState.at) };
  }

  function updateSaveBadge() {
    const el = $('#spine-save');
    if (!el) return;
    const st = saveStatusText();
    el.textContent = st.text;
    el.className = 'spine-save' + (st.ok ? '' : ' is-bad');
  }

  function dayRecord(key) {
    const k = key || todayKey();
    if (!state.days[k]) state.days[k] = { p: 0, s: 0, w: 0 };
    return state.days[k];
  }

  /* ---------------- 语音合成 ---------------- */
  const TTS = {
    voices: [],
    picked: null,
    ready: false,

    init() {
      if (!('speechSynthesis' in window)) return;
      const grab = () => {
        const all = window.speechSynthesis.getVoices() || [];
        this.voices = all.filter((v) => /^en(-|_)/i.test(v.lang));
        if (!this.voices.length) this.voices = all;
        this.ready = this.voices.length > 0;
        if (!this.picked) this.picked = this.choose();
        document.dispatchEvent(new CustomEvent('tts-ready'));
      };
      grab();
      window.speechSynthesis.addEventListener('voiceschanged', grab);
      setTimeout(grab, 600);
    },

    choose() {
      const want = state.settings.voiceURI;
      if (want) {
        const hit = this.voices.find((v) => v.voiceURI === want);
        if (hit) return hit;
      }
      const score = (v) => {
        let s = 0;
        if (/^en-GB/i.test(v.lang)) s += 4;
        if (/^en-US/i.test(v.lang)) s += 3;
        if (/en[-_]AU|en[-_]CA|en[-_]IE/i.test(v.lang)) s += 1;
        if (/Google|Samantha|Zira|Karen|Daniel|Serena|Aria|Jenny/i.test(v.name)) s += 3;
        if (/natural|neural|premium|enhanced/i.test(v.name)) s += 5;
        if (v.localService) s += 1;
        return s;
      };
      return this.voices.slice().sort((a, b) => score(b) - score(a))[0] || null;
    },

    say(text, opts) {
      opts = opts || {};
      if (!('speechSynthesis' in window)) {
        toast('这个浏览器不支持朗读，换 Edge 或 Chrome 打开');
        return;
      }
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = this.picked || this.choose();
      if (v) u.voice = v, u.lang = v.lang;
      else u.lang = 'en-US';
      u.rate = opts.rate != null ? opts.rate : (state.settings.rate || 0.9);
      u.pitch = 1;
      if (opts.onEnd) u.addEventListener('end', opts.onEnd);
      if (opts.onStart) u.addEventListener('start', opts.onStart);
      window.speechSynthesis.speak(u);
      return u;
    },

    stop() {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      $$('.icon-btn.is-playing').forEach((b) => b.classList.remove('is-playing'));
    }
  };

  /* ---------------- 语音识别 + 打分 ---------------- */
  const SRClass = window.SpeechRecognition || window.webkitSpeechRecognition;

  const normalize = (s) => String(s)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const tokenize = (s) => normalize(s).split(' ').filter(Boolean);

  /* 词级 LCS 对齐：返回参考句里每个词是否被命中 */
  function align(refWords, hypWords) {
    const n = refWords.length, m = hypWords.length;
    const dp = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = refWords[i] === hypWords[j]
          ? dp[i + 1][j + 1] + 1
          : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const hits = new Array(n).fill(false);
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (refWords[i] === hypWords[j]) { hits[i] = true; i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return hits;
  }

  function scoreAttempt(refText, heardText) {
    const ref = tokenize(refText);
    const hyp = tokenize(heardText);
    if (!ref.length) return { score: 0, hits: [], ref, hyp };
    if (!hyp.length) return { score: 0, hits: new Array(ref.length).fill(false), ref, hyp };
    const hits = align(ref, hyp);
    const hit = hits.filter(Boolean).length;
    return { score: Math.round((hit / ref.length) * 100), hits, ref, hyp };
  }

  /* 识别一次，返回 Promise<{text, error}> */
  function listenOnce(onLive) {
    return new Promise((resolve) => {
      if (!SRClass) {
        resolve({ error: 'unsupported' });
        return;
      }
      let rec;
      try {
        rec = new SRClass();
      } catch (e) {
        resolve({ error: 'unsupported' });
        return;
      }
      rec.lang = 'en-US';
      rec.interimResults = true;
      rec.maxAlternatives = 3;
      rec.continuous = false;

      let transcript = '';
      let settled = false;
      const done = (payload) => {
        if (settled) return;
        settled = true;
        try { rec.stop(); } catch (e) {}
        resolve(payload);
      };

      rec.onresult = (ev) => {
        let finalText = '';
        let interim = '';
        for (let k = ev.resultIndex; k < ev.results.length; k++) {
          const r = ev.results[k];
          if (r.isFinal) finalText += ' ' + r[0].transcript;
          else interim += ' ' + r[0].transcript;
        }
        transcript += finalText;
        if (onLive) onLive((transcript + ' ' + interim).trim());
      };
      rec.onerror = (ev) => {
        const map = {
          'not-allowed': 'no-mic',
          'service-not-allowed': 'no-mic',
          'no-speech': 'silent',
          'audio-capture': 'no-mic',
          'network': 'network'
        };
        done({ error: map[ev.error] || ev.error });
      };
      rec.onend = () => done({ text: transcript.trim() });

      try { rec.start(); }
      catch (e) { done({ error: 'busy' }); }

      // 保险：8 秒后强制收尾
      setTimeout(() => done({ text: transcript.trim() }), 8000);
    });
  }

  const SR_MSG = {
    unsupported: '这个浏览器不支持语音识别。用 Edge 打开这一页就能跟读打分；或者其他浏览器也能正常朗读和练习，只是不打分。',
    'no-mic': '没有拿到麦克风权限。点地址栏左边的锁，允许麦克风后重试。',
    silent: '没听到声音。靠近一点、说大声些，再点一次。',
    network: '语音识别需要联网（朗读不需要）。检查网络后再试。',
    busy: '上一次录音还没结束，等一下再点。'
  };

  /* ---------------- 视图配置 ---------------- */
  const VIEWS = {
    today:    { title: '今日', kicker: '今天', sub: '三件事，做完就算今天没白过。' },
    phonics:  { title: '发音地基', kicker: '第 2 步', sub: '48 个音标。先能读准，再谈流利——口型不对，练一百遍也是错的。' },
    speaking: { title: '口语', kicker: '第 3 步', sub: '按场景练。每句都带中文和发音提示，读错的地方会告诉你错在哪个词。' },
    words:    { title: '词汇', kicker: '第 4 步', sub: 'A1 到 B1 三级。每天十几个，按遗忘曲线排复习。' },
    cet4:     { title: '四级专项', kicker: '第 5 步', sub: '听力、阅读、写作、翻译。先做过一遍，再谈技巧。' },
    progress: { title: '进度', kicker: '回头看', sub: '数据只用来判断下一步练什么，不用来评价你。' }
  };

  let currentView = 'today';
  let speakingTopic = null;
  let phonicsOpen = null;
  let wordsLevel = 'all';
  let zkMode = 'level';      // 'level' = 分级词表 / 'unit' = 中考单元
  let zkUnit = null;         // 当前单元 id
  let zkQueue = [];
  let zkIndex = 0;
  let zkQuestion = null;     // { idx, mode, word, options, answerIndex, answered, ok }
  let zkStat = { right: 0, wrong: 0 };
  let cet4Tab = 'listening';
  let reviewQueue = [];
  let reviewIndex = 0;
  let reviewFlipped = false;

  /* ---------------- 汇总数据 ---------------- */
  function streakCount() {
    let n = 0;
    let k = todayKey();
    // 今天没做也算不上断，从昨天起算
    const rec = state.days[k];
    if (!rec || (!rec.p && !rec.s && !rec.w)) k = addDays(k, -1);
    while (true) {
      const r = state.days[k];
      if (!r || (!r.p && !r.s && !r.w)) break;
      n++;
      k = addDays(k, -1);
    }
    return n;
  }

  function wordsLearned() {
    return Object.values(state.words).filter((w) => w.s > 0).length;
  }

  function dueWords(level) {
    const today = todayKey();
    return WORD_BANK.filter((w) => {
      if (level && level !== 'all' && w.lv !== level) return false;
      const st = state.words[w.w];
      if (!st || st.s === 0) return true;
      return st.due <= today;
    });
  }

  function daysToExam() {
    if (!state.settings.examDate) return null;
    const n = daysBetween(todayKey(), state.settings.examDate);
    return n;
  }

  function avgSpeak() {
    const arr = Object.values(state.speak).map((x) => x.best).filter((n) => typeof n === 'number');
    if (!arr.length) return null;
    return Math.round(arr.reduce((a, b) => a + b, 0) / arr.length);
  }

  function phonicsMastered() {
    return Object.values(state.phonics).filter((v) => v >= 3).length;
  }

  /* ---------------- masthead ---------------- */
  function renderMasthead() {
    const v = VIEWS[currentView];
    $('#mh-title').textContent = v.title;
    $('#mh-kicker').textContent = v.kicker;
    $('#mh-sub').textContent = v.sub;

    const side = $('#mh-side');
    let html = '';

    if (currentView === 'today') {
      const r = dayRecord();
      const done = [r.p > 0, r.s > 0, r.w >= 8].filter(Boolean).length;
      html = `<div><div class="count" id="c1">${done}<span style="font-size:.5em;color:var(--ink-mute)">/3</span></div><div class="count-label">今日完成</div></div>`;
    } else if (currentView === 'phonics') {
      html = `<div><div class="count">${phonicsMastered()}<span style="font-size:.5em;color:var(--ink-mute)">/48</span></div><div class="count-label">已掌握</div></div>`;
    } else if (currentView === 'speaking') {
      const n = Object.keys(state.speak).length;
      html = `<div><div class="count">${n}<span style="font-size:.5em;color:var(--ink-mute)">/18</span></div><div class="count-label">练过的话题</div></div>`;
    } else if (currentView === 'words') {
      if (zkMode === 'unit') {
        const total = zkAllWords().length;
        html = `<div><div class="count">${zkLearnedCount()}<span style="font-size:.5em;color:var(--ink-mute)">/${total}</span></div><div class="count-label">中考词已学</div></div>`;
      } else {
        html = `<div><div class="count">${dueWords(wordsLevel).length}</div><div class="count-label">待复习</div></div>`;
      }
    } else if (currentView === 'cet4') {
      const total = Object.values(state.cet4).reduce((a, o) => a + Object.keys(o).length, 0);
      html = `<div><div class="count">${total}</div><div class="count-label">已完成题组</div></div>`;
    } else {
      const s = streakCount();
      html = `<div><div class="count">${s}</div><div class="count-label">连续天数</div></div>`;
    }
    side.innerHTML = `<div class="count-block">${html}</div>
      <button class="btn btn-sm" data-act="settings" aria-label="设置考试目标与每日时长">设目标</button>`;

    // 脊底部
    const dd = daysToExam();
    $('#spine-days').textContent = dd == null ? '—' : (dd >= 0 ? dd + '天' : '已过');
    $('#spine-streak').textContent = streakCount();
    $('#spine-words').textContent = wordsLearned();

    const dueW = dueWords('all').length;
    const badgeW = $('#nav-due-words');
    badgeW.hidden = dueW === 0;
    badgeW.textContent = dueW;
  }

  /* ============================================================
     01 今日
     ============================================================ */
  const LEDES = [
    { en: 'Small steps, taken daily, go further than big plans.', cn: '每天一小步，比宏大的计划走得更远。' },
    { en: 'You do not have to be good to start. You have to start to be good.', cn: '不用等变好才开始，要开始才会变好。' },
    { en: 'Say it out loud. Reading silently trains your eyes, not your mouth.', cn: '大声说出来。默读练的是眼睛，不是嘴。' },
    { en: 'A wrong sound, corrected once, is worth ten perfect repetitions.', cn: '一个错音改对一次，胜过十遍完美的重复。' },
    { en: 'Ten minutes today beats two hours next weekend.', cn: '今天的十分钟，胜过下周末的两小时。' },
    { en: 'Listen first, then speak. The order matters.', cn: '先听后说，顺序很重要。' }
  ];

  function renderToday() {
    const rec = dayRecord();
    const seed = Math.floor(Date.now() / 86400000) % LEDES.length;
    const lede = LEDES[seed];
    $('#today-lede').innerHTML = `
      <div class="lang">${esc(lede.en)}</div>
      <div class="cn">${esc(lede.cn)}</div>`;

    const tasks = [
      {
        n: '01', title: '发音 5 分钟', meta: '挑 2 个音标，读例词',
        done: rec.p > 0, go: 'phonics', act: 'phonics'
      },
      {
        n: '02', title: '口语 10 分钟', meta: '选一个话题，跟读并录音',
        done: rec.s > 0, go: 'speaking', act: 'speaking'
      },
      {
        n: '03', title: '词汇 15 分钟', meta: '过 8 张卡片就算完成',
        done: rec.w >= 8, go: 'words', act: 'words'
      }
    ];

    $('#today-tasks').innerHTML = tasks.map((t) => `
      <div class="task ${t.done ? 'is-done' : ''}">
        <span class="task-num">${t.n}</span>
        <div class="task-body">
          <div class="task-title">${esc(t.title)}</div>
          <div class="task-meta">${esc(t.meta)}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn btn-sm" data-act="goto" data-view="${t.go}">开始</button>
          <button class="task-check" data-act="toggle-task" data-task="${t.act}"
            aria-label="${t.done ? '取消完成' : '标记完成'}" aria-pressed="${t.done}">
            <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
          </button>
        </div>
      </div>`).join('');

    const doneCount = tasks.filter((t) => t.done).length;
    $('#today-progress').textContent = `${doneCount} / 3`;

    // 28 天颗粒
    const strip = [];
    for (let i = 27; i >= 0; i--) {
      const k = addDays(todayKey(), -i);
      const r = state.days[k];
      let lv = 0;
      if (r) {
        const d = [r.p > 0 ? 1 : 0, r.s > 0 ? 1 : 0, Math.min(2, Math.floor((r.w || 0) / 4))].reduce((a, b) => a + b, 0);
        lv = Math.min(4, d);
      }
      strip.push(`<i data-lv="${lv}" class="${i === 0 ? 'is-today' : ''}" title="${k}${lv ? ' · 完成 ' + lv + '/4' : ' · 未完成'}"></i>`);
    }
    $('#streak-strip').innerHTML = strip.join('');

    // 底部提示：根据实际状态给一句话
    const due = dueWords('all').length;
    let note;
    if (!state.settings.examDate) {
      note = '<strong>还没设考试日期。</strong>点右上角「设目标」填一下，工作台会按剩余天数替你算每天该学多少。';
    } else if (doneCount === 3) {
      note = '<strong>今天做完了。</strong>现在最有效的加练是「四级 · 听力」——把今天听过的短对话再盲听一遍，不看文本。';
    } else if (due > 60) {
      note = `<strong>待复习积压了 ${due} 张卡。</strong>别翻倍补，先按今天的量走，多出来的明天再说。复习质量比清空队列重要。`;
    } else {
      note = `<strong>连续 ${streakCount()} 天。</strong>今天的顺序建议：发音（最容易专注的时候）→ 口语（需要出声）→ 词汇（可以坐着翻）。`;
    }

    /* 备份提醒：真的学起来了、又很久没导出，才提这一句 */
    const curSum = summarize(state);
    const lastExp = state.settings.lastExportAt;
    const backupDue = STORAGE_OK && curSum.activeDays >= 5 &&
      (!lastExp || (Date.now() - lastExp) > 7 * 86400000);
    if (backupDue) {
      note += `<br><br><strong>该备份一次了。</strong>你已经留下 ${curSum.activeDays} 天记录，但${lastExp ? '上次导出是 ' + ago(lastExp) : '还没导出过'}。到「进度 → 进度存档」导一个文件，以后清缓存也不怕。`;
    }

    $('#today-note').innerHTML = note;
  }

  /* ============================================================
     02 发音
     ============================================================ */
  function renderPhonics() {
    const build = (groupId, host) => {
      host.innerHTML = PHONICS.items.filter((x) => x.group === groupId).map((x) => {
        const m = state.phonics[x.ipa] || 0;
        return `<button class="ipa-cell" data-act="open-ipa" data-ipa="${esc(x.ipa)}" data-mastery="${m}"
          aria-label="${esc(x.ipa)}，例词 ${esc(x.words[0].en)}">
          <span class="sym">${esc(x.ipa)}</span>
          <span class="ex">${esc(x.words[0].en)}</span>
        </button>`;
      }).join('');
    };
    build('vowel', $('#grid-vowel'));
    build('consonant', $('#grid-consonant'));

    $('#ipa-detail-slot').innerHTML = '';
    if (phonicsOpen) openIpa(phonicsOpen, false);
  }

  function openIpa(ipa, scroll) {
    const item = PHONICS.items.find((x) => x.ipa === ipa);
    if (!item) return;
    phonicsOpen = ipa;
    TTS.stop();
    const m = state.phonics[ipa] || 0;
    const lvName = ['还没练', '刚认识', '能读准', '已掌握'][m];

    const words = item.words.map((w, i) => `
      <div class="word-row">
        <div><span class="word-main">${esc(w.en)}</span><span class="word-ipa">${esc(w.ipa)}</span>
          <div class="word-cn">${esc(w.cn)}</div></div>
        <button class="icon-btn" data-act="say" data-text="${esc(w.en)}" data-rate="0.75" aria-label="朗读 ${esc(w.en)}">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>`).join('');

    $('#ipa-detail-slot').innerHTML = `
      <div class="ipa-detail">
        <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:16px;flex-wrap:wrap">
          <div>
            <div class="sym-lg">${esc(item.ipa)}</div>
            <div class="hint" style="font-size:var(--step--1);color:var(--ink-mute);margin-top:6px">${esc(item.sub)} · 状态：${lvName}</div>
          </div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            <button class="btn btn-sm" data-act="say" data-text="${esc(item.words.map((w) => w.en).join(', '))}" data-rate="0.75">听例词</button>
            <button class="btn btn-sm" data-act="say" data-text="${esc(item.words[0].en)}" data-rate="0.6">慢速</button>
          </div>
        </div>

        <p style="margin-top:16px;line-height:1.7">${esc(item.tip)}</p>
        <div class="warn">${esc(item.warn)}</div>

        <div style="margin-top:18px">${words}</div>

        <div style="margin-top:20px;padding-top:16px;border-top:1px solid var(--line-soft)">
          <div style="font-size:var(--step--1);color:var(--ink-mute);margin-bottom:8px">这个音你练到什么程度了？诚实一点，它决定明天要不要重练。</div>
          <div style="display:flex;gap:8px;flex-wrap:wrap">
            ${[1, 2, 3].map((lv) => `<button class="btn btn-sm" data-act="set-ipa" data-ipa="${esc(ipa)}" data-lv="${lv}">${['刚认识', '能读准', '已掌握'][lv - 1]}</button>`).join('')}
            ${m > 0 ? `<button class="btn btn-sm btn-ghost" data-act="set-ipa" data-ipa="${esc(ipa)}" data-lv="0">清零</button>` : ''}
          </div>
        </div>
      </div>`;

    if (scroll !== false && !reduceMotion()) {
      $('#ipa-detail-slot').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  function setIpaLevel(ipa, lv) {
    state.phonics[ipa] = Number(lv);
    if (Number(lv) > 0) {
      const r = dayRecord();
      r.p = (r.p || 0) + 1;
    }
    save();
    renderPhonics();
    renderMasthead();
    toast(Number(lv) === 0 ? '已清零' : '已记录：' + ['', '刚认识', '能读准', '已掌握'][lv]);
  }

  /* ============================================================
     03 口语
     ============================================================ */
  const LV_NAME = { 1: 'Level 1 · 能开口', 2: 'Level 2 · 能说清', 3: 'Level 3 · 能讨论' };
  /* 静止时的声波形状：让"这里会动"这件事在按下之前就看得出来 */
  const WAVE_BARS = [6, 11, 17, 9, 21, 13, 7, 15, 20, 10, 6, 14, 18, 8, 12, 16, 7, 11];
  const waveHtml = () => WAVE_BARS.map((h) => `<i style="height:${h}px"></i>`).join('');

  function renderSpeaking() {
    const root = $('#speaking-root');
    if (!speakingTopic) {
      const groups = [1, 2, 3].map((lv) => {
        const items = SPEAKING.filter((s) => s.lv === lv);
        return `
          <div class="section-head"><h2>${LV_NAME[lv]}</h2><span class="hint">${items.length} 个话题</span></div>
          <div class="topic-grid">
            ${items.map((t) => {
              const st = state.speak[t.id];
              return `<button class="topic-card" data-act="open-topic" data-id="${t.id}">
                <span class="name">${esc(t.title)}</span>
                <span class="scene">${esc(t.scene)}</span>
                <span class="meta"><span>${t.lines.length} 句</span>${st ? `<span>最好 ${st.best} 分</span>` : '<span>未练</span>'}</span>
              </button>`;
            }).join('')}
          </div>`;
      }).join('');
      root.innerHTML = groups;
      return;
    }

    const t = SPEAKING.find((x) => x.id === speakingTopic);
    if (!t) { speakingTopic = null; renderSpeaking(); return; }
    const st = state.speak[t.id];

    root.innerHTML = `
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:6px">
        <button class="btn btn-sm btn-ghost" data-act="back-topics">← 全部话题</button>
        ${st ? `<span class="hint" style="font-size:var(--step--1);color:var(--ink-mute)">最好成绩 ${st.best} 分 · 练过 ${st.tries} 次</span>` : ''}
      </div>
      <div class="section-head"><h2>${esc(t.title)}</h2><span class="hint">${LV_NAME[t.lv]}</span></div>
      <p style="color:var(--ink-soft);max-width:68ch;line-height:1.7">${esc(t.scene)}</p>

      <div class="drill" id="drill-body">
        ${t.lines.map((l, i) => `
          <div class="drill-line" data-line="${i}">
            <div>
              <div class="en">${esc(l.en)}</div>
              <div class="cn">${esc(l.cn)}</div>
              <div class="tip">${esc(l.tip)}</div>
              <div class="wave" data-wave="${i}" aria-hidden="true">${waveHtml()}</div>
              <div data-result="${i}"></div>
            </div>
            <div class="drill-tools">
              <button class="icon-btn" data-act="say" data-text="${esc(l.en)}" aria-label="朗读这一句">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
              </button>
              <button class="btn btn-sm" data-act="shadow" data-topic="${t.id}" data-idx="${i}">跟读</button>
              <button class="btn btn-sm btn-ghost" data-act="say" data-text="${esc(l.en)}" data-rate="0.62">慢速</button>
            </div>
          </div>`).join('')}
      </div>

      <div class="prompts">
        <h3>练完句子，试着回答这三个追问</h3>
        <div style="font-size:var(--step--1);color:var(--ink-mute);margin-bottom:8px">看到问题先自己说一遍，再看下一句——不要先想中文。</div>
        ${t.prompts.map((p) => `
          <div class="prompt-q">
            <span class="q">${esc(p)}</span>
            <button class="icon-btn" data-act="say" data-text="${esc(p)}" aria-label="朗读问题" style="width:30px;height:30px">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>`).join('')}
      </div>`;
  }

  async function shadow(topicId, idx) {
    const t = SPEAKING.find((x) => x.id === topicId);
    if (!t) return;
    const line = t.lines[idx];
    const wave = $(`[data-wave="${idx}"]`);
    const out = $(`[data-result="${idx}"]`);
    if (!out) return;

    if (!SRClass) {
      out.innerHTML = `<div class="verdict no">${esc(SR_MSG.unsupported)}</div>`;
      return;
    }

    TTS.stop();
    if (wave) wave.classList.add('is-live');
    out.innerHTML = `<div class="score"><span class="num" style="color:var(--ink-mute)">…</span>
      <span class="msg">正在听，请读这句话。</span></div>`;

    const res = await listenOnce((live) => {
      const el = out.querySelector('.heard');
      if (el) el.textContent = live;
    });

    if (wave) wave.classList.remove('is-live');

    if (res.error) {
      out.innerHTML = `<div class="verdict no">${esc(SR_MSG[res.error] || ('识别出错：' + res.error))}</div>`;
      return;
    }

    const r = scoreAttempt(line.en, res.text);
    const cls = r.score >= 88 ? 'good' : r.score >= 68 ? 'mid' : 'low';
    const msg = r.score >= 88 ? '几乎一致。这个句子可以过了。'
      : r.score >= 68 ? '能听懂，但有个别词没读准或漏了。看下面标红的部分。'
      : '对方要费点力。先听一遍原声，再慢速跟一遍。';

    const diff = r.ref.map((w, i) => r.hits[i]
      ? `<b>${esc(w)}</b>`
      : `<s>${esc(w)}</s>`).join('');

    out.innerHTML = `
      <div class="score ${cls}">
        <span class="num">${r.score}</span>
        <span>
          <span class="msg">${esc(msg)}</span>
          ${res.text ? `<span class="heard">听到的是：${esc(res.text)}</span>` : ''}
        </span>
      </div>
      <div class="diff">${diff}</div>`;

    // 记录
    const prev = state.speak[topicId] || { best: 0, tries: 0 };
    state.speak[topicId] = { best: Math.max(prev.best, r.score), tries: prev.tries + 1 };
    const rec = dayRecord();
    rec.s = (rec.s || 0) + 1;
    save();
    renderMasthead();
  }

  /* ============================================================
     04 词汇
     ============================================================ */
  function srsNext(current, known) {
    // s: 0 新 → 1 → 2 → 3 → 4 → 5 熟练；间隔 1,2,4,8,16 天
    let s = current || 0;
    if (known === 'know') s = Math.min(5, s + 1);
    else if (known === 'fuzzy') s = Math.max(1, s);
    else s = 1;
    const gaps = [1, 1, 2, 4, 8, 16];
    const due = addDays(todayKey(), gaps[s] || 16);
    return { s, due };
  }

  function buildQueue(level) {
    const due = dueWords(level);
    // 新词优先少量，混入复习
    return due.slice().sort((a, b) => {
      const sa = state.words[a.w], sb = state.words[b.w];
      const rank = (x) => (!x ? 0 : x.s === 0 ? 1 : 2);
      return rank(sa) - rank(sb);
    }).slice(0, 20);
  }

  function renderWords() {
    /* 先同步模式切换控件 */
    $$('#word-mode-seg button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.mode === zkMode));
    });
    const isUnit = zkMode === 'unit';
    $('#word-level-row').hidden = isUnit;
    $('#words-all-block').hidden = isUnit;

    if (isUnit) {
      $('#words-h2').textContent = zkUnit ? '单元复习' : '中考词汇';
      renderZhongkao();
      return;
    }

    $('#words-h2').textContent = '复习';

    const level = wordsLevel === 'all' ? null : wordsLevel;
    reviewQueue = buildQueue(wordsLevel);
    reviewIndex = 0;
    reviewFlipped = false;

    const host = $('#words-review');
    if (!reviewQueue.length) {
      host.innerHTML = `<div class="empty">这个词表今天没有待复习的卡片。<br>可以切到别的级别，或者明天再来。</div>`;
    } else {
      renderReviewCard();
    }

    const list = WORD_BANK.filter((w) => !level || w.lv === level);
    $('#words-count').textContent = `${list.length} 个 · 已学 ${list.filter((w) => (state.words[w.w] || {}).s > 0).length}`;
    $('#words-list').innerHTML = list.map((w) => {
      const st = state.words[w.w] || { s: 0 };
      const cls = st.s === 0 ? 'new' : st.s >= 4 ? 'known' : 'learning';
      return `<div class="word-item">
        <div><span class="w">${esc(w.w)}</span> <span class="i">${esc(w.i)}</span></div>
        <span class="dot" data-s="${cls}" title="${cls}"></span>
        <span class="c">${esc(w.c)}</span>
      </div>`;
    }).join('');

    $$('#word-level-seg button').forEach((b) => {
      b.setAttribute('aria-pressed', String(b.dataset.lv === wordsLevel));
    });
  }

  /* ============================================================
     中考词汇：按单元 + 两种题型随机
     ============================================================ */
  const normEn = (s) => String(s == null ? '' : s)
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[^a-z0-9'\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  function zkAllWords() {
    return ZHONGKAO.reduce((a, u) => a.concat(u.words), []);
  }
  function zkLearnedCount() {
    return zkAllWords().filter((w) => ((state.zk[w.e] || {}).s || 0) > 0).length;
  }

  function buildZkQueue(unit) {
    const today = todayKey();
    zkQueue = unit.words.map((w) => {
      const st = state.zk[w.e] || { s: 0, due: today };
      return { w, st };
    }).sort((a, b) => {
      const rank = (x) => ((x.st.s || 0) === 0 ? 0 : (x.st.due <= today ? 1 : 2));
      const ra = rank(a), rb = rank(b);
      if (ra !== rb) return ra - rb;
      return (a.st.s || 0) - (b.st.s || 0);
    });
    zkIndex = 0;
    zkQuestion = null;
    zkStat = { right: 0, wrong: 0 };
  }

  /* 出一题：一半给中文写英文，一半给英文选中文 */
  function makeZkQuestion(word, unit, idx) {
    const mode = Math.random() < 0.5 ? 'cn2en' : 'en2cn';
    const q = { idx, mode, word, answered: false, ok: null };

    if (mode === 'en2cn') {
      const seenCn = new Set([word.c]);
      const others = [];
      for (const cand of unit.words.slice().sort(() => Math.random() - 0.5)) {
        if (cand.e === word.e || seenCn.has(cand.c)) continue;
        seenCn.add(cand.c);
        others.push(cand);
        if (others.length === 3) break;
      }
      const opts = [word].concat(others).map((x) => ({ e: x.e, c: x.c }));
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]];
      }
      q.options = opts;
      q.answerIndex = opts.findIndex((x) => x.e === word.e);
    }
    return q;
  }

  function renderZhongkao() {
    const host = $('#words-review');

    /* 单元列表：按 U1–U5 分组 */
    if (!zkUnit) {
      const total = zkAllWords().length;
      const groups = {};
      ZHONGKAO.forEach((u) => {
        const g = String(u.unit).split('-')[0];
        (groups[g] = groups[g] || []).push(u);
      });

      const groupHtml = Object.keys(groups).map((g) => {
        const cards = groups[g].map((u) => {
          const learned = u.words.filter((w) => ((state.zk[w.e] || {}).s || 0) > 0).length;
          const pct = Math.round((learned / u.words.length) * 100);
          return `<button class="topic-card" data-act="zk-open" data-id="${u.id}">
            <span class="zk-eps">${esc(u.eps)}</span>
            <span class="name">${esc(u.unit)} · ${esc(u.title)}</span>
            <span class="scene">${esc(u.desc)}</span>
            <span class="meta"><span>${u.words.length} 词</span><span>已学 ${learned} · ${pct}%</span></span>
          </button>`;
        }).join('');
        return `<div class="zk-group-title">${esc(g)}</div>
          <div class="topic-grid">${cards}</div>`;
      }).join('');

      host.innerHTML = `
        <p style="color:var(--ink-soft);max-width:68ch;line-height:1.8">
          按她课程的 <strong>5 个 Unit、20 个 Lesson</strong> 分好，共 ${total} 个词，顺序和视频一致。
          每题随机是 <strong>给中文写英文</strong> 或 <strong>给英文选中文</strong>；答错会自动排到下一轮前面。
          <br><span style="color:var(--ink-mute);font-size:var(--step--1)">
          标「视频重点词」的是官方分集目录里点名的词；其余是按同课话题补的中考高频词。</span>
        </p>
        ${groupHtml}`;
      return;
    }

    const unit = ZHONGKAO.find((x) => x.id === zkUnit);
    if (!unit) { zkUnit = null; renderZhongkao(); return; }
    if (!zkQueue.length) buildZkQueue(unit);
    renderZkCard(unit);
  }

  function renderZkCard(unit) {
    const host = $('#words-review');

    /* 一轮做完 */
    if (zkIndex >= zkQueue.length) {
      const total = zkStat.right + zkStat.wrong;
      const rate = total ? Math.round((zkStat.right / total) * 100) : 0;
      host.innerHTML = `
        <div class="card-review">
          <div class="zk-meta">${esc(unit.unit)} · ${esc(unit.title)}</div>
          <div class="zk-done-num">${rate}<span style="font-size:.45em;color:var(--ink-mute)">%</span></div>
          <div class="zk-done-label">这一轮正确率 · 对 ${zkStat.right} / 错 ${zkStat.wrong}</div>
          <div class="review-actions">
            <button class="btn btn-primary" data-act="zk-restart">再过一轮</button>
            <button class="btn btn-ghost" data-act="zk-back">换一个单元</button>
          </div>
        </div>`;
      return;
    }

    if (!zkQuestion || zkQuestion.idx !== zkIndex) {
      zkQuestion = makeZkQuestion(zkQueue[zkIndex].w, unit, zkIndex);
    }
    const q = zkQuestion;
    const w = q.word;

    const head = `<div class="zk-meta">${zkIndex + 1} / ${zkQueue.length} · ${esc(unit.unit)} · ${q.mode === 'cn2en' ? '给中文写英文' : '给英文选中文'}</div>`;

    if (q.mode === 'cn2en') {
      host.innerHTML = `
        <div class="card-review">
          ${head}
          <div class="zk-prompt-cn">${esc(w.c)}</div>
          <div class="zk-pos">${esc(w.p)}${w.v ? ' <span class="zk-vtag">视频重点词</span>' : ''}</div>
          ${q.answered ? '' : `
            <input class="zk-input" id="zk-input" autocomplete="off" autocapitalize="off"
                   autocorrect="off" spellcheck="false" placeholder="在这里写英文" aria-label="输入英文答案">
            <div class="review-actions">
              <button class="btn btn-primary" data-act="zk-submit">提交</button>
              <button class="btn btn-ghost" data-act="zk-skip">不会，直接看答案</button>
            </div>`}
          <div id="zk-feedback"></div>
        </div>`;
      if (!q.answered) {
        const inp = $('#zk-input');
        if (inp) inp.focus();
      }
    } else {
      host.innerHTML = `
        <div class="card-review">
          ${head}
          <div class="word">${esc(w.e)}</div>
          <div class="ipa">${esc(w.i)} <span style="color:var(--line-strong)">|</span> ${esc(w.p)}</div>
          ${w.v ? '<div style="margin-top:10px"><span class="zk-vtag">视频重点词</span></div>' : ''}
          <div style="display:flex;justify-content:center;margin-top:14px">
            <button class="icon-btn" data-act="say" data-text="${esc(w.e)}" data-rate="0.8" aria-label="朗读">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            </button>
          </div>
          <div class="options" style="margin:18px auto 0;text-align:left">
            ${q.options.map((o, oi) => `
              <button class="opt" data-act="zk-choose" data-oi="${oi}" ${q.answered ? 'disabled' : ''}>
                <span class="letter">${'ABCD'[oi]}</span>
                <span class="text">${esc(o.c)}</span>
              </button>`).join('')}
          </div>
          <div id="zk-feedback"></div>
        </div>`;
    }

    if (q.answered) paintZkFeedback(w, q);
  }

  function paintZkFeedback(w, q) {
    const fb = $('#zk-feedback');
    if (!fb) return;

    if (q.mode === 'en2cn') {
      $$('#words-review .opt').forEach((b, i) => {
        b.disabled = true;
        if (i === q.answerIndex) b.classList.add('is-correct');
        else if (i === q.answerChosen && !q.ok) b.classList.add('is-wrong');
      });
    }

    const correctLine = `
      <div class="zk-answer">
        <span class="zk-answer-en">${esc(w.e)}</span>
        <span class="zk-answer-ipa">${esc(w.i)}</span>
        <span class="zk-answer-cn">${esc(w.c)}</span>
        <button class="icon-btn" data-act="say" data-text="${esc(w.e)}" data-rate="0.8" aria-label="朗读正确答案" style="width:32px;height:32px">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
        </button>
      </div>`;

    fb.innerHTML = `
      <div class="verdict ${q.ok ? 'ok' : 'no'}">
        <strong>${q.ok ? '对了。' : (q.skipped ? '没关系，看一遍再记。' : '没对。')}</strong>
        ${q.mode === 'cn2en' && !q.ok && q.typed ? `你写的是 <b>${esc(q.typed)}</b>。` : ''}
      </div>
      ${correctLine}
      <div class="review-actions">
        <button class="btn btn-primary" data-act="zk-next">${zkIndex + 1 >= zkQueue.length ? '完成本轮' : '下一题'}</button>
      </div>`;
  }

  function zkFinish(ok, typed, skipped) {
    if (!zkQuestion || zkQuestion.answered) return;
    const q = zkQuestion;
    const w = q.word;
    q.answered = true;
    q.ok = !!ok;
    q.typed = typed || '';
    q.skipped = !!skipped;

    /* 记 SRS：答对才升级，答错归零（这样"已学"= 至少答对过一次，不会虚高） */
    const cur = state.zk[w.e] || { s: 0, seen: 0, right: 0, wrong: 0 };
    const gaps = [1, 1, 2, 4, 8, 16];
    const s = ok ? Math.min(5, (cur.s || 0) + 1) : 0;
    state.zk[w.e] = {
      s,
      due: addDays(todayKey(), gaps[s] || 16),
      seen: (cur.seen || 0) + 1,
      right: (cur.right || 0) + (ok ? 1 : 0),
      wrong: (cur.wrong || 0) + (ok ? 0 : 1)
    };

    if (ok) zkStat.right++; else zkStat.wrong++;

    /* 计入今日"词汇"任务 */
    const rec = dayRecord();
    rec.w = (rec.w || 0) + 1;

    save();
    renderMasthead();
    renderZkCard(ZHONGKAO.find((x) => x.id === zkUnit));
  }

  function zkSubmit() {
    if (!zkQuestion || zkQuestion.answered) return;
    const input = $('#zk-input');
    if (!input) return;
    const typed = input.value;
    const ok = normEn(typed) === normEn(zkQuestion.word.e);
    zkFinish(ok, typed, false);
  }

  function zkChoose(oi) {
    if (!zkQuestion || zkQuestion.answered) return;
    const idx = Number(oi);
    zkQuestion.answerChosen = idx;
    zkFinish(idx === zkQuestion.answerIndex, '', false);
  }

  function renderReviewCard() {
    const host = $('#words-review');
    const w = reviewQueue[reviewIndex];
    if (!w) {
      host.innerHTML = `<div class="empty">
        这一轮过完了（${reviewQueue.length} 张）。<br>
        <button class="btn btn-sm" data-act="reset-queue" style="margin-top:14px">再翻一轮</button>
      </div>`;
      return;
    }

    const st = state.words[w.w];
    const isNew = !st || st.s === 0;

    host.innerHTML = `
      <div class="card-review">
        <div style="font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:14px">
          ${reviewIndex + 1} / ${reviewQueue.length} · ${w.lv} · ${isNew ? '新词' : '复习'}
        </div>
        <div class="word">${esc(w.w)}</div>
        <div class="ipa">${esc(w.i)} <span style="color:var(--line-strong)">|</span> ${esc(w.p)}</div>

        <div style="display:flex;justify-content:center;gap:8px;margin-top:16px">
          <button class="icon-btn" data-act="say" data-text="${esc(w.w)}" data-rate="0.8" aria-label="朗读单词">
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
          </button>
          <button class="btn btn-sm" data-act="say" data-text="${esc(w.e)}" data-rate="0.8">听例句</button>
        </div>

        ${reviewFlipped ? `
          <div class="answer-block">
            <div class="cn">${esc(w.c)}</div>
            <div class="ex">${esc(w.e)}</div>
            <div class="ex-cn">${esc(w.t)}</div>
          </div>` : `
          <div class="answer-block" style="border-top-color:transparent">
            <button class="btn btn-primary" data-act="flip">看答案</button>
            <div class="ex-cn" style="margin-top:10px">先在心里想中文意思，再翻</div>
          </div>`}

        ${reviewFlipped ? `
          <div class="review-actions">
            <button class="btn" data-act="rate" data-rate="again">不认识</button>
            <button class="btn" data-act="rate" data-rate="fuzzy">有点模糊</button>
            <button class="btn btn-amber" data-act="rate" data-rate="know">认识</button>
          </div>` : ''}
      </div>`;
  }

  function rateWord(kind) {
    const w = reviewQueue[reviewIndex];
    if (!w) return;
    const cur = (state.words[w.w] || {}).s || 0;
    const next = srsNext(cur, kind);
    state.words[w.w] = { s: next.s, due: next.due, seen: ((state.words[w.w] || {}).seen || 0) + 1 };

    const rec = dayRecord();
    rec.w = (rec.w || 0) + 1;
    save();

    reviewIndex++;
    reviewFlipped = false;
    renderReviewCard();
    renderMasthead();
  }

  /* ============================================================
     05 四级
     ============================================================ */
  function renderCet4() {
    $$('#view-cet4 .subtab').forEach((b) => {
      b.setAttribute('aria-selected', String(b.dataset.tab === cet4Tab));
    });
    const host = $('#cet4-panel');
    if (cet4Tab === 'listening') host.innerHTML = cet4Listening();
    else if (cet4Tab === 'reading') host.innerHTML = cet4Reading();
    else if (cet4Tab === 'writing') host.innerHTML = cet4Writing();
    else host.innerHTML = cet4Translation();
  }

  function cet4Listening() {
    return `<p style="color:var(--ink-mute);font-size:var(--step--1);margin:14px 0 0;max-width:64ch">
      点「播放」先盲听一遍，再选答案。做完可以看原文——但只在你已经选过之后看，否则练的是阅读，不是听力。</p>
      ${CET4_LISTENING.map((item, i) => {
        const done = state.cet4.listening[item.id];
        return `<div class="listen-card" data-listen="${item.id}">
          <div class="listen-head">
            <span class="n">${String(i + 1).padStart(2, '0')}</span>
            <button class="icon-btn" data-act="say" data-text="${esc(item.transcript)}" aria-label="播放这段对话">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>
            </button>
            <button class="btn btn-sm btn-ghost" data-act="say" data-text="${esc(item.transcript)}" data-rate="0.65">慢速</button>
            <span style="font-size:var(--step--1);color:var(--ink-mute);margin-left:auto">${done ? '已做' : ''}</span>
          </div>
          <p style="margin-top:14px;font-family:var(--font-lang);font-size:var(--step-1)">${esc(item.question)}</p>
          <div class="options">
            ${item.options.map((o, oi) => `
              <button class="opt" data-act="pick" data-listen="${item.id}" data-oi="${oi}">
                <span class="letter">${'ABCD'[oi]}</span>
                <span class="text">${esc(o)}</span>
              </button>`).join('')}
          </div>
          <div data-feedback="${item.id}"></div>
        </div>`;
      }).join('')}`;
  }

  function pickListening(id, oi) {
    const item = CET4_LISTENING.find((x) => x.id === id);
    if (!item) return;
    const wrap = $(`[data-listen="${id}"]`);
    const ok = Number(oi) === item.answer;

    $$('.opt', wrap).forEach((b, i) => {
      b.disabled = true;
      if (i === item.answer) b.classList.add('is-correct');
      else if (i === Number(oi)) b.classList.add('is-wrong');
    });

    const fb = $(`[data-feedback="${id}"]`);
    fb.innerHTML = `
      <div class="verdict ${ok ? 'ok' : 'no'}">
        <strong>${ok ? '对了。' : '不对，正确答案是 ' + 'ABCD'[item.answer] + '。'}</strong>
        ${esc(item.explain)}
      </div>
      <details style="margin-top:10px">
        <summary style="cursor:pointer;font-size:var(--step--1);color:var(--ink-mute)">看原文</summary>
        <div class="transcript">${esc(item.transcript)}</div>
      </details>`;

    if (!state.cet4.listening[id]) {
      state.cet4.listening[id] = ok ? 'ok' : 'no';
      save();
      renderMasthead();
    }
  }

  function cet4Reading() {
    return CET4_READING.map((passage, pi) => `
      <article class="reading">
        <div style="font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px">
          Passage ${pi + 1}</div>
        <h3>${esc(passage.title)}</h3>
        <div class="passage">${passage.text.split(/\n\n+/).map((p) => `<p>${esc(p)}</p>`).join('')}</div>
        ${passage.questions.map((q, qi) => `
          <div style="margin-top:22px" data-q="${passage.id}-${qi}">
            <p style="font-size:var(--step-0);font-weight:600">${qi + 1}. ${esc(q.q)}</p>
            <div class="options">
              ${q.options.map((o, oi) => `
                <button class="opt" data-act="pick-read" data-p="${passage.id}" data-q="${qi}" data-oi="${oi}">
                  <span class="letter">${'ABCD'[oi]}</span>
                  <span class="text">${esc(o)}</span>
                </button>`).join('')}
            </div>
            <div data-readfb="${passage.id}-${qi}"></div>
          </div>`).join('')}
      </article>`).join('');
  }

  function pickReading(pid, qi, oi) {
    const p = CET4_READING.find((x) => x.id === pid);
    if (!p) return;
    const q = p.questions[qi];
    const wrap = $(`[data-q="${pid}-${qi}"]`);
    const ok = Number(oi) === q.answer;
    $$('.opt', wrap).forEach((b, i) => {
      b.disabled = true;
      if (i === q.answer) b.classList.add('is-correct');
      else if (i === Number(oi)) b.classList.add('is-wrong');
    });
    $(`[data-readfb="${pid}-${qi}"]`).innerHTML =
      `<div class="verdict ${ok ? 'ok' : 'no'}"><strong>${ok ? '对了。' : '正确答案是 ' + 'ABCD'[q.answer] + '。'}</strong>${esc(q.explain)}</div>`;
    const key = pid + '-' + qi;
    if (!state.cet4.reading[key]) {
      state.cet4.reading[key] = ok ? 'ok' : 'no';
      save();
      renderMasthead();
    }
  }

  function cet4Writing() {
    return CET4_WRITING.map((w) => `
      <article class="reading">
        <div style="font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px">
          ${esc(w.type)}</div>
        <h3>${esc(w.title)}</h3>

        <div class="section-head" style="margin:18px 0 4px"><h2 style="font-size:var(--step-1)">结构框架</h2>
          <span class="hint">先照着这个写三句，再扩成三段</span></div>
        ${w.frame.map((f, i) => `
          <div class="frame-step">
            <span class="k">${i + 1}</span>
            <div>
              <div class="cn">${esc(f.cn)}</div>
              <div class="en">${esc(f.en)}</div>
            </div>
          </div>`).join('')}

        <details style="margin-top:18px">
          <summary style="cursor:pointer;font-size:var(--step-0);color:var(--amber-deep);font-weight:600">展开范文</summary>
          <div class="model-text" style="margin-top:14px">${esc(w.model)}</div>
          <div class="phrase-pills">${w.phrases.map((p) => `<span>${esc(p)}</span>`).join('')}</div>
        </details>
      </article>`).join('');
  }

  function cet4Translation() {
    return CET4_TRANSLATION.map((t, i) => `
      <article class="reading">
        <div style="font-family:var(--font-mono);font-size:.6875rem;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-mute);margin-bottom:8px">
          练习题 ${i + 1}</div>
        <h3>${esc(t.topic)}</h3>
        <div class="trans-cn" style="margin-top:14px">${esc(t.cn)}</div>

        <div style="margin-top:16px;font-size:var(--step--1);color:var(--ink-mute)">
          翻译采分点：四级翻译按"信息完整 + 语法正确 + 用词准确"给分，不会因为一个小词扣光。先把每句的主谓写对。</div>

        <details style="margin-top:16px">
          <summary style="cursor:pointer;font-size:var(--step-0);color:var(--amber-deep);font-weight:600">对照参考译文</summary>
          <div class="model-text" style="margin-top:14px">${esc(t.ref)}</div>
        </details>

        <table class="point-table">
          <thead><tr><th>采分点</th><th>参考表达</th></tr></thead>
          <tbody>
            ${t.points.map((p) => `<tr><td>${esc(p.cn)}</td><td class="en">${esc(p.en)}</td></tr>`).join('')}
          </tbody>
        </table>
      </article>`).join('');
  }

  /* ============================================================
     06 进度
     ============================================================ */
  /* 进度存档：localStorage 会被清缓存带走，长期备考不能只靠它 */
  let pendingImport = null;   // { data, name, summary }

  function exportProgress() {
    flushSave();
    try {
      const payload = JSON.stringify(state, null, 2);
      const blob = new Blob([payload], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = '英语工作台-进度-' + todayKey() + '.json';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1500);

      state.settings.lastExportAt = Date.now();
      writeNow();
      document.dispatchEvent(new CustomEvent('wb-saved'));
      renderProgress();
      toast('已导出，文件在浏览器的下载文件夹里');
    } catch (e) {
      toast('导出失败：' + e.message);
    }
  }

  function pickImportFile() {
    const inp = document.createElement('input');
    inp.type = 'file';
    inp.accept = '.json,application/json';
    inp.onchange = () => { if (inp.files && inp.files[0]) readImport(inp.files[0]); };
    inp.click();
  }

  /* 先解析、先给用户看要导入什么，再让他决定覆不覆盖。
     直接覆盖是最容易让人丢掉几个月记录的一步。 */
  function readImport(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result));
        if (!data || typeof data !== 'object' || !data.days || typeof data.days !== 'object') {
          throw new Error('这个文件里没有工作台的进度数据');
        }
        pendingImport = { data, name: file.name, summary: summarize(data) };
        renderProgress();
        const panel = $('#archive-panel');
        if (panel) panel.scrollIntoView({ block: 'nearest', behavior: reduceMotion() ? 'auto' : 'smooth' });
      } catch (e) {
        pendingImport = null;
        toast('读不了这个文件：' + e.message);
        renderProgress();
      }
    };
    reader.onerror = () => toast('读不了这个文件');
    reader.readAsText(file);
  }

  function confirmImport() {
    if (!pendingImport) return;
    state = Object.assign(defaultState(), pendingImport.data);
    const d = defaultState();
    state.settings = Object.assign(d.settings, state.settings || {});
    state.cet4 = Object.assign(d.cet4, state.cet4 || {});
    pendingImport = null;
    clearTimeout(saveTimer);
    saveTimer = null;
    writeNow();
    document.dispatchEvent(new CustomEvent('wb-saved'));
    go('progress');
    toast('进度已恢复');
  }

  function renderProgress() {
    const s = streakCount();
    const wl = wordsLearned();
    const total = WORD_BANK.length;
    const pm = phonicsMastered();
    const sp = avgSpeak();
    const doneCet = Object.values(state.cet4).reduce((a, o) => a + Object.keys(o).length, 0);
    const dd = daysToExam();

    /* 存档面板要用的状态 */
    const saveSt = saveStatusText();
    const cur = summarize(state);
    const exportAgo = state.settings.lastExportAt ? ago(state.settings.lastExportAt) : '从未导出';
    const exportStale = !!(state.settings.lastExportAt && (Date.now() - state.settings.lastExportAt) > 7 * 86400000);

    const pct = (a, b) => b ? Math.round((a / b) * 100) : 0;

    const bar = (label, val, max, note) => `
      <div class="bar-row">
        <span class="lab">${esc(label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${pct(val, max)}%"></span></span>
        <span class="val">${val}/${max}</span>
      </div>`;

    $('#progress-root').innerHTML = `
      <div class="stat-row">
        <div class="stat"><div class="v">${s}</div><div class="k">连续天数</div></div>
        <div class="stat"><div class="v">${wl}</div><div class="k">学过的词</div></div>
        <div class="stat"><div class="v">${sp == null ? '—' : sp}</div><div class="k">跟读平均分</div></div>
        <div class="stat"><div class="v">${doneCet}</div><div class="k">四级已完成题组</div></div>
      </div>

      <div class="section-head"><h2>三条主线的实际进度</h2>
        <span class="hint">分母是这套材料的全部内容，不是四级的全部要求</span></div>
      <div class="bars">
        ${bar('发音', pm, 48)}
        ${bar('词汇', wl, total)}
        ${bar('口语话题', Object.keys(state.speak).length, 18)}
        ${bar('四级题组', doneCet, 20)}
      </div>

      <div class="note">
        <strong>关于时间预期，说实话：</strong>初一水平到四级，词汇量大约要从 1500 补到 4500，正常需要一年到一年半的持续投入，不是三个月能追上的。
        ${dd != null && dd > 0
          ? `现在距考试 ${dd} 天。按每天 ${state.settings.minutesPerDay} 分钟算，你能覆盖的是一条"及格线路线"：先把四级高频词过两遍、把四类题型各做一遍、作文背熟三个框架。不要指望全线铺开。`
          : '先在工作台右上角设一个考试日期，这里会给出更具体的每日安排。'}
        <br><br>
        <strong>评分只用来看方向：</strong>跟读分低于 70，说明那个音你还没建立口型，回去练发音模块，别硬刷句子。
      </div>

      <div class="section-head"><h2>进度存档</h2>
        <span class="hint">存在这台电脑的浏览器里，不会上传</span></div>
      <div class="archive" id="archive-panel">
        <dl class="archive-status">
          <div>
            <dt>自动保存</dt>
            <dd class="${saveSt.ok ? '' : 'is-bad'}">${esc(saveSt.text)}</dd>
          </div>
          <div>
            <dt>上次导出</dt>
            <dd class="${exportStale ? 'is-warn' : ''}">${esc(exportAgo)}</dd>
          </div>
        </dl>

        <p class="archive-note">换电脑、清浏览器缓存、换一个浏览器打开，进度都会归零。每周导出一次，需要的时候导回来就行。导出的文件会落到浏览器的下载文件夹。</p>

        <div class="archive-actions">
          <button class="btn btn-sm btn-primary" data-act="export">导出进度文件</button>
          <button class="btn btn-sm" data-act="import">导入文件</button>
          <button class="btn btn-sm btn-ghost" data-act="reset-all">全部清零</button>
        </div>

        ${!STORAGE_OK ? `
          <div class="verdict no" style="margin-top:14px">
            <strong>这台浏览器不让本地存储。</strong>关掉页面进度就会丢。把这一页用 Edge 打开能解决；否则请现在就导出，下次打开后先导入再继续。
          </div>` : ''}

        ${exportStale ? `
          <div class="verdict" style="margin-top:14px;background:var(--warn-wash);color:#6d4f1c">
            已经 ${esc(exportAgo)}没导出了。清一次浏览器缓存就没了，建议现在导一份。
          </div>` : ''}

        ${pendingImport ? `
          <div class="import-preview">
            <div class="ip-head">即将导入 <b>${esc(pendingImport.name)}</b></div>
            <div class="ip-body">${pendingImport.summary.activeDays} 天学习记录 · ${pendingImport.summary.words} 个词 · ${pendingImport.summary.phonics} 个音标 · ${pendingImport.summary.topics} 个口语话题 · ${pendingImport.summary.cet4} 道四级题</div>
            <div class="ip-warn">会覆盖当前进度（现在是 ${cur.activeDays} 天 · ${cur.words} 个词）。覆盖之后旧进度找不回来。</div>
            <div class="ip-acts">
              <button class="btn btn-sm btn-amber" data-act="confirm-import">确认覆盖</button>
              <button class="btn btn-sm btn-ghost" data-act="cancel-import">取消</button>
            </div>
          </div>` : ''}
      </div>`;
  }

  /* ============================================================
     路由
     ============================================================ */
  function go(view) {
    if (!VIEWS[view]) view = 'today';
    currentView = view;
    TTS.stop();
    $$('.nav-item').forEach((b) => b.setAttribute('aria-current', String(b.dataset.go === view)));
    $$('.view').forEach((v) => { v.hidden = v.id !== 'view-' + view; });
    renderMasthead();
    if (view === 'today') renderToday();
    else if (view === 'phonics') renderPhonics();
    else if (view === 'speaking') renderSpeaking();
    else if (view === 'words') renderWords();
    else if (view === 'cet4') renderCet4();
    else if (view === 'progress') renderProgress();
    try { history.replaceState(null, '', '#' + view); } catch (e) {}
    window.scrollTo({ top: 0, behavior: reduceMotion() ? 'auto' : 'smooth' });
  }

  /* ============================================================
     设置弹层
     ============================================================ */
  function fillVoiceSelect() {
    const sel = $('#in-voice');
    if (!TTS.voices.length) {
      sel.innerHTML = '<option value="">系统没提供英语语音</option>';
      $('#voice-note').textContent = '你的系统可能还没装英语语音包。Windows：设置 → 时间和语言 → 语音 → 添加语音。';
      return;
    }
    sel.innerHTML = TTS.voices.map((v) =>
      `<option value="${esc(v.voiceURI)}" ${TTS.picked && v.voiceURI === TTS.picked.voiceURI ? 'selected' : ''}>${esc(v.name)} · ${esc(v.lang)}</option>`
    ).join('');
    $('#voice-note').textContent = '建议选带 natural / neural 字样的音色，听起来更接近真人。';
  }

  function openSheet() {
    $('#in-exam').value = state.settings.examDate || '';
    $('#in-perday').value = state.settings.minutesPerDay || 30;
    fillVoiceSelect();
    renderEnvCheck();
    $('#sheet').hidden = false;
    $('#in-exam').focus();
  }

  /* 环境自检：让用户先知道这台机器上哪部分能用，而不是点下去才发现没反应 */
  function renderEnvCheck() {
    const box = $('#env-check');
    if (!box) return;
    const ttsOk = 'speechSynthesis' in window && TTS.voices.length > 0;
    const srOk = !!SRClass;
    const micHint = window.isSecureContext
      ? '第一次会弹麦克风权限，点允许。'
      : '当前不是安全环境，浏览器可能不给你麦克风。用 Edge 打开这一页即可。';

    const row = (ok, label, detail) => `
      <div style="display:flex;gap:10px;align-items:flex-start;padding:8px 0;border-bottom:1px solid var(--line-soft)">
        <span style="flex:0 0 auto;width:8px;height:8px;border-radius:999px;margin-top:7px;background:${ok ? 'var(--good)' : 'var(--bad)'}"></span>
        <span style="min-width:0">
          <span style="font-size:var(--step--1);color:var(--ink)">${esc(label)}</span>
          <span style="display:block;font-size:.75rem;color:var(--ink-mute);line-height:1.6">${esc(detail)}</span>
        </span>
      </div>`;

    box.innerHTML =
      row(ttsOk, ttsOk ? '朗读：可用' : '朗读：不可用',
        ttsOk ? ('当前音色 ' + (TTS.picked ? TTS.picked.name : '默认') + '，可以先点「慢速」听一遍。')
              : '系统没有英语语音。Windows：设置 → 时间和语言 → 语音 → 添加语音包。') +
      row(srOk, srOk ? '跟读打分：可用' : '跟读打分：这台浏览器不支持',
        srOk ? micHint : '换 Edge 或 Chrome 打开，就能录音比对。');
  }
  function closeSheet() { $('#sheet').hidden = true; }

  function saveSettings() {
    const d = $('#in-exam').value;
    const m = Number($('#in-perday').value) || 30;
    const v = $('#in-voice').value;
    if (d && daysBetween(todayKey(), d) < 0) {
      toast('考试日期已经过去了，换一个未来的日期');
      return;
    }
    state.settings.examDate = d;
    state.settings.minutesPerDay = Math.max(10, Math.min(240, m));
    state.settings.voiceURI = v;
    state.settings.onboarded = true;
    const hit = TTS.voices.find((x) => x.voiceURI === v);
    if (hit) TTS.picked = hit;
    save();
    closeSheet();
    renderMasthead();
    go(currentView);
    toast('已保存');
  }

  /* ============================================================
     事件
     ============================================================ */
  function bind() {
    // 导航
    document.addEventListener('click', (ev) => {
      const goEl = ev.target.closest('[data-go]');
      if (goEl && !goEl.dataset.act) {
        ev.preventDefault();
        go(goEl.dataset.go);
        return;
      }
      const sub = ev.target.closest('.subtab');
      if (sub) { cet4Tab = sub.dataset.tab; renderCet4(); return; }

      const seg = ev.target.closest('#word-level-seg button');
      if (seg) { wordsLevel = seg.dataset.lv; renderWords(); renderMasthead(); return; }

      const btn = ev.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;

      if (act === 'goto') { go(btn.dataset.view); return; }

      if (act === 'say') {
        const text = btn.dataset.text || '';
        const rate = btn.dataset.rate ? Number(btn.dataset.rate) : undefined;
        $$('.icon-btn.is-playing').forEach((b) => b.classList.remove('is-playing'));
        btn.classList.add('is-playing');
        TTS.say(text, { rate, onEnd: () => btn.classList.remove('is-playing') });
        return;
      }

      if (act === 'toggle-task') {
        const rec = dayRecord();
        const which = btn.dataset.task;
        const nowDone = btn.getAttribute('aria-pressed') === 'true';
        if (which === 'phonics') rec.p = nowDone ? 0 : Math.max(1, rec.p || 0);
        if (which === 'speaking') rec.s = nowDone ? 0 : Math.max(1, rec.s || 0);
        if (which === 'words') rec.w = nowDone ? 0 : Math.max(8, rec.w || 0);
        save();
        renderToday();
        renderMasthead();
        return;
      }

      if (act === 'open-ipa') { openIpa(btn.dataset.ipa); return; }
      if (act === 'set-ipa') { setIpaLevel(btn.dataset.ipa, btn.dataset.lv); return; }

      if (act === 'open-topic') { speakingTopic = btn.dataset.id; renderSpeaking(); return; }
      if (act === 'back-topics') { speakingTopic = null; TTS.stop(); renderSpeaking(); return; }
      if (act === 'shadow') {
        const idx = Number(btn.dataset.idx);
        btn.disabled = true;
        btn.textContent = '听着…';
        shadow(btn.dataset.topic, idx).finally(() => {
          btn.disabled = false;
          btn.textContent = '再读一次';
        });
        return;
      }

      if (act === 'flip') { reviewFlipped = true; renderReviewCard(); return; }
      if (act === 'rate') { rateWord(btn.dataset.rate); return; }
      if (act === 'reset-queue') { reviewQueue = buildQueue(wordsLevel); reviewIndex = 0; reviewFlipped = false; renderReviewCard(); return; }

      /* 中考单元 */
      if (act === 'zk-mode') {
        zkMode = btn.dataset.mode === 'unit' ? 'unit' : 'level';
        zkUnit = null; zkQuestion = null; zkQueue = []; zkIndex = 0;
        renderWords(); renderMasthead(); return;
      }
      if (act === 'zk-open') {
        zkUnit = btn.dataset.id;
        zkQuestion = null;
        const u = ZHONGKAO.find((x) => x.id === zkUnit);
        if (u) buildZkQueue(u);
        renderWords(); return;
      }
      if (act === 'zk-back') {
        zkUnit = null; zkQuestion = null; zkQueue = [];
        renderWords(); return;
      }
      if (act === 'zk-restart') {
        const u = ZHONGKAO.find((x) => x.id === zkUnit);
        if (u) { buildZkQueue(u); renderZkCard(u); }
        return;
      }
      if (act === 'zk-submit') { zkSubmit(); return; }
      if (act === 'zk-skip') { zkFinish(false, '', true); return; }
      if (act === 'zk-choose') { zkChoose(btn.dataset.oi); return; }
      if (act === 'zk-next') {
        zkIndex++;
        zkQuestion = null;
        renderZkCard(ZHONGKAO.find((x) => x.id === zkUnit));
        return;
      }

      if (act === 'pick') { pickListening(btn.dataset.listen, btn.dataset.oi); return; }
      if (act === 'pick-read') { pickReading(btn.dataset.p, btn.dataset.q, btn.dataset.oi); return; }

      if (act === 'settings') { openSheet(); return; }

      if (act === 'export') { exportProgress(); return; }
      if (act === 'import') { pickImportFile(); return; }
      if (act === 'confirm-import') { confirmImport(); return; }
      if (act === 'cancel-import') { pendingImport = null; renderProgress(); return; }

      if (act === 'reset-all') {
        if (window.confirm('确定要清空所有进度吗？这个操作无法撤销。建议先导出备份。')) {
          state = defaultState();
          state.settings.onboarded = true;
          save();
          go('today');
          toast('已全部清零');
        }
        return;
      }
    });

    // 设置弹层
    $('#sheet-save').addEventListener('click', saveSettings);
    $('#sheet-skip').addEventListener('click', () => {
      state.settings.onboarded = true; save(); closeSheet();
    });
    $('#sheet').addEventListener('click', (ev) => {
      if (ev.target.id === 'sheet') closeSheet();
    });
    document.addEventListener('keydown', (ev) => {
      if (ev.target && ev.target.id === 'zk-input' && ev.key === 'Enter') {
        ev.preventDefault();
        zkSubmit();
        return;
      }
      if (ev.key === 'Escape' && !$('#sheet').hidden) closeSheet();
      if (ev.key === 'Escape') TTS.stop();
    });

    // hash 路由
    window.addEventListener('hashchange', () => {
      const h = location.hash.replace('#', '');
      const v = h.split('/')[0];
      if (v && v !== currentView) go(v);
    });

    document.addEventListener('tts-ready', () => { if (!$('#sheet').hidden) fillVoiceSelect(); });

    /* 离开页面、切后台、切标签页时立刻落盘，并在回来时刷新"已保存"时间 */
    window.addEventListener('beforeunload', flushSave);
    window.addEventListener('pagehide', flushSave);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') flushSave();
      else updateSaveBadge();
    });
    document.addEventListener('wb-saved', updateSaveBadge);
  }

  /* ---------------- 启动 ---------------- */
  function boot() {
    load();
    TTS.init();
    bind();

    const initial = (location.hash || '').replace('#', '');
    const [hashView, hashSub] = initial.split('/');
    if (hashView === 'speaking' && hashSub && SPEAKING.some((s) => s.id === hashSub)) {
      speakingTopic = hashSub;
    }
    go(VIEWS[hashView] ? hashView : 'today');

    // 首次进入不弹窗打断：今日页已经有一条明确的设目标提示，
    // 顶栏也常驻「设目标」按钮，用户想设的时候自己点。
    if (!state.settings.onboarded) {
      state.settings.onboarded = true;
      save();
    }

    updateSaveBadge();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
