<template>
  <div class="relative w-full h-screen overflow-hidden bg-black">
    <!-- 1. 摄像头画面 -->
    <video
      ref="videoRef"
      autoplay
      playsinline
      muted
      class="absolute inset-0 w-full h-full object-cover opacity-60 transition-opacity duration-1000"
      :class="{ 'opacity-20': isLocked }"
    />

    <!-- 2. 扫描氛围层 -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute inset-0 bg-[url('/grid.png')] opacity-10 mix-blend-overlay"></div>
      <div
        class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-700 ease-out"
        :class="isLocked ? 'w-[280px] h-[380px] scale-100' : 'w-[320px] h-[420px] scale-105 opacity-80'"
      >
        <svg viewBox="0 0 300 400" class="w-full h-full drop-shadow-[0_0_20px_rgba(192,132,252,0.6)]">
          <path
            d="M20,100 Q20,20 100,20 T280,100 V300 Q280,380 200,380 T20,300 Z"
            fill="none"
            :stroke="isLocked ? '#FBBF24' : '#C084FC'"
            :stroke-width="isLocked ? 4 : 2"
            class="transition-colors duration-500"
          />
        </svg>
        <div v-if="!isLocked" class="scan-line absolute w-full h-4 bg-gradient-to-b from-purple-500/50 to-transparent top-0 blur-sm" />
        <div v-if="isLocked" class="absolute inset-0 flex items-center justify-center">
          <div class="w-20 h-20 bg-amber-400 rounded-full blur-[40px] animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- 3. 状态文案 -->
    <div class="absolute bottom-40 w-full text-center z-20 px-6">
      <h3
        class="text-2xl font-serif tracking-widest transition-all duration-500"
        :class="isLocked ? 'text-amber-300 scale-110' : 'text-purple-100'"
      >
        {{ statusText }}
      </h3>
      <p class="text-xs text-gray-400 mt-2 font-mono uppercase tracking-[0.2em]">
        {{ isLocked ? 'AI ANALYZING BIOMETRICS...' : 'WAITING FOR HAND...' }}
      </p>
    </div>

    <!-- 4. 进度环 -->
    <div class="absolute bottom-12 w-full flex justify-center z-20">
      <div class="relative w-24 h-24 flex items-center justify-center">
        <q-circular-progress
          :value="scanProgress"
          size="90px"
          :thickness="0.1"
          color="amber-4"
          track-color="purple-9"
          class="q-ma-md"
          show-value
        >
          <q-icon v-if="isLocked" name="fingerprint" color="amber-4" size="40px" class="animate-pulse" />
          <q-icon v-else name="back_hand" color="purple-3" size="30px" />
        </q-circular-progress>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { FilesetResolver, GestureRecognizer, type GestureRecognizerResult } from '@mediapipe/tasks-vision'
import gsap from 'gsap'

const emit = defineEmits<{ (e: 'complete'): void }>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isLocked = ref(false)
const scanProgress = ref(0)
const statusText = ref('请将小手放入框内')

let gestureRecognizer: GestureRecognizer | null = null
let animationFrameId = 0
let lastVideoTime = -1

// 1) 初始化 AI 引擎
const initAI = async () => {
  statusText.value = '正在启动神经引擎...'
  const vision = await FilesetResolver.forVisionTasks(
    'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm'
  )
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task',
      delegate: 'GPU'
    },
    runningMode: 'VIDEO',
    numHands: 1
  })
  startCamera()
}

// 2) 启动摄像头
const startCamera = async () => {
  if (!navigator.mediaDevices?.getUserMedia) return
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 1280 } },
      audio: false
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      videoRef.value.addEventListener('loadeddata', predictWebcam)
    }
  } catch (err) {
    statusText.value = '摄像头权限被拒绝'
  }
}

// 3) 检测循环
const predictWebcam = async () => {
  if (!gestureRecognizer || !videoRef.value) return
  if (videoRef.value.currentTime !== lastVideoTime) {
    lastVideoTime = videoRef.value.currentTime
    const results: GestureRecognizerResult = gestureRecognizer.recognizeForVideo(videoRef.value, Date.now())
    if (results.gestures?.length && !isLocked.value) {
      const confidence = results.gestures[0][0].score
      if (confidence > 0.6) {
        lockTarget()
      }
    }
  }
  if (!isLocked.value) {
    animationFrameId = requestAnimationFrame(predictWebcam)
  }
}

// 4) 锁定与进度
const lockTarget = () => {
  isLocked.value = true
  statusText.value = '正在读取天赋密码...'
  if (navigator.vibrate) navigator.vibrate([100, 50, 100])

  let progress = 0
  const timer = setInterval(() => {
    progress += 2
    scanProgress.value = Math.min(progress, 100)
    if (Math.random() > 0.7) progress += 5
    if (progress >= 100) {
      clearInterval(timer)
      statusText.value = '分析完成'
      setTimeout(() => emit('complete'), 500)
    }
  }, 30)
}

onMounted(() => {
  initAI()
  gsap.to('.scan-line', { top: '100%', duration: 2, repeat: -1, yoyo: true, ease: 'linear' })
})

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId)
  const stream = videoRef.value?.srcObject as MediaStream | null
  if (stream) stream.getTracks().forEach(t => t.stop())
})
</script>
