/* 发音地基：48 国际音标（国内初中教材体系：20 元音 + 28 辅音）
   每个音标给出：符号、分类、中文口型提示、易错对比、例词（英文 + 中文 + 音标） */
window.PHONICS = {
  groups: [
    { id: 'vowel', name: '元音', latin: 'Vowels', desc: '气流不受阻，靠口型和舌位区分。中文里没有完全对应的音，要重新摆口型。' },
    { id: 'consonant', name: '辅音', latin: 'Consonants', desc: '气流受阻，靠唇、齿、舌的位置区分。重点练清浊成对和中文里没有的音。' }
  ],
  items: [
    /* ---------- 单元音 ---------- */
    { ipa: '/iː/', group: 'vowel', sub: '单元音 · 长音', tip: '嘴角向两边拉开像微笑，舌前部抬高，声音拉长。', warn: '别读成中文"衣"，中文"衣"更短更紧。', words: [
      { en: 'see', ipa: '/siː/', cn: '看见' }, { en: 'tea', ipa: '/tiː/', cn: '茶' }, { en: 'people', ipa: '/ˈpiːpl/', cn: '人们' } ] },
    { ipa: '/ɪ/', group: 'vowel', sub: '单元音 · 短音', tip: '比 /iː/ 短、松、口型略大，肩颈放松。', warn: '和 /iː/ 的唯一区别是长短松紧，不是口型大小。', words: [
      { en: 'sit', ipa: '/sɪt/', cn: '坐' }, { en: 'big', ipa: '/bɪɡ/', cn: '大的' }, { en: 'this', ipa: '/ðɪs/', cn: '这个' } ] },
    { ipa: '/e/', group: 'vowel', sub: '单元音 · 短音', tip: '嘴半开，舌尖抵下齿，像说"诶"但更短。', warn: '不要拖长成 /eɪ/。', words: [
      { en: 'bed', ipa: '/bed/', cn: '床' }, { en: 'ten', ipa: '/ten/', cn: '十' }, { en: 'friend', ipa: '/frend/', cn: '朋友' } ] },
    { ipa: '/æ/', group: 'vowel', sub: '单元音 · 短音', tip: '嘴张大到能放进一根手指，下巴下沉，声音扁。', warn: '中文没有这个音，最容易读成 /e/。张大嘴是关键。', words: [
      { en: 'cat', ipa: '/kæt/', cn: '猫' }, { en: 'hand', ipa: '/hænd/', cn: '手' }, { en: 'apple', ipa: '/ˈæpl/', cn: '苹果' } ] },
    { ipa: '/ɜː/', group: 'vowel', sub: '单元音 · 长音', tip: '舌位在中间，嘴唇放松微展，声音拉长，像犹豫时的"呃——"。', warn: '不要卷舌，也不需要儿化。', words: [
      { en: 'bird', ipa: '/bɜːd/', cn: '鸟' }, { en: 'work', ipa: '/wɜːk/', cn: '工作' }, { en: 'learn', ipa: '/lɜːn/', cn: '学习' } ] },
    { ipa: '/ə/', group: 'vowel', sub: '单元音 · 弱读', tip: '最松最短的音，嘴唇完全放松。英语里出现频率最高。', warn: '虚词（a, the, of, to）在句中几乎都要弱读成 /ə/，这是口语"像不像"的分水岭。', words: [
      { en: 'about', ipa: '/əˈbaʊt/', cn: '关于' }, { en: 'teacher', ipa: '/ˈtiːtʃə/', cn: '老师' }, { en: 'sofa', ipa: '/ˈsəʊfə/', cn: '沙发' } ] },
    { ipa: '/ʌ/', group: 'vowel', sub: '单元音 · 短音', tip: '嘴半开，舌位靠后偏低，短促，像被轻推一下发出的"啊"。', warn: '不要读成 /ɑː/ 的长"啊"。', words: [
      { en: 'cup', ipa: '/kʌp/', cn: '杯子' }, { en: 'love', ipa: '/lʌv/', cn: '爱' }, { en: 'money', ipa: '/ˈmʌni/', cn: '钱' } ] },
    { ipa: '/ɑː/', group: 'vowel', sub: '单元音 · 长音', tip: '嘴张大，舌位低且靠后，声音低沉拉长，像医生看喉咙。', warn: '英式不卷舌；美式会带 r，两种都可以，但要统一。', words: [
      { en: 'car', ipa: '/kɑː/', cn: '汽车' }, { en: 'father', ipa: '/ˈfɑːðə/', cn: '父亲' }, { en: 'start', ipa: '/stɑːt/', cn: '开始' } ] },
    { ipa: '/ɒ/', group: 'vowel', sub: '单元音 · 短音', tip: '嘴张大，嘴唇稍圆，短促。', warn: '美式常并入 /ɑː/，学英式要分清。', words: [
      { en: 'hot', ipa: '/hɒt/', cn: '热的' }, { en: 'dog', ipa: '/dɒɡ/', cn: '狗' }, { en: 'box', ipa: '/bɒks/', cn: '盒子' } ] },
    { ipa: '/ɔː/', group: 'vowel', sub: '单元音 · 长音', tip: '嘴唇收圆向前突出，舌位靠后，声音拉长。', warn: '和 /ɒ/ 的区别是长且圆唇。', words: [
      { en: 'door', ipa: '/dɔː/', cn: '门' }, { en: 'four', ipa: '/fɔː/', cn: '四' }, { en: 'talk', ipa: '/tɔːk/', cn: '谈话' } ] },
    { ipa: '/ʊ/', group: 'vowel', sub: '单元音 · 短音', tip: '嘴唇微圆但不突出，短促放松。', warn: '和 /uː/ 的区别是短、松、不嘟嘴。', words: [
      { en: 'book', ipa: '/bʊk/', cn: '书' }, { en: 'good', ipa: '/ɡʊd/', cn: '好的' }, { en: 'put', ipa: '/pʊt/', cn: '放' } ] },
    { ipa: '/uː/', group: 'vowel', sub: '单元音 · 长音', tip: '嘴唇收圆向前嘟出，舌位高且靠后，拉长。', warn: '中文"乌"嘴唇不够圆、不够前。', words: [
      { en: 'food', ipa: '/fuːd/', cn: '食物' }, { en: 'two', ipa: '/tuː/', cn: '二' }, { en: 'school', ipa: '/skuːl/', cn: '学校' } ] },

    /* ---------- 双元音 ---------- */
    { ipa: '/eɪ/', group: 'vowel', sub: '双元音', tip: '从 /e/ 滑向 /ɪ/，前重后轻，是一个音不是两个音。', warn: '别读成两个独立音节。', words: [
      { en: 'day', ipa: '/deɪ/', cn: '天' }, { en: 'name', ipa: '/neɪm/', cn: '名字' }, { en: 'play', ipa: '/pleɪ/', cn: '玩' } ] },
    { ipa: '/aɪ/', group: 'vowel', sub: '双元音', tip: '从张大的 /a/ 滑向 /ɪ/，口型由大到小。', warn: '中文"爱"起点不够低。', words: [
      { en: 'my', ipa: '/maɪ/', cn: '我的' }, { en: 'time', ipa: '/taɪm/', cn: '时间' }, { en: 'right', ipa: '/raɪt/', cn: '对的' } ] },
    { ipa: '/ɔɪ/', group: 'vowel', sub: '双元音', tip: '从圆唇 /ɔ/ 滑向 /ɪ/，前重后轻。', warn: '别读成"哦衣"。', words: [
      { en: 'boy', ipa: '/bɔɪ/', cn: '男孩' }, { en: 'voice', ipa: '/vɔɪs/', cn: '声音' }, { en: 'enjoy', ipa: '/ɪnˈdʒɔɪ/', cn: '享受' } ] },
    { ipa: '/əʊ/', group: 'vowel', sub: '双元音', tip: '从 /ə/ 滑向 /ʊ/，嘴唇由扁到圆。英式读 /əʊ/，美式读 /oʊ/。', warn: '中文"欧"太扁平，缺少收圆的过程。', words: [
      { en: 'go', ipa: '/ɡəʊ/', cn: '去' }, { en: 'home', ipa: '/həʊm/', cn: '家' }, { en: 'open', ipa: '/ˈəʊpən/', cn: '打开' } ] },
    { ipa: '/aʊ/', group: 'vowel', sub: '双元音', tip: '从低 /a/ 滑向 /ʊ/，口型由大到小，嘴巴明显移动。', warn: '中文"奥"少了收尾的圆唇。', words: [
      { en: 'now', ipa: '/naʊ/', cn: '现在' }, { en: 'how', ipa: '/haʊ/', cn: '怎样' }, { en: 'about', ipa: '/əˈbaʊt/', cn: '关于' } ] },
    { ipa: '/ɪə/', group: 'vowel', sub: '双元音', tip: '从 /ɪ/ 滑向 /ə/，结尾很松。', warn: '常见于 ear / here / near。', words: [
      { en: 'near', ipa: '/nɪə/', cn: '近的' }, { en: 'here', ipa: '/hɪə/', cn: '这里' }, { en: 'idea', ipa: '/aɪˈdɪə/', cn: '主意' } ] },
    { ipa: '/eə/', group: 'vowel', sub: '双元音', tip: '从 /e/ 滑向 /ə/，下巴略降。', warn: '常见于 air / where / hair。', words: [
      { en: 'air', ipa: '/eə/', cn: '空气' }, { en: 'where', ipa: '/weə/', cn: '哪里' }, { en: 'care', ipa: '/keə/', cn: '关心' } ] },
    { ipa: '/ʊə/', group: 'vowel', sub: '双元音', tip: '从 /ʊ/ 滑向 /ə/，嘴唇由圆变松。', warn: '现代英式常并入 /ɔː/，听完能分辨即可。', words: [
      { en: 'tour', ipa: '/tʊə/', cn: '旅行' }, { en: 'sure', ipa: '/ʃʊə/', cn: '确定的' }, { en: 'poor', ipa: '/pʊə/', cn: '贫穷的' } ] },

    /* ---------- 辅音 ---------- */
    { ipa: '/p/', group: 'consonant', sub: '辅音 · 清', tip: '双唇闭紧再爆破送气，声带不振动。', warn: '词尾 /p/ 常只做口型不送气，别硬加"普"。', words: [
      { en: 'pen', ipa: '/pen/', cn: '钢笔' }, { en: 'apple', ipa: '/ˈæpl/', cn: '苹果' }, { en: 'help', ipa: '/help/', cn: '帮助' } ] },
    { ipa: '/b/', group: 'consonant', sub: '辅音 · 浊', tip: '和 /p/ 同口型，但声带振动，不送气。', warn: '发 /b/ 时把手放喉咙上能感到震动。', words: [
      { en: 'bag', ipa: '/bæɡ/', cn: '包' }, { en: 'table', ipa: '/ˈteɪbl/', cn: '桌子' }, { en: 'job', ipa: '/dʒɒb/', cn: '工作' } ] },
    { ipa: '/t/', group: 'consonant', sub: '辅音 · 清', tip: '舌尖抵上齿龈再爆破，声带不振动。', warn: '别读成中文"特"，英语 /t/ 更干脆。', words: [
      { en: 'time', ipa: '/taɪm/', cn: '时间' }, { en: 'water', ipa: '/ˈwɔːtə/', cn: '水' }, { en: 'cat', ipa: '/kæt/', cn: '猫' } ] },
    { ipa: '/d/', group: 'consonant', sub: '辅音 · 浊', tip: '和 /t/ 同口型，声带振动。', warn: '美式口语里元音之间的 /t/ 常变 /d/：water → "wader"。', words: [
      { en: 'day', ipa: '/deɪ/', cn: '天' }, { en: 'good', ipa: '/ɡʊd/', cn: '好的' }, { en: 'need', ipa: '/niːd/', cn: '需要' } ] },
    { ipa: '/k/', group: 'consonant', sub: '辅音 · 清', tip: '舌根抵软腭再爆破，送气。', warn: '词尾 /k/ 别拖成"克"。', words: [
      { en: 'cat', ipa: '/kæt/', cn: '猫' }, { en: 'back', ipa: '/bæk/', cn: '后面' }, { en: 'school', ipa: '/skuːl/', cn: '学校' } ] },
    { ipa: '/ɡ/', group: 'consonant', sub: '辅音 · 浊', tip: '和 /k/ 同位置，声带振动，不送气。', words: [
      { en: 'go', ipa: '/ɡəʊ/', cn: '去' }, { en: 'big', ipa: '/bɪɡ/', cn: '大的' }, { en: 'again', ipa: '/əˈɡen/', cn: '再一次' } ] },
    { ipa: '/f/', group: 'consonant', sub: '辅音 · 清', tip: '上齿轻咬下唇，气流摩擦而出。', warn: '中文没有唇齿音，别读成"夫"。', words: [
      { en: 'five', ipa: '/faɪv/', cn: '五' }, { en: 'coffee', ipa: '/ˈkɒfi/', cn: '咖啡' }, { en: 'life', ipa: '/laɪf/', cn: '生活' } ] },
    { ipa: '/v/', group: 'consonant', sub: '辅音 · 浊', tip: '同 /f/ 口型，声带振动。', warn: '和 /w/ 完全不同：/v/ 咬唇，/w/ 圆唇。', words: [
      { en: 'very', ipa: '/ˈveri/', cn: '非常' }, { en: 'love', ipa: '/lʌv/', cn: '爱' }, { en: 'give', ipa: '/ɡɪv/', cn: '给' } ] },
    { ipa: '/θ/', group: 'consonant', sub: '辅音 · 清', tip: '舌尖轻放上下齿之间，送气摩擦。', warn: '中文没有，最容易读成 /s/ 或 /f/。think 不是 "sink"。', words: [
      { en: 'think', ipa: '/θɪŋk/', cn: '想' }, { en: 'three', ipa: '/θriː/', cn: '三' }, { en: 'mouth', ipa: '/maʊθ/', cn: '嘴' } ] },
    { ipa: '/ð/', group: 'consonant', sub: '辅音 · 浊', tip: '同 /θ/ 口型，声带振动。', warn: 'the / this / that 全是这个音，读错整句都"不像"。', words: [
      { en: 'this', ipa: '/ðɪs/', cn: '这个' }, { en: 'mother', ipa: '/ˈmʌðə/', cn: '母亲' }, { en: 'weather', ipa: '/ˈweðə/', cn: '天气' } ] },
    { ipa: '/s/', group: 'consonant', sub: '辅音 · 清', tip: '舌尖靠近上齿龈留细缝，气流摩擦。', words: [
      { en: 'sun', ipa: '/sʌn/', cn: '太阳' }, { en: 'this', ipa: '/ðɪs/', cn: '这个' }, { en: 'class', ipa: '/klɑːs/', cn: '班级' } ] },
    { ipa: '/z/', group: 'consonant', sub: '辅音 · 浊', tip: '同 /s/ 口型，声带振动。', warn: '复数 -s 在浊音后读 /z/：dogs。', words: [
      { en: 'zoo', ipa: '/zuː/', cn: '动物园' }, { en: 'easy', ipa: '/ˈiːzi/', cn: '容易的' }, { en: 'dogs', ipa: '/dɒɡz/', cn: '狗（复数）' } ] },
    { ipa: '/ʃ/', group: 'consonant', sub: '辅音 · 清', tip: '舌面靠近硬腭，嘴唇略前突，像让人安静。', warn: '中文"西"更靠前，英语 /ʃ/ 更圆。', words: [
      { en: 'she', ipa: '/ʃiː/', cn: '她' }, { en: 'fish', ipa: '/fɪʃ/', cn: '鱼' }, { en: 'station', ipa: '/ˈsteɪʃn/', cn: '车站' } ] },
    { ipa: '/ʒ/', group: 'consonant', sub: '辅音 · 浊', tip: '同 /ʃ/ 口型，声带振动。', warn: '多出现在法语借词里：usually, measure。', words: [
      { en: 'usually', ipa: '/ˈjuːʒuəli/', cn: '通常' }, { en: 'measure', ipa: '/ˈmeʒə/', cn: '测量' }, { en: 'television', ipa: '/ˈtelɪvɪʒn/', cn: '电视' } ] },
    { ipa: '/h/', group: 'consonant', sub: '辅音 · 清', tip: '气流从喉咙轻松呼出，口型跟随后面的元音。', warn: '别读成中文"喝"那样有摩擦。', words: [
      { en: 'hello', ipa: '/həˈləʊ/', cn: '你好' }, { en: 'home', ipa: '/həʊm/', cn: '家' }, { en: 'behind', ipa: '/bɪˈhaɪnd/', cn: '在后面' } ] },
    { ipa: '/tʃ/', group: 'consonant', sub: '辅音 · 清', tip: '/t/ 和 /ʃ/ 快速连读成一个音。', warn: '像中文"吃"但要更短更扁。', words: [
      { en: 'China', ipa: '/ˈtʃaɪnə/', cn: '中国' }, { en: 'teacher', ipa: '/ˈtiːtʃə/', cn: '老师' }, { en: 'watch', ipa: '/wɒtʃ/', cn: '手表' } ] },
    { ipa: '/dʒ/', group: 'consonant', sub: '辅音 · 浊', tip: '/d/ 和 /ʒ/ 连读，声带振动。', warn: '像"知"但要更短。', words: [
      { en: 'job', ipa: '/dʒɒb/', cn: '工作' }, { en: 'age', ipa: '/eɪdʒ/', cn: '年龄' }, { en: 'bridge', ipa: '/brɪdʒ/', cn: '桥' } ] },
    { ipa: '/tr/', group: 'consonant', sub: '辅音 · 连缀', tip: '/t/ 快速滑向 /r/，唇略圆。', warn: '中文"戳"太重，要轻快。', words: [
      { en: 'tree', ipa: '/triː/', cn: '树' }, { en: 'train', ipa: '/treɪn/', cn: '火车' }, { en: 'street', ipa: '/striːt/', cn: '街道' } ] },
    { ipa: '/dr/', group: 'consonant', sub: '辅音 · 连缀', tip: '/d/ 快速滑向 /r/，声带振动。', words: [
      { en: 'dream', ipa: '/driːm/', cn: '梦' }, { en: 'drive', ipa: '/draɪv/', cn: '驾驶' }, { en: 'hundred', ipa: '/ˈhʌndrəd/', cn: '一百' } ] },
    { ipa: '/ts/', group: 'consonant', sub: '辅音 · 连缀', tip: '/t/ 快速滑向 /s/，像轻快的"次"。', warn: '多出现在词尾：cats, students。', words: [
      { en: 'cats', ipa: '/kæts/', cn: '猫（复数）' }, { en: 'students', ipa: '/ˈstjuːdnts/', cn: '学生们' }, { en: 'meets', ipa: '/miːts/', cn: '遇见（三单）' } ] },
    { ipa: '/dz/', group: 'consonant', sub: '辅音 · 连缀', tip: '/d/ 快速滑向 /z/，声带振动。', words: [
      { en: 'beds', ipa: '/bedz/', cn: '床（复数）' }, { en: 'friends', ipa: '/frendz/', cn: '朋友们' }, { en: 'needs', ipa: '/niːdz/', cn: '需要（三单）' } ] },
    { ipa: '/m/', group: 'consonant', sub: '辅音 · 鼻音', tip: '双唇闭合，气流从鼻腔出。', words: [
      { en: 'man', ipa: '/mæn/', cn: '男人' }, { en: 'come', ipa: '/kʌm/', cn: '来' }, { en: 'room', ipa: '/ruːm/', cn: '房间' } ] },
    { ipa: '/n/', group: 'consonant', sub: '辅音 · 鼻音', tip: '舌尖抵上齿龈，气流从鼻腔出。', words: [
      { en: 'no', ipa: '/nəʊ/', cn: '不' }, { en: 'name', ipa: '/neɪm/', cn: '名字' }, { en: 'sun', ipa: '/sʌn/', cn: '太阳' } ] },
    { ipa: '/ŋ/', group: 'consonant', sub: '辅音 · 鼻音', tip: '舌根抵软腭，气流从鼻腔出，像"嗯"。', warn: '词尾 -ing 全是 /ŋ/，别加 /ɡ/：sing 不是 "sing-g"。', words: [
      { en: 'sing', ipa: '/sɪŋ/', cn: '唱歌' }, { en: 'long', ipa: '/lɒŋ/', cn: '长的' }, { en: 'English', ipa: '/ˈɪŋɡlɪʃ/', cn: '英语' } ] },
    { ipa: '/l/', group: 'consonant', sub: '辅音 · 流音', tip: '舌尖抵上齿龈，气流从舌两侧出。词尾的 /l/ 更暗更沉。', warn: '词尾 /l/ 别读成 /r/ 或直接吞掉：people, table。', words: [
      { en: 'like', ipa: '/laɪk/', cn: '喜欢' }, { en: 'little', ipa: '/ˈlɪtl/', cn: '小的' }, { en: 'school', ipa: '/skuːl/', cn: '学校' } ] },
    { ipa: '/r/', group: 'consonant', sub: '辅音 · 流音', tip: '舌尖卷起接近上齿龈但不碰到，嘴唇略圆。', warn: '英式词尾 /r/ 不发音，美式要发。选一种，别混。', words: [
      { en: 'red', ipa: '/red/', cn: '红色' }, { en: 'right', ipa: '/raɪt/', cn: '对的' }, { en: 'sorry', ipa: '/ˈsɒri/', cn: '抱歉' } ] },
    { ipa: '/j/', group: 'consonant', sub: '辅音 · 半元音', tip: '舌面靠近硬腭，快速滑向元音。', words: [
      { en: 'yes', ipa: '/jes/', cn: '是' }, { en: 'year', ipa: '/jɪə/', cn: '年' }, { en: 'music', ipa: '/ˈmjuːzɪk/', cn: '音乐' } ] },
    { ipa: '/w/', group: 'consonant', sub: '辅音 · 半元音', tip: '双唇收圆突出，快速滑向元音。', warn: '不咬唇；/v/ 才咬唇。', words: [
      { en: 'we', ipa: '/wiː/', cn: '我们' }, { en: 'water', ipa: '/ˈwɔːtə/', cn: '水' }, { en: 'one', ipa: '/wʌn/', cn: '一' } ] }
  ]
};
