<template>
  <div class="analysis-progress">
    <div class="progress-header">
      <div class="brain-animation">
        <q-spinner-cube size="80px" color="purple" />
      </div>
      <h4>AI正在分析中...</h4>
      <p>请耐心等待，预计需要30-60秒</p>
    </div>

    <!-- 进度显示 -->
    <div class="progress-display">
      <q-linear-progress
        :value="progress / 100"
        size="20px"
        color="purple"
        rounded
        stripe
        animation-speed="1000"
        class="main-progress"
      />
      <span class="progress-percent">{{ progress }}%</span>
    </div>

    <!-- 分析步骤 -->
    <div class="analysis-steps">
      <div
        v-for="(step, index) in steps"
        :key="index"
        class="step-item"
        :class="{
          'completed': step.completed,
          'active': step.active
        }"
      >
        <div class="step-icon">
          <q-icon
            :name="step.completed ? 'check_circle' : step.icon"
            :color="step.completed ? 'positive' : (step.active ? 'purple' : 'grey')"
            size="24px"
          />
        </div>
        <div class="step-info">
          <span class="step-name">{{ step.name }}</span>
          <span v-if="step.active" class="step-status">处理中...</span>
          <span v-else-if="step.completed" class="step-status text-positive">已完成</span>
        </div>
      </div>
    </div>

    <!-- 科学小知识 -->
    <div class="fun-facts">
      <q-card class="fact-card">
        <q-card-section>
          <div class="fact-icon">💡</div>
          <h5>您知道吗？</h5>
          <p>{{ currentFact }}</p>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Analysis {
  id: string
  status: string
}

const props = defineProps<{
  analysis: Analysis | null
  progress: number
}>()

const emit = defineEmits(['complete'])

const steps = ref([
  { name: '图像预处理', icon: 'image', completed: false, active: true },
  { name: '纹型识别', icon: 'fingerprint', completed: false, active: false },
  { name: '特征提取', icon: 'search', completed: false, active: false },
  { name: '性格分析', icon: 'psychology', completed: false, active: false },
  { name: '报告生成', icon: 'description', completed: false, active: false }
])

const facts = [
  '指纹在胚胎第13-19周形成，与大脑皮层同步发育',
  '世界上没有两个人的指纹完全相同，即使是同卵双胞胎',
  '指纹的脊线密度与触觉敏感度有关',
  '科学研究表明，指纹纹型与认知风格存在相关性',
  '掌纹的ATD角度可反映神经系统发育特点'
]

const currentFactIndex = ref(0)
const currentFact = computed(() => facts[currentFactIndex.value])

// 监听进度更新步骤状态
watch(() => props.progress, (newProgress) => {
  const stepProgress = newProgress / 20 // 5个步骤，每个20%

  steps.value.forEach((step, index) => {
    step.completed = index < Math.floor(stepProgress)
    step.active = index === Math.floor(stepProgress) && newProgress < 100
  })

  if (newProgress >= 100) {
    steps.value.forEach(step => {
      step.completed = true
      step.active = false
    })
    emit('complete', props.analysis)
  }
})

// 轮换科学小知识
onMounted(() => {
  setInterval(() => {
    currentFactIndex.value = (currentFactIndex.value + 1) % facts.length
  }, 5000)
})
</script>

<style scoped>
.analysis-progress {
  padding: 2rem 0;
  text-align: center;
}

.progress-header {
  margin-bottom: 2rem;
}

.brain-animation {
  margin-bottom: 1rem;
}

.progress-header h4 {
  color: #5B21B6;
  margin-bottom: 0.5rem;
}

.progress-header p {
  color: #666;
}

.progress-display {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.main-progress {
  flex: 1;
}

.progress-percent {
  font-size: 1.5rem;
  font-weight: bold;
  color: #5B21B6;
  min-width: 60px;
}

.analysis-steps {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
  text-align: left;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  background: #F9FAFB;
  border-radius: 10px;
  transition: all 0.3s;
}

.step-item.active {
  background: rgba(139, 92, 246, 0.1);
  border-left: 3px solid #8B5CF6;
}

.step-item.completed {
  background: rgba(16, 185, 129, 0.1);
}

.step-info {
  display: flex;
  flex-direction: column;
}

.step-name {
  font-weight: 500;
  color: #333;
}

.step-status {
  font-size: 0.8rem;
  color: #8B5CF6;
}

.fact-card {
  background: linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%);
  text-align: center;
}

.fact-icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.fact-card h5 {
  color: #5B21B6;
  margin-bottom: 0.5rem;
}

.fact-card p {
  color: #666;
  font-size: 0.95rem;
}
</style>
