/* 口语场景：三级阶梯，每级 6 个话题
   lv: 1=能开口（初一） 2=能说清（初中后期到高中） 3=能讨论（四级口试话题）
   lines: 核心句（en 英文 cn 中文 tip 发音/用法提示）
   prompts: 追问，用来把"读句子"变成"真对话" */
window.SPEAKING = [
  /* ================= Level 1 ================= */
  {
    id: 'l1-intro', lv: 1, title: '自我介绍', scene: '新班级、新同事、第一次见面。说完这三句，对方就知道怎么称呼你、你是做什么的。',
    lines: [
      { en: 'Hi, my name is Li Ming. Nice to meet you.', cn: '你好，我叫李明。很高兴认识你。', tip: 'Nice to meet you 连读成 "nice-tuh-meech-you"。' },
      { en: 'I am a student. I am in Grade Seven.', cn: '我是学生，我上初一。', tip: 'Grade Seven 的 Grade 要重读。' },
      { en: 'I am learning English, so please speak slowly.', cn: '我在学英语，请说慢一点。', tip: '这句是你最该背熟的一句，能救场。' },
      { en: 'I like music and basketball.', cn: '我喜欢音乐和篮球。', tip: 'and 弱读成 /ən/，几乎听不到 d。' }
    ],
    prompts: ['What do you do?', 'Where are you from?', 'How long have you studied English?']
  },
  {
    id: 'l1-greet', lv: 1, title: '打招呼与告别', scene: '走廊、电梯、门口碰到人。三十秒内说完，重点是自然收尾。',
    lines: [
      { en: 'Good morning! How are you doing?', cn: '早上好！你最近怎么样？', tip: 'How are you doing 比 How are you 更口语。' },
      { en: 'Pretty good, thanks. And you?', cn: '挺好的，谢谢。你呢？', tip: '回答后一定反问，对话才继续。' },
      { en: 'I have to go now. See you tomorrow.', cn: '我得走了。明天见。', tip: 'have to 连读成 "haf-tuh"。' },
      { en: 'Take care! Have a nice day.', cn: '保重！祝你今天愉快。', tip: 'Take care 的重音在 take。' }
    ],
    prompts: ['What are you up to today?', 'See you later, okay?']
  },
  {
    id: 'l1-order', lv: 1, title: '点餐', scene: '快餐店或咖啡馆。目标：说清要什么、多大份、在这吃还是带走。',
    lines: [
      { en: 'Can I have a chicken sandwich, please?', cn: '请给我一个鸡肉三明治。', tip: 'Can I have 是点餐万能句式，句尾降调。' },
      { en: 'A medium coffee, no sugar.', cn: '中杯咖啡，不加糖。', tip: 'no sugar 两个词连起来说，中间不停。' },
      { en: 'For here, please.', cn: '在这吃。', tip: '带走是 To go, please。' },
      { en: 'How much is it?', cn: '多少钱？', tip: 'How much is it 常连成 "how-much-iz-it"。' }
    ],
    prompts: ['Anything else?', 'Would you like it hot or iced?', 'Cash or card?']
  },
  {
    id: 'l1-way', lv: 1, title: '问路', scene: '在陌生街区找地铁站。目标：问清方向、听懂回答、确认一遍。',
    lines: [
      { en: 'Excuse me, where is the subway station?', cn: '打扰一下，地铁站在哪里？', tip: 'Excuse me 的 s 发 /s/，不读 "excuse-z-me"。' },
      { en: 'Is it far from here?', cn: '离这儿远吗？', tip: 'far 的 r 在英式里不发音。' },
      { en: 'Go straight and turn left at the corner.', cn: '直走，在拐角左转。', tip: 'straight 里 gh 不发音。' },
      { en: 'Sorry, could you say that again more slowly?', cn: '抱歉，你能再慢一点说一遍吗？', tip: '没听懂就用这句，别点头假装懂。' }
    ],
    prompts: ['Do you mean this way?', 'About how many minutes on foot?']
  },
  {
    id: 'l1-shop', lv: 1, title: '购物', scene: '买一双鞋。目标：问尺码、试穿、问价、决定买或不买。',
    lines: [
      { en: 'Do you have this in a larger size?', cn: '这个有大一号的吗？', tip: 'larger 的 r 要卷舌（美式）。' },
      { en: 'Can I try them on?', cn: '我可以试穿吗？', tip: 'try them on，them 轻读成 "em"。' },
      { en: 'They are a bit tight. Do you have a bigger one?', cn: '有点紧。有大一点的吗？', tip: 'a bit 连读成 "uh-bit"。' },
      { en: 'I will take them. How much in total?', cn: '我要了。一共多少钱？', tip: 'I will 口语缩成 I\'ll。' }
    ],
    prompts: ['What size are you looking for?', 'These are on sale today.']
  },
  {
    id: 'l1-day', lv: 1, title: '说清你的一天', scene: '每天练口语最有效的热身：用三句话讲今天。练的是动词和时态。',
    lines: [
      { en: 'I got up at six thirty this morning.', cn: '我今天早上六点半起床。', tip: 'got up 连读成 "go-dup"。' },
      { en: 'After class, I went to the library and read for an hour.', cn: '下课后我去了图书馆，读了一小时书。', tip: 'went 是 go 的过去式，别说 goed。' },
      { en: 'In the evening, I practised English for twenty minutes.', cn: '晚上我练了二十分钟英语。', tip: 'practised 词尾 /t/ 轻而短。' },
      { en: 'Tomorrow I plan to do the same thing again.', cn: '明天我打算再做一遍。', tip: 'plan to 连读成 "plan-tuh"。' }
    ],
    prompts: ['What time did you go to bed?', 'Did you do anything fun today?']
  },

  /* ================= Level 2 ================= */
  {
    id: 'l2-school', lv: 2, title: '聊校园生活', scene: '和同学或语伴聊课程、老师、压力。目标：能说出"为什么"而不只是"是什么"。',
    lines: [
      { en: 'My favourite subject is English because I like the sound of it.', cn: '我最喜欢的科目是英语，因为我喜欢它的发音。', tip: 'because 从句前稍停，让听者跟上。' },
      { en: 'The classes are quite demanding, but I find them interesting.', cn: '课程挺累的，但我觉得有意思。', tip: 'demanding 重音在第二音节。' },
      { en: 'I usually review my notes right after class.', cn: '我通常下课后马上复习笔记。', tip: 'right after 连读成 "righ-tafter"。' },
      { en: 'What about you? How do you deal with the pressure?', cn: '你呢？你怎么应对压力？', tip: 'deal with 连读成 "dee-wiz"。' }
    ],
    prompts: ['Do you prefer studying alone or in a group?', 'What is the hardest part for you?']
  },
  {
    id: 'l2-experience', lv: 2, title: '讲一段经历', scene: '讲一次旅行、一次比赛、一次失误。目标：用时间线把故事说完整。',
    lines: [
      { en: 'Last summer, I went on a trip to the mountains with my family.', cn: '去年夏天，我和家人去山里旅行。', tip: 'went on a 连读成 "wen-on-uh"。' },
      { en: 'At first, everything went wrong. We missed the bus and got lost.', cn: '一开始一切都不顺。我们错过了公交还迷了路。', tip: 'went wrong 的 wrong 里 w 不发音。' },
      { en: 'But in the end, it turned out to be the best day of the trip.', cn: '但最后，它成了旅行里最好的一天。', tip: 'turned out to 连读成 "turn-dout-tuh"。' },
      { en: 'Looking back, I would do it again.', cn: '回头看，我还愿意再来一次。', tip: 'would 的 l 不发音。' }
    ],
    prompts: ['What did you learn from that?', 'Was it easier or harder than you expected?']
  },
  {
    id: 'l2-opinion', lv: 2, title: '表达观点', scene: '讨论屏幕时间、早起、线上课。目标：观点 + 理由 + 让步，三步走。',
    lines: [
      { en: 'In my opinion, students spend too much time on their phones.', cn: '在我看来，学生花太多时间在手机上。', tip: 'In my opinion 说得短促，别拖长。' },
      { en: 'The main reason is that it stops them from focusing.', cn: '主要原因是它让人无法专注。', tip: 'reason is that 连读成 "reason-iz-that"。' },
      { en: 'That said, phones are also useful for learning.', cn: '话虽如此，手机对学习也有用。', tip: 'That said 是自然的让步开头。' },
      { en: 'So I think the answer is balance, not banning.', cn: '所以我认为答案是平衡，而不是禁止。', tip: 'balance, not banning 形成对比，重音落在两个词上。' }
    ],
    prompts: ['Can you give an example?', 'What would you change if you could?']
  },
  {
    id: 'l2-phone', lv: 2, title: '打电话与留言', scene: '打电话比面谈难，因为没有表情和口型。目标：确认身份、说清事、留信息。',
    lines: [
      { en: 'Hello, this is Wang Fang speaking. May I speak to Tom, please?', cn: '你好，我是王芳。请问汤姆在吗？', tip: '打电话用 this is，不用 I am。' },
      { en: 'Could you hold on for a moment?', cn: '请稍等一会儿好吗？', tip: 'hold on 连读成 "hol-don"。' },
      { en: 'I am calling about tomorrow\'s meeting.', cn: '我打电话是想问明天的会议。', tip: 'calling about 连读成 "callin-guhbout"。' },
      { en: 'Can I leave a message? Please ask him to call me back.', cn: '我可以留言吗？请让他回我电话。', tip: 'call me back 三词连成一句，别断开。' }
    ],
    prompts: ['Who is calling, please?', 'Would you like to leave a message?']
  },
  {
    id: 'l2-doctor', lv: 2, title: '看医生', scene: '描述症状。目标：说清哪里不舒服、多久了、有没有其他症状。',
    lines: [
      { en: 'I have had a sore throat for three days.', cn: '我嗓子疼了三天了。', tip: 'have had 是现在完成，表示持续。' },
      { en: 'It hurts when I swallow.', cn: '我咽东西的时候疼。', tip: 'hurts when I 连读成 "hurts-when-I"。' },
      { en: 'I also have a slight fever and a headache.', cn: '我还有点发烧和头疼。', tip: 'slight 的 gh 不发音。' },
      { en: 'Do I need to take any medicine?', cn: '我需要吃药吗？', tip: 'need to 连读成 "nee-tuh"。' }
    ],
    prompts: ['Any other symptoms?', 'Are you allergic to anything?']
  },
  {
    id: 'l2-travel', lv: 2, title: '订行程', scene: '订酒店、改机票、问行李额度。目标：把需求说具体，避免来回猜。',
    lines: [
      { en: 'I would like to book a room for two nights.', cn: '我想订一个房间，住两晚。', tip: 'I would like to 比 I want to 礼貌得多。' },
      { en: 'Does the price include breakfast?', cn: '这个价格包含早餐吗？', tip: 'include 重音在第二音节。' },
      { en: 'Could I change my flight to Friday afternoon?', cn: '我能把航班改到周五下午吗？', tip: 'Could I 比 Can I 更客气。' },
      { en: 'Is there a luggage allowance included?', cn: '包含行李额度吗？', tip: 'allowance 重音在第一音节。' }
    ],
    prompts: ['How would you like to pay?', 'Is there anything else I can help with?']
  },

  /* ================= Level 3（四级口试话题） ================= */
  {
    id: 'l3-env', lv: 3, title: '环境与生活方式', scene: '四级口语和写作的高频话题。目标：给出立场、两条理由、一个具体做法。',
    lines: [
      { en: 'Environmental protection is no longer a distant issue; it affects daily life.', cn: '环保不再是遥远的话题，它影响日常生活。', tip: 'no longer 连读成 "no-longer"，重音在 longer。' },
      { en: 'One practical step is to cut down on single-use plastics.', cn: '一个实际的做法是减少一次性塑料。', tip: 'cut down on 连读成 "cu-dow-non"。' },
      { en: 'Individuals can make a difference, but policy matters even more.', cn: '个人能带来改变，但政策更重要。', tip: 'make a difference 是四级作文常用搭配。' },
      { en: 'In the long run, sustainable choices benefit everyone.', cn: '从长远看，可持续的选择对所有人都有益。', tip: 'In the long run 是高分短语。' }
    ],
    prompts: ['What can schools do to help?', 'Is it fair to ask individuals to change first?']
  },
  {
    id: 'l3-tech', lv: 3, title: '科技与手机', scene: 'AI、短视频、手机依赖。目标：承认好处、指出代价、给出判断。',
    lines: [
      { en: 'Technology has changed the way we study and communicate.', cn: '科技改变了我们学习和交流的方式。', tip: 'the way we 连读成 "the-way-we"，中间不加 that 更自然。' },
      { en: 'The convenience is obvious, but the cost is our attention.', cn: '便利很明显，代价是我们的注意力。', tip: 'attention 重音在第二音节。' },
      { en: 'Short videos are designed to keep us scrolling, not thinking.', cn: '短视频的设计目的是让我们一直刷，而不是思考。', tip: 'designed to 连读成 "designed-tuh"。' },
      { en: 'I think the key is to use tools, not be used by them.', cn: '我认为关键是用工具，而不是被工具所用。', tip: 'use tools / be used by them 是漂亮的对照句。' }
    ],
    prompts: ['Do you think AI will replace teachers?', 'How do you control your screen time?']
  },
  {
    id: 'l3-edu', lv: 3, title: '教育与学习', scene: '应试与能力、兴趣与就业。目标：能说"两个都对，但……"。',
    lines: [
      { en: 'Exams measure results, but they do not measure curiosity.', cn: '考试衡量结果，但不衡量好奇心。', tip: 'measure 重音在第一音节。' },
      { en: 'Learning a language is closer to training a skill than memorising facts.', cn: '学语言更接近训练技能，而不是背事实。', tip: 'closer to 连读成 "closer-tuh"。' },
      { en: 'Students learn best when they see a reason to use what they study.', cn: '当学生看到所学的用处时，学得最好。', tip: 'learn best when 连读成 "learn-bes-when"。' },
      { en: 'So the goal should be ability, with scores as a by-product.', cn: '所以目标应该是能力，分数只是副产品。', tip: 'by-product 重音在 by。' }
    ],
    prompts: ['Should students choose their own subjects?', 'What makes a good teacher?']
  },
  {
    id: 'l3-city', lv: 3, title: '城市与交通', scene: '通勤、拥堵、公共空间。目标：描述现象 + 分析原因 + 提一条建议。',
    lines: [
      { en: 'Traffic congestion costs cities both time and money.', cn: '交通拥堵让城市付出时间和金钱的代价。', tip: 'congestion 重音在第二音节。' },
      { en: 'Part of the problem is that public transport is not convenient enough.', cn: '部分问题在于公共交通不够方便。', tip: 'Part of the problem is that 是四级作文常用开头。' },
      { en: 'Improving bus routes would help more than building new roads.', cn: '改善公交线路比修新路更有帮助。', tip: 'would help more than 形成比较结构。' },
      { en: 'A city works best when walking is the easiest choice.', cn: '当步行成为最轻松的选择时，城市运转得最好。', tip: 'works best when 连读，节奏要稳。' }
    ],
    prompts: ['How is transport in your city?', 'Would you rather drive or take the subway?']
  },
  {
    id: 'l3-health', lv: 3, title: '健康与运动', scene: '久坐、睡眠、运动习惯。目标：讲清因果，不空喊口号。',
    lines: [
      { en: 'Sitting for hours has a direct effect on our health.', cn: '久坐对健康有直接影响。', tip: 'effect on 连读成 "effec-ton"。' },
      { en: 'Regular exercise improves both mood and memory.', cn: '规律运动能改善情绪和记忆。', tip: 'both A and B 的重音落在 A 和 B 上。' },
      { en: 'The hardest part is not starting; it is continuing.', cn: '最难的不是开始，而是坚持。', tip: 'not starting / continuing 用停顿制造对比。' },
      { en: 'Small habits, repeated daily, produce real change.', cn: '每天重复的小习惯会带来真实的改变。', tip: '插入语 repeated daily 说得轻一些。' }
    ],
    prompts: ['How do you stay active?', 'Is sleep more important than exercise?']
  },
  {
    id: 'l3-career', lv: 3, title: '工作与未来', scene: '实习、选择、职业规划。目标：说清选择理由，也承认不确定性。',
    lines: [
      { en: 'I am still exploring, but I am drawn to work that involves language.', cn: '我还在探索，但我被与语言相关的工作吸引。', tip: 'drawn to 连读成 "drawn-tuh"。' },
      { en: 'An internship would give me a clearer picture of the field.', cn: '实习会让我对这个领域有更清晰的认识。', tip: 'a clearer picture of 是高分搭配。' },
      { en: 'I would rather learn on the job than wait for the perfect chance.', cn: '我宁愿在工作中学习，而不是等完美机会。', tip: 'would rather A than B 结构要完整。' },
      { en: 'The plan may change, but the direction is clear.', cn: '计划可能会变，但方向是清楚的。', tip: 'may change, but 用短停制造转折。' }
    ],
    prompts: ['What kind of job attracts you?', 'Would you work abroad if you had the chance?']
  }
];
