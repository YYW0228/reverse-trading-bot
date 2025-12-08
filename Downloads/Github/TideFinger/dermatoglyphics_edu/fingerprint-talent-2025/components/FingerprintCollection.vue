<template>
  <div class="fingerprint-collection">
    <div class="collection-header">
      <h4>请依次采集十指指纹</h4>
      <p class="hint-text">点击手指图标开始采集，建议在光线充足的环境下进行</p>
    </div>

    <!-- 手部示意图 -->
    <div class="hands-container">
      <!-- 左手 -->
      <div class="hand left-hand">
        <h5>左手</h5>
        <div class="fingers-row">
          <div
            v-for="finger in leftFingers"
            :key="finger.id"
            class="finger-slot"
            :class="{
              'collected': collectedFingers.includes(finger.id),
              'active': activeFinger === finger.id
            }"
            @click="selectFinger(finger.id)"
          >
            <q-icon
              :name="collectedFingers.includes(finger.id) ? 'check_circle' : 'fingerprint'"
              :color="collectedFingers.includes(finger.id) ? 'positive' : 'purple'"
              size="32px"
            />
            <span class="finger-label">{{ finger.label }}</span>
          </div>
        </div>
      </div>

      <!-- 右手 -->
      <div class="hand right-hand">
        <h5>右手</h5>
        <div class="fingers-row">
          <div
            v-for="finger in rightFingers"
            :key="finger.id"
            class="finger-slot"
            :class="{
              'collected': collectedFingers.includes(finger.id),
              'active': activeFinger === finger.id
            }"
            @click="selectFinger(finger.id)"
          >
            <q-icon
              :name="collectedFingers.includes(finger.id) ? 'check_circle' : 'fingerprint'"
              :color="collectedFingers.includes(finger.id) ? 'positive' : 'purple'"
              size="32px"
            />
            <span class="finger-label">{{ finger.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 进度条 -->
    <div class="progress-section">
      <q-linear-progress
        :value="progress"
        color="purple"
        size="12px"
        rounded
        class="progress-bar"
      />
      <span class="progress-text">{{ collectedFingers.length }}/10 已采集</span>
    </div>

    <!-- 相机组件 -->
    <div v-if="showCamera" class="camera-section">
      <SmartCameraGuide
        :finger-type="currentFingerType"
        @captured="handleCapture"
        @error="handleError"
      />
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <q-btn
        flat
        color="grey"
        label="上一步"
        icon="arrow_back"
        @click="$emit('back')"
        no-caps
      />
      <q-btn
        color="purple"
        label="下一步"
        icon-right="arrow_forward"
        :disable="collectedFingers.length < 10"
        @click="handleNext"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import SmartCameraGuide from './SmartCameraGuide.vue'

const props = defineProps<{ modelValue: string[] }>()
const emit = defineEmits(['update:modelValue', 'next', 'back'])

const collectedFingers = ref<string[]>([])
const activeFinger = ref<string | null>(null)
const showCamera = ref(false)
const currentFingerType = ref<string>('index')

const leftFingers = [
  { id: 'LT', label: '拇指', type: 'thumb' },
  { id: 'LI', label: '食指', type: 'index' },
  { id: 'LM', label: '中指', type: 'middle' },
  { id: 'LR', label: '无名指', type: 'ring' },
  { id: 'LL', label: '小指', type: 'pinky' }
]

const rightFingers = [
  { id: 'RT', label: '拇指', type: 'thumb' },
  { id: 'RI', label: '食指', type: 'index' },
  { id: 'RM', label: '中指', type: 'middle' },
  { id: 'RR', label: '无名指', type: 'ring' },
  { id: 'RL', label: '小指', type: 'pinky' }
]

const progress = computed(() => collectedFingers.value.length / 10)

const selectFinger = (fingerId: string) => {
  if (collectedFingers.value.includes(fingerId)) return

  activeFinger.value = fingerId
  const finger = [...leftFingers, ...rightFingers].find(f => f.id === fingerId)
  if (finger) {
    currentFingerType.value = finger.type
  }
  showCamera.value = true
}

const handleCapture = (imageData: string, quality: number) => {
  if (activeFinger.value && !collectedFingers.value.includes(activeFinger.value)) {
    collectedFingers.value.push(activeFinger.value)
    emit('update:modelValue', [...props.modelValue, imageData])
  }
  showCamera.value = false
  activeFinger.value = null
}

const handleError = (error: string) => {
  console.error('采集错误:', error)
  showCamera.value = false
}

const handleNext = () => {
  emit('next')
}
</script>

<style scoped>
.fingerprint-collection {
  padding: 1rem 0;
}

.collection-header {
  text-align: center;
  margin-bottom: 2rem;
}

.collection-header h4 {
  color: #5B21B6;
  margin-bottom: 0.5rem;
}

.hint-text {
  color: #666;
  font-size: 0.9rem;
}

.hands-container {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-bottom: 2rem;
}

.hand h5 {
  text-align: center;
  color: #5B21B6;
  margin-bottom: 1rem;
}

.fingers-row {
  display: flex;
  gap: 0.5rem;
}

.finger-slot {
  width: 60px;
  height: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 2px solid #E5E7EB;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
}

.finger-slot:hover {
  border-color: #8B5CF6;
  background: rgba(139, 92, 246, 0.1);
}

.finger-slot.collected {
  border-color: #10B981;
  background: rgba(16, 185, 129, 0.1);
}

.finger-slot.active {
  border-color: #8B5CF6;
  background: rgba(139, 92, 246, 0.2);
  transform: scale(1.05);
}

.finger-label {
  font-size: 0.75rem;
  color: #666;
}

.progress-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
}

.progress-bar {
  flex: 1;
}

.progress-text {
  color: #5B21B6;
  font-weight: 600;
  min-width: 80px;
}

.camera-section {
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}

@media (max-width: 600px) {
  .hands-container {
    flex-direction: column;
    gap: 1.5rem;
  }

  .finger-slot {
    width: 50px;
    height: 70px;
  }
}
</style>
