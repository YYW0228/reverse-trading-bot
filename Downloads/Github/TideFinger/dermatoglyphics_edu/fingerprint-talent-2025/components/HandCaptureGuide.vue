<template>
  <div class="relative w-full h-full flex flex-col items-center justify-center px-6">
    <!-- 拍照区域 -->
    <div class="relative w-72 h-72 rounded-3xl overflow-hidden scan-container breathing-glow">
      <!-- 模拟摄像头画面 -->
      <video
        ref="videoRef"
        autoplay
        playsinline
        muted
        class="w-full h-full object-cover"
      ></video>

      <!-- AR 扫描线 -->
      <div v-if="isScanning" class="absolute inset-0 scan-line pointer-events-none"></div>

      <!-- 引导手型遮罩 -->
      <div class="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none">
        <q-icon name="back_hand" size="140px" color="white" />
      </div>

      <!-- 状态提示 -->
      <div class="absolute bottom-0 left-0 right-0 text-center pb-4 bg-gradient-to-t from-black/60 to-transparent pt-8">
        <p class="text-white font-bold text-sm drop-shadow-lg">{{ statusText }}</p>
      </div>
    </div>

    <!-- 说明文字 -->
    <div class="mt-8 text-center">
      <h2 class="text-2xl font-bold text-white mb-2">采集宝宝掌纹能量</h2>
      <p class="text-purple-200 text-sm opacity-80">请确保光线充足，AI正在准备...</p>
    </div>

    <!-- 开始按钮 -->
    <q-btn
      rounded
      size="xl"
      class="mt-8 px-12 py-4 bg-gradient-to-r from-purple-600 via-pink-500 to-purple-600 shadow-2xl"
      @click="startScan"
      :loading="isScanning"
      :disable="!cameraReady"
    >
      <span class="text-lg font-bold text-white">{{ isScanning ? '分析中...' : '开始分析' }}</span>
      <template v-slot:loading>
        <q-spinner-dots class="on-left" color="white" size="24px" />
        <span class="text-lg font-bold">计算中...</span>
      </template>
    </q-btn>

    <!-- 社交证明 -->
    <div class="mt-6 text-center">
      <p class="text-xs text-gray-400">
        已有 <span class="text-gold-gradient">1,203,402</span> 位妈妈生成了报告
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const router = useRouter()
const videoRef = ref<HTMLVideoElement>()
const isScanning = ref(false)
const cameraReady = ref(false)
const statusText = ref('对准手掌区域')

let stream: MediaStream | null = null

onMounted(async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: 720, height: 720 }
    })
    if (videoRef.value) {
      videoRef.value.srcObject = stream
      cameraReady.value = true
    }
  } catch (e) {
    statusText.value = '请允许相机权限'
    cameraReady.value = true // 允许继续（模拟模式）
  }
})

onUnmounted(() => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop())
  }
})

const startScan = () => {
  if (isScanning.value) return

  isScanning.value = true
  statusText.value = '正在提取生物特征...'

  // 震动反馈
  if (navigator.vibrate) navigator.vibrate(50)

  setTimeout(() => {
    statusText.value = '匹配全球天才库...'
  }, 1200)

  setTimeout(() => {
    statusText.value = 'AI 正在解码天赋密码...'
    if (navigator.vibrate) navigator.vibrate([50, 30, 50])
  }, 2000)

  // 跳转结果页
  setTimeout(() => {
    if (navigator.vibrate) navigator.vibrate([100, 50, 100])
    const randomId = Math.random().toString(36).substring(7)
    router.push(`/result/${randomId}`)
  }, 3000)
}
</script>
