<template>
  <div class="smart-camera-container">
    <!-- 拍照预览区域 -->
    <div class="camera-preview-area">
      <video
        ref="videoRef"
        class="camera-preview"
        :class="{ 'capturing': isCapturing }"
        autoplay
        muted
        playsinline
      />

      <!-- AR指纹引导叠加层 -->
      <div class="guide-overlay" v-if="showGuide">
        <svg class="finger-guide" viewBox="0 0 300 400">
          <!-- 手指轮廓 -->
          <ellipse
            cx="150"
            cy="200"
            rx="60"
            ry="120"
            fill="none"
            stroke="#8B5CF6"
            stroke-width="3"
            stroke-dasharray="10,5"
            :class="{ 'guide-pulse': !fingerDetected }"
          />

          <!-- 中心十字线 -->
          <line x1="150" y1="80" x2="150" y2="320" stroke="#C084FC" stroke-width="2" opacity="0.6"/>
          <line x1="90" y1="200" x2="210" y2="200" stroke="#C084FC" stroke-width="2" opacity="0.6"/>

          <!-- 指纹中心点 -->
          <circle
            cx="150"
            cy="200"
            r="8"
            fill="#F472B6"
            :class="{ 'center-pulse': fingerDetected }"
          />
        </svg>

        <!-- 实时提示文字 -->
        <div class="guide-tips" :class="`tip-${tipLevel}`">
          <q-icon :name="tipIcon" size="24px" />
          <span>{{ guideTip }}</span>
        </div>
      </div>

      <!-- 质量检测指示器 -->
      <div class="quality-indicator" v-if="qualityScore > 0">
        <q-circular-progress
          :value="qualityScore"
          size="80px"
          :thickness="0.15"
          :color="qualityColor"
          track-color="transparent"
          class="quality-circle"
        />
        <div class="quality-text">
          <div class="quality-score">{{ Math.round(qualityScore) }}%</div>
          <div class="quality-label">{{ qualityText }}</div>
        </div>
      </div>
    </div>

    <!-- 控制按钮区域 -->
    <div class="camera-controls">
      <!-- 拍照按钮 -->
      <q-btn
        @click="capturePhoto"
        :disable="!fingerDetected || qualityScore < 60"
        :loading="isCapturing"
        size="xl"
        round
        :color="fingerDetected && qualityScore >= 60 ? 'positive' : 'grey'"
        :icon="isCapturing ? '' : 'camera_alt'"
        class="capture-btn"
      >
        <q-inner-loading :showing="isCapturing">
          <q-spinner-gears size="50px" color="white" />
        </q-inner-loading>
      </q-btn>

      <!-- 辅助按钮 -->
      <div class="aux-controls">
        <q-btn
          @click="switchCamera"
          icon="flip_camera_ios"
          round
          color="blue"
          size="md"
        />
        <q-btn
          @click="toggleGuide"
          :icon="showGuide ? 'visibility_off' : 'visibility'"
          round
          color="purple"
          size="md"
        />
        <q-btn
          @click="toggleFlash"
          :icon="flashOn ? 'flash_on' : 'flash_off'"
          round
          :color="flashOn ? 'orange' : 'grey'"
          size="md"
        />
      </div>
    </div>

    <!-- 拍摄统计 -->
    <div class="capture-stats" v-if="captureCount > 0">
      <q-chip color="purple" text-color="white" icon="photo_camera">
        已拍摄 {{ captureCount }} 张
      </q-chip>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, nextTick } from 'vue'

// Props & Emits
interface Props {
  fingerType?: 'thumb' | 'index' | 'middle' | 'ring' | 'pinky'
  hand?: 'left' | 'right'
  autoCapture?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  fingerType: 'index',
  hand: 'right',
  autoCapture: false
})

const emit = defineEmits<{
  captured: [imageData: string, quality: number]
  error: [message: string]
}>()

// Refs
const videoRef = ref<HTMLVideoElement>()
const stream = ref<MediaStream>()

// State
const fingerDetected = ref(false)
const qualityScore = ref(0)
const isCapturing = ref(false)
const showGuide = ref(true)
const flashOn = ref(false)
const captureCount = ref(0)
const currentTip = ref('')

// MediaPipe 手部检测相关
const handsDetector = ref<any>()

// 计算属性
const qualityColor = computed(() => {
  if (qualityScore.value >= 80) return 'positive'
  if (qualityScore.value >= 60) return 'warning'
  return 'negative'
})

const qualityText = computed(() => {
  if (qualityScore.value >= 80) return '优秀'
  if (qualityScore.value >= 60) return '良好'
  if (qualityScore.value >= 40) return '一般'
  return '较差'
})

const tipLevel = computed(() => {
  if (qualityScore.value >= 60 && fingerDetected.value) return 'success'
  if (qualityScore.value >= 40) return 'warning'
  return 'error'
})

const tipIcon = computed(() => {
  if (fingerDetected.value && qualityScore.value >= 60) return 'check_circle'
  if (fingerDetected.value) return 'warning'
  return 'info'
})

const guideTip = computed(() => {
  if (!fingerDetected.value) {
    return '请将手指放在引导框内'
  }
  if (qualityScore.value < 40) {
    return '请保持手指稳定，避免抖动'
  }
  if (qualityScore.value < 60) {
    return '调整光线或手指位置以提高质量'
  }
  if (qualityScore.value >= 80) {
    return '完美！点击拍照按钮'
  }
  return '质量良好，可以拍照'
})

// 初始化摄像头
async function initCamera() {
  try {
    const constraints = {
      video: {
        facingMode: 'user',
        width: { ideal: 1280 },
        height: { ideal: 720 }
      }
    }

    stream.value = await navigator.mediaDevices.getUserMedia(constraints)

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await nextTick()

      // 初始化MediaPipe手部检测
      await initHandDetection()
    }
  } catch (error) {
    console.error('Camera initialization failed:', error)
    emit('error', '摄像头初始化失败，请检查权限设置')
  }
}

// 初始化手部检测
async function initHandDetection() {
  try {
    // 这里应该集成 MediaPipe Hands
    // 简化版本：模拟检测逻辑
    startDetectionLoop()
  } catch (error) {
    console.error('Hand detection initialization failed:', error)
  }
}

// 检测循环
function startDetectionLoop() {
  const detectFrame = () => {
    if (videoRef.value && stream.value) {
      // 模拟手部检测和质量评估
      simulateDetection()

      if (!isCapturing.value) {
        requestAnimationFrame(detectFrame)
      }
    }
  }
  detectFrame()
}

// 模拟检测（实际项目中应使用MediaPipe）
function simulateDetection() {
  // 模拟手指检测
  fingerDetected.value = Math.random() > 0.3

  // 模拟质量评分
  if (fingerDetected.value) {
    const baseScore = Math.random() * 40 + 40 // 40-80 基础分
    const bonus = Math.random() * 20 // 0-20 奖励分
    qualityScore.value = Math.min(100, baseScore + bonus)
  } else {
    qualityScore.value = Math.max(0, qualityScore.value - 5)
  }

  // 自动拍照逻辑
  if (props.autoCapture && fingerDetected.value && qualityScore.value >= 80) {
    setTimeout(() => {
      if (qualityScore.value >= 80) {
        capturePhoto()
      }
    }, 1000)
  }
}

// 拍照功能
async function capturePhoto() {
  if (isCapturing.value || !fingerDetected.value) return

  isCapturing.value = true

  try {
    if (!videoRef.value) throw new Error('Video element not found')

    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    canvas.width = videoRef.value.videoWidth
    canvas.height = videoRef.value.videoHeight

    ctx?.drawImage(videoRef.value, 0, 0)

    const imageData = canvas.toDataURL('image/jpeg', 0.9)
    const currentQuality = qualityScore.value

    captureCount.value++

    // 添加拍照动画效果
    await new Promise(resolve => setTimeout(resolve, 500))

    emit('captured', imageData, currentQuality)

  } catch (error) {
    console.error('Capture failed:', error)
    emit('error', '拍照失败，请重试')
  } finally {
    isCapturing.value = false
  }
}

// 切换摄像头
async function switchCamera() {
  // 实现前后摄像头切换逻辑
  console.log('Switch camera')
}

// 切换引导显示
function toggleGuide() {
  showGuide.value = !showGuide.value
}

// 切换闪光灯
function toggleFlash() {
  flashOn.value = !flashOn.value
  // 实际实现闪光灯功能
}

// 清理资源
function cleanup() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
  }
}

// 生命周期
onMounted(() => {
  initCamera()
})

onUnmounted(() => {
  cleanup()
})
</script>

<style scoped>
.smart-camera-container {
  position: relative;
  width: 100%;
  max-width: 400px;
  margin: 0 auto;
  border-radius: 20px;
  overflow: hidden;
  background: linear-gradient(145deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.camera-preview-area {
  position: relative;
  width: 100%;
  aspect-ratio: 3/4;
  background: #000;
  border-radius: 20px 20px 0 0;
  overflow: hidden;
}

.camera-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
}

.camera-preview.capturing {
  transform: scale(1.05);
  filter: brightness(1.2);
}

.guide-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
}

.finger-guide {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200px;
  height: 260px;
}

.guide-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.center-pulse {
  animation: centerPulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
}

@keyframes centerPulse {
  0%, 100% { opacity: 0.8; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.guide-tips {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 12px 20px;
  border-radius: 25px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 500;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.tip-success {
  background: rgba(76, 175, 80, 0.9);
}

.tip-warning {
  background: rgba(255, 152, 0, 0.9);
}

.tip-error {
  background: rgba(244, 67, 54, 0.9);
}

.quality-indicator {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.quality-text {
  position: absolute;
  text-align: center;
  color: white;
  font-weight: bold;
}

.quality-score {
  font-size: 16px;
  line-height: 1;
}

.quality-label {
  font-size: 10px;
  opacity: 0.8;
}

.camera-controls {
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
}

.capture-btn {
  width: 80px;
  height: 80px;
  font-size: 32px;
  transition: all 0.3s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.capture-btn:hover {
  transform: scale(1.05);
}

.aux-controls {
  display: flex;
  gap: 12px;
}

.capture-stats {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

/* 响应式设计 */
@media (max-width: 480px) {
  .smart-camera-container {
    max-width: 100%;
    margin: 0;
    border-radius: 0;
  }

  .camera-preview-area {
    border-radius: 0;
  }

  .finger-guide {
    width: 150px;
    height: 200px;
  }

  .guide-tips {
    font-size: 12px;
    padding: 8px 16px;
  }
}
</style>
