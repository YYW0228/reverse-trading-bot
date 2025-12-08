export interface TraitAnalysis {
  title: string
  keywords: string[]
  desc: string
  careers: string[]
  gift: string
}

export const OCEAN_MATRIX: Record<string, { high: TraitAnalysis; low: TraitAnalysis }> = {
  o: {
    high: {
      title: '星际造梦师',
      keywords: ['天马行空', '艺术直觉', '破局思维'],
      desc: 'TA 的大脑像一座没有围墙的花园，拥有超越年龄的抽象思维能力。这种孩子往往不按套路出牌，是因为 TA 正在脑海中构建我们看不见的未来世界。',
      careers: ['建筑设计师', '科幻作家', 'AI 架构师'],
      gift: '洞察未来的第三只眼'
    },
    low: {
      title: '现实筑基者',
      keywords: ['极度专注', '逻辑严密', '执行力'],
      desc: 'TA 拥有令人羡慕的落地能力，比起空想，TA 更喜欢通过双手去感知和改变世界。这种稳如磐石的特质，是未来乱世中最稀缺的领导力基石。',
      careers: ['外科医生', '金融分析师', '大国工匠'],
      gift: '撼动现实的杠杆'
    }
  },
  c: {
    high: {
      title: '光之领袖',
      keywords: ['完美主义', '目标导向', '自驱力'],
      desc: 'TA 是天生的秩序建立者，内心自带一种追求卓越的各种引擎。不需要过多的鞭策，TA 自己就会向着山顶攀登。',
      careers: ['企业CEO', '首席法官', '航天指挥官'],
      gift: '绝对的秩序与掌控'
    },
    low: {
      title: '灵动游侠',
      keywords: ['灵活应变', '多线程', '抗压极强'],
      desc: 'TA 拥有像水一样的适应力，能够在复杂的环境中迅速找到生存之道。规矩束缚不了 TA，因为 TA 总是能找到通往终点的捷径。',
      careers: ['风险投资人', '战地记者', '探险家'],
      gift: '绝处逢生的适应力'
    }
  },
  e: {
    high: {
      title: '引力中心',
      keywords: ['社交光环', '情绪价值', '演说家'],
      desc: 'TA 就像一颗自带核聚变的小太阳，走到哪里都是人群的焦点。这种天生的感染力，让 TA 未来能轻易调动资源，成就不凡事业。',
      careers: ['外交官', '知名主播', '社群领袖'],
      gift: '凝聚人心的磁场'
    },
    low: {
      title: '深海哲人',
      keywords: ['深度思考', '敏锐观察', '内心富足'],
      desc: "TA 拥有同龄人少有的沉稳。与其在无效社交中消耗能量，TA 更擅长在独处中构建宏大的内心宫殿，是典型的'大器晚成'型人格。",
      careers: ['各类科学家', '畅销书作家', '战略顾问'],
      gift: '看穿本质的慧眼'
    }
  },
  a: {
    high: {
      title: '治愈天使',
      keywords: ['高情商', '读心术', '团队胶水'],
      desc: 'TA 拥有一颗极其柔软的心，能敏锐捕捉到别人察觉不到的情绪波动。这种极强的共情力，是 AI 时代唯一无法被替代的人类光辉。',
      careers: ['心理咨询师', '教育家', '非遗传承人'],
      gift: '温暖世界的治愈力'
    },
    low: {
      title: '理性王者',
      keywords: ['独立判断', '不随大流', '批判思维'],
      desc: "TA 从不为了讨好别人而委屈自己，拥有极强的边界感和原则性。这种'被讨厌的勇气'，正是改革者和颠覆者必备的心理素质。",
      careers: ['审计师', '调查记者', '改革家'],
      gift: '不被定义的勇气'
    }
  },
  n: {
    high: {
      title: '高感雷达',
      keywords: ['危机嗅觉', '艺术通感', '细腻'],
      desc: 'TA 对环境的变化有着惊人的感知力，这不是脆弱，而是极高的感官天赋。历史上伟大的艺术家和诗人，都拥有这样一颗晶莹剔透的心。',
      careers: ['艺术家', '品酒师', '危机公关专家'],
      gift: '极致的感官共鸣'
    },
    low: {
      title: '定海神针',
      keywords: ['情绪稳定', '泰山崩于前', '钝感力'],
      desc: "TA 拥有一颗强大的心脏，外界的风浪很难干扰 TA 的节奏。这种在这个焦虑时代极其昂贵的'钝感力'，是能够承载大事的容器。",
      careers: ['急诊科医生', '机长', '特种兵'],
      gift: '坚不可摧的内核'
    }
  }
}

export const calculateRarity = (traits: Record<string, number>): string => {
  const extremeCount = Object.values(traits).filter(v => v > 0.8 || v < 0.2).length
  if (extremeCount >= 4) return 'UR (超越 99.9% 同龄人)'
  if (extremeCount >= 3) return 'SSR (稀世天才)'
  if (extremeCount >= 2) return 'SR (卓越潜能)'
  return 'R (潜力新星)'
}
