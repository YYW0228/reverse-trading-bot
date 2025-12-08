<template>
  <div class="education-recommendations">
    <div class="section-header">
      <h5>个性化教育建议</h5>
      <p>根据您孩子的认知特质量身定制的教育策略</p>
    </div>

    <!-- 核心教育原则 -->
    <div class="principles-section">
      <q-card class="principles-card">
        <q-card-section>
          <h6>
            <q-icon name="lightbulb" color="amber" class="q-mr-sm" />
            核心教育原则
          </h6>
          <div class="principles-list">
            <div
              v-for="(principle, index) in corePrinciples"
              :key="index"
              class="principle-item"
            >
              <div class="principle-number">{{ index + 1 }}</div>
              <div class="principle-content">
                <strong>{{ principle.title }}</strong>
                <p>{{ principle.description }}</p>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 学科建议 -->
    <div class="subjects-section">
      <h6>学科发展建议</h6>
      <div class="subjects-grid">
        <q-card
          v-for="subject in subjectRecommendations"
          :key="subject.name"
          class="subject-card"
        >
          <q-card-section>
            <div class="subject-header">
              <q-icon :name="subject.icon" :color="subject.color" size="32px" />
              <span class="subject-name">{{ subject.name }}</span>
              <q-badge :color="subject.fit">
                {{ getFitLabel(subject.fit) }}
              </q-badge>
            </div>
            <p class="subject-tip">{{ subject.tip }}</p>
            <div class="subject-methods">
              <span class="methods-label">推荐方法：</span>
              <q-chip
                v-for="method in subject.methods"
                :key="method"
                size="sm"
                outline
                color="grey-7"
              >
                {{ method }}
              </q-chip>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 兴趣班推荐 -->
    <div class="activities-section">
      <h6>课外活动推荐</h6>
      <div class="activities-list">
        <q-item
          v-for="activity in recommendedActivities"
          :key="activity.name"
          class="activity-item"
        >
          <q-item-section avatar>
            <q-avatar :color="activity.color" text-color="white">
              <q-icon :name="activity.icon" />
            </q-avatar>
          </q-item-section>
          <q-item-section>
            <q-item-label>{{ activity.name }}</q-item-label>
            <q-item-label caption>{{ activity.reason }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <q-badge color="purple">{{ activity.priority }}</q-badge>
          </q-item-section>
        </q-item>
      </div>
    </div>

    <!-- 学习环境建议 -->
    <div class="environment-section">
      <q-card class="environment-card">
        <q-card-section>
          <h6>
            <q-icon name="home" color="blue" class="q-mr-sm" />
            学习环境建议
          </h6>
          <div class="environment-tips">
            <div v-for="tip in environmentTips" :key="tip" class="env-tip">
              <q-icon name="check_circle" color="positive" size="18px" />
              <span>{{ tip }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Analysis {
  archetypeType: string
  oceanScores: Record<string, number>
}

const props = defineProps<{ analysis: Analysis }>()

const archetype = computed(() => props.analysis?.archetypeType || 'eagle')

const corePrinciples = computed(() => {
  const principles: Record<string, Array<{ title: string; description: string }>> = {
    eagle: [
      { title: '尊重独立思考', description: '给予充分的思考空间，避免过度干预，让孩子自己得出结论' },
      { title: '设定明确目标', description: '帮助孩子设定清晰、可衡量的学习目标，满足其成就导向' },
      { title: '提供深度资源', description: '为感兴趣的领域提供深入学习的机会和资源' }
    ],
    wolf: [
      { title: '创造团队机会', description: '让孩子参与团队项目和小组活动，发挥其协作天赋' },
      { title: '培养领导能力', description: '适时给予领导角色，锻炼其组织和决策能力' },
      { title: '保持灵活应变', description: '教学方式要灵活多变，满足其对变化的需求' }
    ],
    water: [
      { title: '建立安全感', description: '创造温馨、稳定的学习环境，让孩子感到被支持' },
      { title: '情感引导学习', description: '通过故事、情感连接来激发学习兴趣' },
      { title: '鼓励表达感受', description: '重视孩子的情感表达，培养情商' }
    ],
    monkey: [
      { title: '保持新鲜感', description: '学习内容和方式要经常变化，避免单调重复' },
      { title: '鼓励创新尝试', description: '允许孩子用自己的方式解决问题，不要限制创意' },
      { title: '游戏化学习', description: '将学习融入游戏和探索活动中' }
    ]
  }
  return principles[archetype.value] || principles.eagle
})

const subjectRecommendations = computed(() => [
  {
    name: '数学逻辑',
    icon: 'calculate',
    color: 'blue',
    fit: archetype.value === 'eagle' ? 'positive' : 'info',
    tip: archetype.value === 'eagle'
      ? '逻辑思维强，适合深入学习数学'
      : '通过实际应用场景学习数学概念',
    methods: ['思维导图', '问题解决', '数学游戏']
  },
  {
    name: '语言文学',
    icon: 'menu_book',
    color: 'orange',
    fit: archetype.value === 'water' ? 'positive' : 'info',
    tip: archetype.value === 'water'
      ? '情感丰富，适合文学创作和表达'
      : '通过阅读感兴趣的题材培养语言能力',
    methods: ['亲子阅读', '故事创作', '角色扮演']
  },
  {
    name: '科学探索',
    icon: 'science',
    color: 'green',
    fit: archetype.value === 'monkey' ? 'positive' : 'info',
    tip: archetype.value === 'monkey'
      ? '好奇心强，非常适合科学探索'
      : '通过动手实验激发科学兴趣',
    methods: ['科学实验', '自然观察', '项目研究']
  },
  {
    name: '艺术创意',
    icon: 'palette',
    color: 'purple',
    fit: props.analysis?.oceanScores?.openness > 70 ? 'positive' : 'info',
    tip: '通过艺术表达内心世界，培养创造力',
    methods: ['绘画', '音乐', '手工制作']
  }
])

const recommendedActivities = computed(() => {
  const activities: Record<string, Array<{ name: string; icon: string; color: string; reason: string; priority: string }>> = {
    eagle: [
      { name: '编程/机器人', icon: 'code', color: 'blue', reason: '发挥逻辑思维优势', priority: '高' },
      { name: '国际象棋', icon: 'extension', color: 'brown', reason: '培养战略思维', priority: '高' },
      { name: '科学实验班', icon: 'science', color: 'green', reason: '满足求知欲', priority: '中' }
    ],
    wolf: [
      { name: '团队运动', icon: 'sports_soccer', color: 'green', reason: '发挥协作能力', priority: '高' },
      { name: '演讲/辩论', icon: 'campaign', color: 'orange', reason: '锻炼领导力', priority: '高' },
      { name: '戏剧表演', icon: 'theater_comedy', color: 'purple', reason: '团队合作与表达', priority: '中' }
    ],
    water: [
      { name: '音乐/乐器', icon: 'music_note', color: 'purple', reason: '情感表达渠道', priority: '高' },
      { name: '绘画/书法', icon: 'brush', color: 'pink', reason: '艺术熏陶', priority: '高' },
      { name: '阅读俱乐部', icon: 'auto_stories', color: 'blue', reason: '文学情感共鸣', priority: '中' }
    ],
    monkey: [
      { name: '创客/发明', icon: 'build', color: 'orange', reason: '释放创造力', priority: '高' },
      { name: '戏剧/即兴表演', icon: 'theater_comedy', color: 'purple', reason: '表达与创意', priority: '高' },
      { name: '科学探索营', icon: 'explore', color: 'green', reason: '满足好奇心', priority: '中' }
    ]
  }
  return activities[archetype.value] || activities.eagle
})

const environmentTips = computed(() => {
  const tips: Record<string, string[]> = {
    eagle: [
      '提供安静、独立的学习空间',
      '准备充足的学习资料和工具',
      '设置清晰的学习计划表',
      '减少不必要的干扰'
    ],
    wolf: [
      '可以有适度的社交互动空间',
      '布置团队合作的学习角',
      '保持环境的灵活性',
      '提供展示成果的区域'
    ],
    water: [
      '营造温馨、舒适的氛围',
      '添加柔和的灯光和装饰',
      '播放轻柔的背景音乐',
      '保持环境的稳定性'
    ],
    monkey: [
      '提供多样化的学习工具',
      '允许一定程度的"混乱"',
      '设置动手操作的空间',
      '定期更换环境布置'
    ]
  }
  return tips[archetype.value] || tips.eagle
})

const getFitLabel = (fit: string) => {
  const labels: Record<string, string> = {
    positive: '高度匹配',
    warning: '适度培养',
    info: '可以发展'
  }
  return labels[fit] || '可以发展'
}
</script>

<style scoped>
.education-recommendations {
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
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
  margin-bottom: 2rem;
}

.principles-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.principle-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
}

.principle-number {
  width: 28px;
  height: 28px;
  background: #F59E0B;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
}

.principle-content p {
  margin: 0.25rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.subjects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.subject-card {
  border-radius: 15px;
}

.subject-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
}

.subject-name {
  font-weight: 600;
  flex: 1;
}

.subject-tip {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.subject-methods {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem;
}

.methods-label {
  font-size: 0.8rem;
  color: #999;
}

.activities-section {
  margin-bottom: 2rem;
}

.activities-list {
  background: #F9FAFB;
  border-radius: 15px;
  overflow: hidden;
}

.activity-item {
  border-bottom: 1px solid #E5E7EB;
}

.activity-item:last-child {
  border-bottom: none;
}

.environment-card {
  background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
}

.environment-tips {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.env-tip {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #333;
}
</style>
