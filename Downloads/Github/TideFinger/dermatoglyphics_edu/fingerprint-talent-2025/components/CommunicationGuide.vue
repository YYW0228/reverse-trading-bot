<template>
  <div class="communication-guide">
    <div class="section-header">
      <h5>亲子沟通指南</h5>
      <p>针对孩子特质的有效沟通策略</p>
    </div>

    <!-- 沟通原则 -->
    <div class="principles-section">
      <q-card class="principles-card">
        <q-card-section>
          <h6>
            <q-icon name="record_voice_over" color="purple" class="q-mr-sm" />
            核心沟通原则
          </h6>
          <div class="principles-grid">
            <div
              v-for="principle in communicationPrinciples"
              :key="principle.title"
              class="principle-item"
            >
              <q-icon :name="principle.icon" :color="principle.color" size="28px" />
              <div class="principle-content">
                <strong>{{ principle.title }}</strong>
                <p>{{ principle.description }}</p>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 推荐话术 -->
    <div class="phrases-section">
      <h6>推荐沟通话术</h6>
      <div class="phrases-comparison">
        <!-- 避免说 -->
        <q-card class="avoid-card">
          <q-card-section>
            <div class="card-header negative">
              <q-icon name="cancel" color="negative" size="24px" />
              <span>尽量避免</span>
            </div>
            <div class="phrases-list">
              <div
                v-for="phrase in avoidPhrases"
                :key="phrase"
                class="phrase-item avoid"
              >
                <q-icon name="remove_circle" color="negative" size="18px" />
                <span>{{ phrase }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>

        <!-- 推荐说 -->
        <q-card class="recommend-card">
          <q-card-section>
            <div class="card-header positive">
              <q-icon name="check_circle" color="positive" size="24px" />
              <span>推荐使用</span>
            </div>
            <div class="phrases-list">
              <div
                v-for="phrase in recommendPhrases"
                :key="phrase"
                class="phrase-item recommend"
              >
                <q-icon name="add_circle" color="positive" size="18px" />
                <span>{{ phrase }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 情景对话示例 -->
    <div class="scenarios-section">
      <h6>情景沟通示例</h6>
      <q-expansion-item
        v-for="scenario in scenarios"
        :key="scenario.situation"
        :label="scenario.situation"
        :icon="scenario.icon"
        expand-separator
        class="scenario-item"
      >
        <q-card>
          <q-card-section>
            <div class="scenario-content">
              <div class="scenario-wrong">
                <strong class="text-negative">
                  <q-icon name="close" /> 不推荐的回应：
                </strong>
                <p>{{ scenario.wrong }}</p>
              </div>
              <div class="scenario-right">
                <strong class="text-positive">
                  <q-icon name="check" /> 推荐的回应：
                </strong>
                <p>{{ scenario.right }}</p>
              </div>
              <div class="scenario-reason">
                <strong class="text-info">
                  <q-icon name="lightbulb" /> 原因解析：
                </strong>
                <p>{{ scenario.reason }}</p>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </q-expansion-item>
    </div>

    <!-- 认知重构 -->
    <div class="reframe-section">
      <q-card class="reframe-card">
        <q-card-section>
          <h6>
            <q-icon name="psychology_alt" color="amber" class="q-mr-sm" />
            认知重构：换个角度看孩子
          </h6>
          <div class="reframe-list">
            <div
              v-for="reframe in reframingRules"
              :key="reframe.surface"
              class="reframe-item"
            >
              <div class="reframe-surface">
                <span class="label">表面看起来：</span>
                <span class="text-negative">{{ reframe.surface }}</span>
              </div>
              <q-icon name="arrow_forward" color="purple" size="24px" class="reframe-arrow" />
              <div class="reframe-deep">
                <span class="label">实际上是：</span>
                <span class="text-positive">{{ reframe.deep }}</span>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 每日沟通提醒 -->
    <div class="daily-tips-section">
      <h6>每日沟通小贴士</h6>
      <div class="tips-grid">
        <q-card
          v-for="tip in dailyTips"
          :key="tip.time"
          class="tip-card"
        >
          <q-card-section>
            <div class="tip-header">
              <q-icon :name="tip.icon" color="purple" size="24px" />
              <span class="tip-time">{{ tip.time }}</span>
            </div>
            <p class="tip-content">{{ tip.content }}</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Analysis {
  archetypeType: string
}

const props = defineProps<{ analysis: Analysis }>()

const archetype = computed(() => props.analysis?.archetypeType || 'eagle')

const communicationPrinciples = computed(() => {
  const principles: Record<string, Array<{ title: string; description: string; icon: string; color: string }>> = {
    eagle: [
      { title: '尊重独立', description: '给予充分的决策空间，避免过度干预', icon: 'account_circle', color: 'blue' },
      { title: '讲道理', description: '用逻辑和事实说服，而非命令', icon: 'psychology', color: 'purple' },
      { title: '承认成就', description: '具体表扬努力和成果，而非泛泛称赞', icon: 'emoji_events', color: 'amber' },
      { title: '预留时间', description: '给孩子思考的时间，不要催促回答', icon: 'schedule', color: 'green' }
    ],
    wolf: [
      { title: '平等对话', description: '像对待伙伴一样交流，尊重其意见', icon: 'handshake', color: 'blue' },
      { title: '给予角色', description: '让孩子参与家庭决策，培养责任感', icon: 'assignment_ind', color: 'purple' },
      { title: '灵活应变', description: '根据情况调整沟通方式', icon: 'sync_alt', color: 'green' },
      { title: '团队语言', description: '使用"我们"而非"你应该"', icon: 'groups', color: 'orange' }
    ],
    water: [
      { title: '情感优先', description: '先关注感受，再讨论事情', icon: 'favorite', color: 'red' },
      { title: '温和表达', description: '用温柔的语气和方式沟通', icon: 'spa', color: 'pink' },
      { title: '倾听为主', description: '多听少说，让孩子充分表达', icon: 'hearing', color: 'blue' },
      { title: '安全感', description: '营造接纳和包容的氛围', icon: 'shield', color: 'green' }
    ],
    monkey: [
      { title: '保持好奇', description: '对孩子的想法表现出真诚的兴趣', icon: 'lightbulb', color: 'amber' },
      { title: '幽默互动', description: '用轻松有趣的方式沟通', icon: 'mood', color: 'orange' },
      { title: '开放问题', description: '多问"为什么""如果"类问题', icon: 'help', color: 'blue' },
      { title: '接纳创意', description: '即使想法奇特也要先肯定', icon: 'auto_awesome', color: 'purple' }
    ]
  }
  return principles[archetype.value] || principles.eagle
})

const avoidPhrases = computed(() => {
  const phrases: Record<string, string[]> = {
    eagle: [
      '你怎么这么固执？',
      '别想那么多，听我的就行',
      '你这样做不对',
      '快点，别磨蹭'
    ],
    wolf: [
      '这件事我说了算',
      '你还小，不懂',
      '别总想当头',
      '跟其他孩子学学'
    ],
    water: [
      '别哭了，有什么好哭的',
      '你太敏感了',
      '别想太多',
      '坚强点'
    ],
    monkey: [
      '你能不能专心点？',
      '别总是乱想',
      '正经点',
      '你怎么又变了'
    ]
  }
  return phrases[archetype.value] || phrases.eagle
})

const recommendPhrases = computed(() => {
  const phrases: Record<string, string[]> = {
    eagle: [
      '你是怎么想的？我想听听你的看法',
      '你考虑得很周全',
      '我理解你的想法，我们可以讨论一下',
      '需要更多时间思考吗？'
    ],
    wolf: [
      '这件事你有什么建议？',
      '我们一起来解决这个问题',
      '你可以负责这个部分',
      '你的想法很有价值'
    ],
    water: [
      '你现在感觉怎么样？',
      '我理解你的感受',
      '我会一直在你身边',
      '有什么想说的都可以告诉我'
    ],
    monkey: [
      '这个想法很有创意！',
      '你是怎么想到的？',
      '我们可以试试看',
      '还有什么新点子吗？'
    ]
  }
  return phrases[archetype.value] || phrases.eagle
})

const scenarios = computed(() => {
  const allScenarios: Record<string, Array<{ situation: string; icon: string; wrong: string; right: string; reason: string }>> = {
    eagle: [
      {
        situation: '孩子坚持自己的做法不愿改变',
        icon: 'psychology',
        wrong: '"你怎么这么倔？听话！"',
        right: '"我注意到你有自己的想法。能告诉我为什么这样做吗？"',
        reason: '鹰型孩子需要被理解其背后的逻辑，强制只会增加抵触'
      },
      {
        situation: '孩子对作业提出质疑',
        icon: 'quiz',
        wrong: '"老师说什么就是什么，别多问"',
        right: '"这是个好问题！我们可以一起研究一下"',
        reason: '鹰型孩子的质疑精神是珍贵的批判性思维萌芽'
      }
    ],
    wolf: [
      {
        situation: '孩子想要组织同学活动',
        icon: 'groups',
        wrong: '"别总想着玩，先把学习搞好"',
        right: '"这个想法不错！你打算怎么安排？需要我帮忙吗？"',
        reason: '狼型孩子的组织欲望是领导力的体现，应该引导而非压制'
      }
    ],
    water: [
      {
        situation: '孩子因为小事哭泣',
        icon: 'sentiment_dissatisfied',
        wrong: '"这有什么好哭的？坚强点！"',
        right: '"我看到你很难过。要不要告诉我发生了什么？"',
        reason: '水型孩子情感敏感，需要被接纳而非否定'
      }
    ],
    monkey: [
      {
        situation: '孩子做事三分钟热度',
        icon: 'hourglass_empty',
        wrong: '"你怎么又放弃了？做事要有始有终！"',
        right: '"你之前对这个很感兴趣，是什么让你想换个新的？"',
        reason: '猴型孩子需要理解而非批评，探索是他们的学习方式'
      }
    ]
  }
  return allScenarios[archetype.value] || allScenarios.eagle
})

const reframingRules = computed(() => {
  const rules: Record<string, Array<{ surface: string; deep: string }>> = {
    eagle: [
      { surface: '固执、不听话', deep: '有主见、独立思考' },
      { surface: '太较真、爱钻牛角尖', deep: '追求完美、注重细节' },
      { surface: '不合群、孤僻', deep: '有选择性社交、深度交流' }
    ],
    wolf: [
      { surface: '爱出风头、爱表现', deep: '有领导潜质、善于影响他人' },
      { surface: '主意太多、不专一', deep: '灵活应变、战略思维' },
      { surface: '太爱管别人', deep: '有责任心、团队意识强' }
    ],
    water: [
      { surface: '太敏感、爱哭', deep: '情感丰富、同理心强' },
      { surface: '没主见、随大流', deep: '善于协调、重视和谐' },
      { surface: '胆小、不敢表达', deep: '谨慎细腻、善于观察' }
    ],
    monkey: [
      { surface: '坐不住、太好动', deep: '精力充沛、探索欲强' },
      { surface: '三分钟热度', deep: '兴趣广泛、善于发现' },
      { surface: '不守规矩、爱捣乱', deep: '创新思维、敢于突破' }
    ]
  }
  return rules[archetype.value] || rules.eagle
})

const dailyTips = [
  {
    time: '早晨',
    icon: 'wb_sunny',
    content: '用积极的话语开启新的一天："今天有什么期待的事情吗？"'
  },
  {
    time: '放学后',
    icon: 'school',
    content: '关注感受而非成绩："今天在学校有什么有趣的事情吗？"'
  },
  {
    time: '晚餐时',
    icon: 'restaurant',
    content: '创造家庭交流时光，每个人分享一天中最棒的时刻'
  },
  {
    time: '睡前',
    icon: 'bedtime',
    content: '给予安全感和肯定："今天你做得很棒，晚安，我爱你"'
  }
]
</script>

<style scoped>
.communication-guide {
  padding: 1rem 0;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h5 {
  color: #5B21B6;
  margin-bottom: 0.25rem;
}

.section-header p {
  color: #666;
  font-size: 0.9rem;
}

h6 {
  color: #5B21B6;
  margin-bottom: 1rem;
}

.principles-card {
  margin-bottom: 2rem;
}

.principles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.principle-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.principle-content strong {
  display: block;
  margin-bottom: 0.25rem;
}

.principle-content p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.phrases-comparison {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.card-header.negative {
  color: #EF4444;
}

.card-header.positive {
  color: #10B981;
}

.phrases-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.phrase-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  border-radius: 8px;
}

.phrase-item.avoid {
  background: rgba(239, 68, 68, 0.1);
}

.phrase-item.recommend {
  background: rgba(16, 185, 129, 0.1);
}

.scenario-item {
  margin-bottom: 0.5rem;
  background: #F9FAFB;
  border-radius: 10px;
}

.scenario-content > div {
  margin-bottom: 1rem;
}

.scenario-content > div:last-child {
  margin-bottom: 0;
}

.scenario-content p {
  margin: 0.5rem 0 0;
  padding-left: 1.5rem;
  color: #666;
}

.reframe-card {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  margin-bottom: 2rem;
}

.reframe-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.reframe-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.reframe-surface,
.reframe-deep {
  flex: 1;
  min-width: 200px;
}

.reframe-surface .label,
.reframe-deep .label {
  display: block;
  font-size: 0.8rem;
  color: #999;
  margin-bottom: 0.25rem;
}

.reframe-arrow {
  flex-shrink: 0;
}

.tips-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.tip-card {
  border-radius: 15px;
}

.tip-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.tip-time {
  font-weight: 600;
  color: #5B21B6;
}

.tip-content {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}
</style>
