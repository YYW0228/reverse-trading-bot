<template>
  <div class="bg-black h-screen w-full relative">
    <!-- AR 组件 -->
    <transition name="fade">
      <HandCaptureGuide v-if="!showTransition" @complete="startTransition" />
    </transition>

    <!-- 降临过渡层 -->
    <div v-if="showTransition" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-black">
      <client-only>
        <component :is="Vue3Lottie"
          animationLink="https://assets2.lottiefiles.com/packages/lf20_w51pcehl.json"
          :height="300"
          :width="300"
          :loop="false"
          :speed="1.2"
          @onComplete="goToReport"
        />
      </client-only>
      <p class="text-purple-200 font-serif animate-pulse mt-8 tracking-widest">
        正在连接天赋宇宙...
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { defineAsyncComponent } from 'vue'
const Vue3Lottie = defineAsyncComponent(() => import('vue3-lottie').then(m => m.Vue3Lottie))
import HandCaptureGuide from '~/components/ar/HandCaptureGuide.vue'

const router = useRouter()
const showTransition = ref(false)

import { useReportStore } from '~/stores/report'
const store = useReportStore()

const startTransition = () => {
  // 生成“确定性伪随机”报告数据
  store.generateReport()
  showTransition.value = true
  if (navigator.vibrate) navigator.vibrate(200)
}

const goToReport = () => {
  router.push('/report')
}
</script>

<style>
.fade-leave-active { transition: opacity 1s ease; }
.fade-leave-to { opacity: 0; }
</style>
