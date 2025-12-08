<template>
  <div class="trait-interpretation">
    <div class="interpretation-header">
      <h5>认知特质深度解读</h5>
      <p>基于皮纹分析与心理学理论的综合解读</p>
    </div>

    <!-- 主要特质卡片 -->
    <div class="traits-grid">
      <q-card
        v-for="trait in mainTraits"
        :key="trait.name"
        class="trait-card"
      >
        <q-card-section>
          <div class="trait-header">
            <div class="trait-icon" :style="{ background: trait.color }">
              <q-icon :name="trait.icon" color="white" size="24px" />
            </div>
            <div class="trait-title">
              <h6>{{ trait.name }}</h6>
              <q-badge :color="getScoreColor(trait.score)">
                {{ trait.score }}分
              </q-badge>
            </div>
          </div>

          <div class="trait-description">
            <p>{{ trait.description }}</p>
          </div>

          <div class="trait-details">
            <div class="detail-item">
              <span class="label">优势表现</span>
              <span class="value text-positive">{{ trait.strength }}</span>
            </div>
            <div class="detail-item">
              <span class="label">潜在挑战</span>
              <span class="value text-warning">{{ trait.challenge }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 认知风格分析 -->
    <div class="cognitive-style">
      <q-card class="style-card">
        <q-card-section>
          <h5>认知风格分析</h5>
          <div class="style-content">
            <div class="style-item">
              <span class="style-label">学习偏好</span>
              <div class="style-tags">
                <q-chip
                  v-for="tag in learningStyles"
                  :key="tag"
                  color="purple-2"
                  text-color="purple"
                  size="sm"
                >
                  {{ tag }}
                </q-chip>
              </div>
            </div>

            <div class="style-item">
              <span class="style-label">思维模式</span>
              <div class="style-tags">
                <q-chip
                  v-for="tag in thinkingModes"
                  :key="tag"
                  color="blue-2"
                  text-color="blue"
                  size="sm"
                >
                  {{ tag }}
                </q-chip>
              </div>
            </div>

            <div class="style-item">
              <span class="style-label">社交倾向</span>
              <div class="style-tags">
                <q-chip
                  v-for="tag in socialStyles"
                  :key="tag"
                  color="green-2"
                  text-color="green"
                  size="sm"
                >
                  {{ tag }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 发展潜能 -->
    <div class="potential-areas">
      <h5>发展潜能领域</h5>
      <div class="potential-grid">
        <div
          v-for="area in potentialAreas"
          :key="area.name"
          class="potential-item"
        >
          <q-circular-progress
            :value="area.score"
            size="80px"
            :thickness="0.15"
            color="purple"
            track-color="grey-3"
            show-value
            class="potential-progress"
          />
          <span class="potential-name">{{ area.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Analysis {
  oceanScores: Record<string, number>
  archetypeType: string
}

const props = defineProps<{ analysis: Analysis }>()

const mainTraits = computed(() => {
  const scores = props.analysis?.oceanScores || {}
  return [
    {
      name: '开放性',
      score: scores.openness || 75,
      icon: 'explore',
      color: '#8B5CF6',
      description: '对新事物的接受度和创造性思维能力',
      strength: '好奇心强，富有想象力',
      challenge: '可能过于理想化'
    },
    {
      name: '尽责性',
      score: scores.conscientiousness || 68,
      icon: 'assignment_turned_in',
      color: '#10B981',
      description: '自我约束、目标导向和责任感',
      strength: '做事有条理，可靠',
      challenge: '可能过于追求完美'
    },
    {
      name: '外向性',
      score: scores.extraversion || 72,
      icon: 'groups',
      color: '#F59E0B',
      description: '社交活力和与他人互动的倾向',
      strength: '善于表达，热情开朗',
      challenge: '需要学会独处'
    },
    {
      name: '宜人性',
      score: scores.agreeableness || 80,
      icon: 'favorite',
      color: '#EF4444',
      description: '合作性、同理心和信任倾向',
      strength: '善解人意，乐于助人',
      challenge: '可能过于迁就他人'
    },
    {
      name: '情绪稳定性',
      score: 100 - (scores.neuroticism || 35),
      icon: 'psychology',
      color: '#3B82F6',
      description: '情绪调节能力和压力应对',
      strength: '情绪平稳，抗压能力好',
      challenge: '需关注情绪表达'
    }
  ]
})

const learningStyles = computed(() => {
  const type = props.analysis?.archetypeType || 'eagle'
  const styles: Record<string, string[]> = {
    eagle: ['视觉学习', '独立研究', '系统性学习'],
    wolf: ['团队协作', '实践操作', '项目制学习'],
    water: ['情感体验', '故事叙述', '艺术表达'],
    monkey: ['探索发现', '游戏化学习', '跨学科整合']
  }
  return styles[type] || styles.eagle
})

const thinkingModes = computed(() => {
  const type = props.analysis?.archetypeType || 'eagle'
  const modes: Record<string, string[]> = {
    eagle: ['逻辑分析', '战略规划', '细节导向'],
    wolf: ['全局思维', '灵活应变', '目标驱动'],
    water: ['直觉感知', '情感智能', '和谐导向'],
    monkey: ['发散思维', '创意联想', '打破常规']
  }
  return modes[type] || modes.eagle
})

const socialStyles = computed(() => {
  const type = props.analysis?.archetypeType || 'eagle'
  const styles: Record<string, string[]> = {
    eagle: ['独立自主', '深度交流', '选择性社交'],
    wolf: ['团队领导', '广泛社交', '合作共赢'],
    water: ['情感支持', '和谐相处', '倾听者'],
    monkey: ['活跃分子', '创意分享', '社交达人']
  }
  return styles[type] || styles.eagle
})

const potentialAreas = computed(() => [
  { name: '逻辑数理', score: Math.round((props.analysis?.oceanScores?.conscientiousness || 70) * 0.9) },
  { name: '语言表达', score: Math.round((props.analysis?.oceanScores?.extraversion || 70) * 0.95) },
  { name: '艺术创造', score: Math.round((props.analysis?.oceanScores?.openness || 75) * 0.92) },
  { name: '人际沟通', score: Math.round((props.analysis?.oceanScores?.agreeableness || 80) * 0.88) },
  { name: '自我管理', score: Math.round((100 - (props.analysis?.oceanScores?.neuroticism || 35)) * 0.9) }
])

const getScoreColor = (score: number) => {
  if (score >= 80) return 'positive'
  if (score >= 60) return 'warning'
  return 'info'
}
</script>

<style scoped>
.trait-interpretation {
  padding: 1rem 0;
}

.interpretation-header {
  margin-bottom: 1.5rem;
}

.interpretation-header h5 {
  color: #5B21B6;
  margin-bottom: 0.25rem;
}

.interpretation-header p {
  color: #666;
  font-size: 0.9rem;
}

.traits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.trait-card {
  border-radius: 15px;
}

.trait-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.trait-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.trait-title h6 {
  margin: 0;
  color: #333;
}

.trait-description p {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.trait-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
}

.detail-item .label {
  color: #999;
}

.style-card {
  margin-bottom: 2rem;
}

.style-card h5 {
  color: #5B21B6;
  margin-bottom: 1rem;
}

.style-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.style-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.style-label {
  min-width: 80px;
  color: #666;
  font-size: 0.9rem;
}

.style-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.potential-areas h5 {
  color: #5B21B6;
  margin-bottom: 1rem;
}

.potential-grid {
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.potential-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.potential-name {
  font-size: 0.85rem;
  color: #666;
}
</style>
