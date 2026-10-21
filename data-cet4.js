/* 四级专项：写作 / 翻译 / 听力 / 阅读
   全部为可离线使用的自包含练习，听力文本由浏览器 TTS 朗读 */

window.CET4_WRITING = [
  {
    id: 'w1', type: '观点论证', title: 'Should Students Take Part-time Jobs?',
    frame: [
      { cn: '第一段：引出话题 + 表明立场（1 句现象 + 1 句观点）', en: 'Nowadays, more and more college students take part-time jobs. In my view, this trend does more good than harm.' },
      { cn: '第二段：两条理由，每条一句观点 + 一句展开', en: 'To begin with, a part-time job teaches students how to manage time and money. What is more, it gives them a taste of the real workplace before they graduate.' },
      { cn: '第三段：让步 + 结论（承认问题，但立场不变）', en: 'Admittedly, working too many hours may affect study. However, as long as the workload is reasonable, the experience is worth it.' }
    ],
    model: `Nowadays, more and more college students take part-time jobs while they study. In my view, this trend does more good than harm.

To begin with, a part-time job teaches students how to manage time and money. Unlike lessons in a classroom, work gives immediate feedback: if you are late, you lose pay; if you plan badly, you feel the pressure. What is more, it gives students a taste of the real workplace before they graduate, which makes their career choices more informed.

Admittedly, working too many hours may affect study. However, as long as the workload is reasonable, the experience is worth it. Students should learn to balance, not to avoid.`,
    phrases: ['more good than harm', 'to begin with', 'what is more', 'admittedly', 'as long as', 'be worth it']
  },
  {
    id: 'w2', type: '现象说明', title: 'The Rise of Online Learning',
    frame: [
      { cn: '第一段：描述现象（数据/趋势，不用编造具体数字）', en: 'Online learning has become a normal part of education. Many students now attend classes on a screen instead of in a room.' },
      { cn: '第二段：原因两条（便利 / 资源）', en: 'The main reason is convenience: learners can study anywhere and replay a difficult part. Another reason is access, since good courses are no longer limited to one city.' },
      { cn: '第三段：问题 + 建议（平衡线上线下）', en: 'Still, online learning lacks face-to-face interaction. The best solution is a mix of both, not a replacement of one by the other.' }
    ],
    model: `Online learning has become a normal part of education. Many students now attend classes on a screen instead of in a room.

The main reason is convenience: learners can study anywhere and replay a difficult part as many times as they need. Another reason is access, since good courses are no longer limited to one city or one school.

Still, online learning lacks face-to-face interaction, and it demands strong self-discipline. In my opinion, the best solution is a mix of both: use online resources for review, and keep real classrooms for discussion.`,
    phrases: ['has become a normal part of', 'the main reason is', 'no longer limited to', 'demands self-discipline', 'a mix of both']
  },
  {
    id: 'w3', type: '利弊分析', title: 'Living Alone After Graduation',
    frame: [
      { cn: '第一段：界定话题 + 双向立场', en: 'More young people choose to live alone after graduation. This choice has clear benefits, but also real costs.' },
      { cn: '第二段：利（自由 / 独立）', en: 'On the positive side, living alone builds independence. Young people learn to cook, budget and solve problems on their own.' },
      { cn: '第三段：弊（孤独 / 成本）+ 结论', en: 'On the negative side, it can be lonely and expensive. Therefore, living alone suits those who are ready for both freedom and responsibility.' }
    ],
    model: `More young people choose to live alone after graduation. This choice has clear benefits, but also real costs.

On the positive side, living alone builds independence. Young people learn to cook, budget and solve problems on their own, and they gain a quiet space to think about what they really want.

On the negative side, it can be lonely and expensive, especially in big cities. Therefore, living alone suits those who are ready for both freedom and responsibility, not those who are simply escaping rules.`,
    phrases: ['on the positive side', 'on the negative side', 'build independence', 'on their own', 'ready for both A and B']
  },
  {
    id: 'w4', type: '书信/建议', title: 'A Letter to a Friend About Learning English',
    frame: [
      { cn: '开头：问候 + 说明写信目的', en: 'Dear Tom, I am glad to hear that you have decided to improve your English. Here are a few suggestions.' },
      { cn: '主体：三条具体建议（每条一句）', en: 'First, practise speaking for ten minutes every day. Second, read something easy that you actually enjoy. Third, review new words the next day instead of the same evening.' },
      { cn: '结尾：鼓励 + 期待回信', en: 'Do not worry about making mistakes; they are part of learning. I look forward to hearing how it goes.' }
    ],
    model: `Dear Tom,

I am glad to hear that you have decided to improve your English. Here are a few suggestions that worked for me.

First, practise speaking for ten minutes every day, even if you are alone. Second, read something easy that you actually enjoy, because interest keeps you going. Third, review new words the next day instead of the same evening; that small delay makes them stick.

Do not worry about making mistakes; they are part of learning. I look forward to hearing how it goes.

Yours,
Li Ming`,
    phrases: ['I am glad to hear that', 'here are a few suggestions', 'keep you going', 'make them stick', 'look forward to hearing']
  },
  {
    id: 'w5', type: '图表/图画描述', title: 'Describing a Change in Study Habits',
    frame: [
      { cn: '第一段：一句总述 + 一句对比（不需要精确数字）', en: 'The chart shows a clear change in how students spend their spare time. Time on short videos has risen, while time on reading has fallen.' },
      { cn: '第二段：解释两条原因', en: 'This shift is partly caused by convenience, since videos are easier to start than books. It is also caused by design, because such apps are built to hold attention.' },
      { cn: '第三段：评价 + 一句建议', en: 'The trend deserves attention. Students should decide what deserves their time, rather than letting an app decide for them.' }
    ],
    model: `The chart shows a clear change in how students spend their spare time. Time on short videos has risen, while time on reading has fallen.

This shift is partly caused by convenience, since videos are easier to start than books. It is also caused by design, because such apps are built to hold attention for as long as possible.

The trend deserves attention. Students should decide what deserves their time, rather than letting an app decide for them.`,
    phrases: ['the chart shows', 'has risen, while', 'partly caused by', 'deserves attention', 'rather than letting']
  }
];

window.CET4_TRANSLATION = [
  {
    id: 't1', topic: '中国茶文化',
    cn: '中国是茶的故乡。几千年来，茶一直是中国人日常生活的一部分。人们不仅在家庭聚会时喝茶，也用茶招待客人。如今，越来越多的年轻人开始喜欢传统茶饮，茶馆在城市里重新流行起来。',
    ref: 'China is the hometown of tea. For thousands of years, tea has been part of Chinese daily life. People drink tea not only at family gatherings but also to welcome guests. Today, more and more young people are beginning to enjoy traditional tea, and tea houses are becoming popular in cities again.',
    points: [
      { cn: '茶的故乡', en: 'the hometown of tea' },
      { cn: '几千年来', en: 'for thousands of years' },
      { cn: '不仅……也……', en: 'not only ... but also ...' },
      { cn: '重新流行', en: 'become popular again' }
    ]
  },
  {
    id: 't2', topic: '高铁',
    cn: '中国的高速铁路发展迅速，运营里程居世界前列。高铁把许多城市连接起来，大大缩短了旅行时间。乘客可以在几个小时内跨越上千公里。高铁不仅方便了出行，也促进了沿线地区的经济发展。',
    ref: 'China\'s high-speed railway has developed rapidly, and its operating length ranks among the highest in the world. High-speed trains connect many cities and greatly shorten travel time. Passengers can cover over a thousand kilometres in a few hours. High-speed rail has not only made travel easier but also promoted economic development in the areas along the lines.',
    points: [
      { cn: '发展迅速', en: 'develop rapidly' },
      { cn: '居世界前列', en: 'rank among the highest in the world' },
      { cn: '大大缩短', en: 'greatly shorten' },
      { cn: '沿线地区', en: 'the areas along the lines' }
    ]
  },
  {
    id: 't3', topic: '春节',
    cn: '春节是中国最重要的传统节日。节日期间，家人尽量团聚，一起吃年夜饭。人们贴春联、放鞭炮，孩子们会收到红包。虽然庆祝方式在不断变化，但春节所代表的团圆愿望始终没有改变。',
    ref: 'The Spring Festival is the most important traditional festival in China. During the festival, family members try their best to get together and have the New Year\'s Eve dinner. People put up spring couplets and set off firecrackers, and children receive red envelopes. Although the ways of celebrating keep changing, the wish for reunion that the festival represents has never changed.',
    points: [
      { cn: '传统节日', en: 'traditional festival' },
      { cn: '尽量团聚', en: 'try their best to get together' },
      { cn: '贴春联', en: 'put up spring couplets' },
      { cn: '始终没有改变', en: 'has never changed' }
    ]
  },
  {
    id: 't4', topic: '共享单车',
    cn: '共享单车已经成为许多城市常见的交通方式。人们用手机扫码就能骑走一辆车，到达目的地后停在规定区域。共享单车解决了“最后一公里”的问题，但也带来了乱停乱放的管理难题。',
    ref: 'Shared bikes have become a common means of transport in many cities. People can unlock a bike by scanning a code with their phones, and park it in a designated area when they arrive. Shared bikes have solved the "last kilometre" problem, but they have also brought management difficulties such as parking in the wrong places.',
    points: [
      { cn: '交通方式', en: 'means of transport' },
      { cn: '扫码', en: 'scan a code' },
      { cn: '规定区域', en: 'a designated area' },
      { cn: '乱停乱放', en: 'parking in the wrong places' }
    ]
  }
];

window.CET4_LISTENING = [
  {
    id: 'l1',
    transcript: "W: Excuse me, is this seat taken? M: No, go ahead. The train is almost empty today. W: Thanks. Do you know when we arrive in Nanjing? M: In about forty minutes, if there is no delay.",
    question: 'When will the train arrive in Nanjing?',
    options: ['In about fourteen minutes.', 'In about forty minutes.', 'In about four hours.', 'In about an hour and a half.'],
    answer: 1,
    explain: '关键句是 In about forty minutes。fourteen 和 forty 是四级听力最经典的数字陷阱，forty 重音在第一个音节。'
  },
  {
    id: 'l2',
    transcript: "M: I heard you moved to a new flat. How is it? W: Much better. It is smaller than the old one, but it is closer to the subway, so I save an hour every day.",
    question: 'What is the advantage of the new flat?',
    options: ['It is bigger.', 'It is quieter.', 'It is closer to the subway.', 'It is cheaper.'],
    answer: 2,
    explain: 'but 后面才是重点。听到 smaller than 之后要等着听转折。'
  },
  {
    id: 'l3',
    transcript: "W: Did you finish the report? M: Not yet. The data I need was not available until this morning, so I will have it done by five.",
    question: 'What will the man do by five?',
    options: ['Send an email.', 'Finish the report.', 'Meet the woman.', 'Collect the data.'],
    answer: 1,
    explain: 'I will have it done 中 it 指 report。这类题考指代理解。'
  },
  {
    id: 'l4',
    transcript: "M: You look tired. Have you been sleeping well? W: Not really. I have been preparing for the exam, and I keep going over my notes until midnight.",
    question: 'Why does the woman look tired?',
    options: ['She is ill.', 'She has been travelling.', 'She has been studying late.', 'She works at night.'],
    answer: 2,
    explain: 'keep going over my notes until midnight 等于 studying late，考同义替换。'
  },
  {
    id: 'l5',
    transcript: "W: The lecture was supposed to start at nine, but the speaker is stuck in traffic. M: Then let us wait in the hall. Someone will tell us when he arrives.",
    question: 'Why has the lecture not started?',
    options: ['The hall is closed.', 'The speaker is late.', 'The time was changed.', 'The students are late.'],
    answer: 1,
    explain: 'is stuck in traffic（堵在路上）说明他迟到了。',
  },
  {
    id: 'l6',
    transcript: "M: I am thinking of taking the job in Shanghai. W: It pays well, but have you considered how expensive it is to live there? M: That is a fair point. I will do the numbers before I decide.",
    question: 'What will the man do before deciding?',
    options: ['Ask for more money.', 'Visit Shanghai.', 'Calculate the cost of living.', 'Turn down the offer.'],
    answer: 2,
    explain: 'do the numbers 是口语里"算一算钱"的说法，等于 calculate the cost。'
  },
  {
    id: 'l7',
    transcript: "W: I am afraid I cannot make it to the meeting tomorrow morning. M: That is fine. I will send you the minutes so you do not miss anything important.",
    question: 'What will the man do?',
    options: ['Change the meeting time.', 'Cancel the meeting.', 'Send the woman the minutes.', 'Attend the meeting for her.'],
    answer: 2,
    explain: 'minutes 在这里不是"分钟"，是"会议记录"，一词多义是四级听力常见考点。'
  },
  {
    id: 'l8',
    transcript: "M: Excuse me, does this bus go to the museum? W: It used to, but the route changed last month. You need the number seven bus now, from the stop across the street.",
    question: 'What does the woman tell the man?',
    options: ['The bus is full.', 'The museum is closed.', 'He is on the wrong bus.', 'He should walk instead.'],
    answer: 2,
    explain: 'It used to, but the route changed 说明这趟车已经不到博物馆，他上错车了。'
  }
];

window.CET4_READING = [
  {
    id: 'r1',
    title: 'Why Boredom Might Be Good for You',
    text: "Boredom has a bad reputation. Most of us treat it as something to be avoided, and we reach for a phone at the first sign of it. Yet a growing number of psychologists argue that boredom serves a purpose. When the mind has nothing to do, it begins to search for meaning, and that search often produces new ideas. In one experiment, people who were asked to do a dull task, such as copying numbers, performed better on a later creativity test than people who had been given something interesting to do. The researchers explained that the dull task left the mind free to wander, and wandering is where original connections are made. This does not mean that we should fill our days with boring work. It means that the small empty moments we usually fill with a screen may be worth protecting. Sitting on a bus with nothing to do is not wasted time; it may be the only quiet space the mind gets all day.",
    questions: [
      { q: 'What do the psychologists mentioned in the passage believe about boredom?', options: ['It should be avoided completely.', 'It can lead to creative thinking.', 'It is a sign of low intelligence.', 'It only affects children.'], answer: 1, explain: '第一段核心观点：boredom serves a purpose，会在后文落到创造力上。' },
      { q: 'What does the author suggest readers do?', options: ['Take on more dull tasks.', 'Remove phones from their lives.', 'Protect small empty moments.', 'Avoid all experiments.'], answer: 2, explain: 'the small empty moments ... may be worth protecting 直接对应选项。' }
    ]
  },
  {
    id: 'r2',
    title: 'The Cost of Fast Delivery',
    text: "Online shopping has trained us to expect things quickly. A product ordered in the evening is often at the door the next morning. This convenience, however, is supported by a system that few customers ever see: warehouses in the outskirts, drivers working in tight time windows, and returns travelling back along the same routes. Each of these steps has a cost that does not appear on the receipt. Researchers who study delivery systems point out that the real price of fast shipping is paid in three places: in the air, through higher emissions; in wages, through pressure on workers; and in the streets, through more vans competing for the same parking space. None of this means that fast delivery is wrong. It means that customers who value it should also be willing to pay for it honestly, and that companies should be required to show the full cost rather than hide it behind a low headline price.",
    questions: [
      { q: 'What is the main argument of the passage?', options: ['Fast delivery should be banned.', 'The hidden costs of fast delivery should be recognised.', 'Online shopping is cheaper than going to shops.', 'Drivers are paid too much.'], answer: 1, explain: '全文在讲"看不见的成本"，并非主张禁止。' },
      { q: 'According to the passage, where is the cost paid?', options: ['Only in wages.', 'In emissions, wages and streets.', 'In the price on the receipt.', 'In the warehouses only.'], answer: 1, explain: '原文明确列出 in the air / in wages / in the streets 三处。' }
    ]
  },
  {
    id: 'r3',
    title: 'Learning by Teaching',
    text: "A simple way to learn something better is to explain it to someone else. This effect has been observed in many settings, from school classrooms to medical training. When learners expect to teach material, they organise it differently: they look for the main idea, they notice what is unclear, and they prepare for questions. These activities, rather than the act of speaking, seem to produce the benefit. There is a catch, however. The effect appears only when the explanation is genuine, meaning the learner really tries to help someone understand. Reading a summary aloud does not count. So if you want to use this method, find a real listener, even one who knows nothing about the topic, and try to make that person understand. The effort of adjusting your explanation is where the learning happens.",
    questions: [
      { q: 'Why does teaching help learning, according to the passage?', options: ['Because speaking aloud is pleasant.', 'Because learners organise material differently.', 'Because listeners ask easy questions.', 'Because it saves time in class.'], answer: 1, explain: 'they organise it differently 是原文给出的机制。' },
      { q: 'What condition must be met for the effect to appear?', options: ['The listener must be an expert.', 'The explanation must be genuine.', 'The topic must be difficult.', 'The learner must read a summary.'], answer: 1, explain: 'The effect appears only when the explanation is genuine。' }
    ]
  },
  {
    id: 'r4',
    title: 'Sleep and Memory',
    text: "For a long time, sleep was thought to be a passive state, a kind of switch-off between active days. Research over the past twenty years has changed that picture. During sleep, the brain replays patterns of activity from the day, strengthening some connections and weakening others. This process appears to be selective: what matters emotionally or what will be needed soon is kept, while the rest fades. Students who study late into the night often sacrifice exactly the period in which this work happens. The practical lesson is uncomfortable but clear. If you have to choose between one more hour of review and one more hour of sleep before an exam, the sleep is usually the better investment, provided that you have studied at all before. Sleep does not replace study; it completes it.",
    questions: [
      { q: 'How has the view of sleep changed?', options: ['From passive to active.', 'From active to passive.', 'From important to unimportant.', 'From short to long.'], answer: 0, explain: 'a passive state 被研究推翻，现在被视为大脑在工作。' },
      { q: 'What is the author\'s advice for students?', options: ['Study all night before exams.', 'Skip sleep to review more.', 'Prefer sleep over extra review.', 'Sleep instead of studying.'], answer: 2, explain: '注意 provided that you have studied at all before 这个限定。' }
    ]
  },
  {
    id: 'r5',
    title: 'The Reputation of Failure',
    text: "Failure is a strange kind of information. It is the most direct evidence that something in our approach does not work, yet it is the evidence we are least willing to look at. Part of the reason is social. In most settings, a failed attempt is visible while the many attempts that led to it are not, so failure appears to be a personal quality rather than a step in a process. Successful people often reinforce this impression by describing their work as a straight line of good decisions. The result is a shared illusion: everyone believes that other people succeed without failing, and therefore treats their own failures as proof that they should stop. A more useful habit is to record what did not work and why, in the same place where successes are recorded. Writing failure down turns an event into a reference, and a reference is something you can use.",
    questions: [
      { q: 'Why is failure hard to look at, according to the passage?', options: ['It is rarely useful.', 'Failed attempts are more visible than the process.', 'Successful people never fail.', 'It costs money.'], answer: 1, explain: 'a failed attempt is visible while the many attempts ... are not。' },
      { q: 'What habit does the author recommend?', options: ['Hiding failures from others.', 'Recording failures alongside successes.', 'Avoiding difficult projects.', 'Copying successful people.'], answer: 1, explain: '最后一句 Writing failure down turns an event into a reference。' }
    ]
  },
  {
    id: 'r6',
    title: 'Small Cities, Large Questions',
    text: "For decades, the story of urban growth was a story of big cities. Young people moved to capitals and coastal centres, and smaller cities lost them. Recent data suggest that this pattern is weakening. Remote work has made it possible for some employees to live where housing is cheaper, and local governments have begun to compete for those workers. Yet the shift is uneven. Cities with universities, hospitals and reliable transport attract newcomers; cities without them struggle to hold the residents they already have. The lesson is not that size no longer matters. It is that the things that make a city work, such as services, transport and public space, matter more than the number on a map. A small city with good buses and open libraries can offer a better life than a large city with neither.",
    questions: [
      { q: 'What recent change does the passage describe?', options: ['Everyone is moving to bigger cities.', 'Smaller cities are losing population faster than before.', 'The pattern of moving to big cities is weakening.', 'Remote work has ended.'], answer: 2, explain: 'this pattern is weakening 对应"正在减弱"。' },
      { q: 'What is the passage\'s conclusion?', options: ['City size is no longer relevant.', 'Services and public space matter more than size.', 'All cities should grow.', 'Housing prices should be controlled.'], answer: 1, explain: '注意作者说 not that size no longer matters，但强调 services/transport/public space 更重要。' }
    ]
  }
];
