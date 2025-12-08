<template>
  <div class="min-h-screen flex flex-col relative overflow-hidden">
    <!-- 顶部 Logo -->
    <div class="pt-12 px-6 text-center z-10 safe-area-top">
      <h1 class="text-3xl font-bold text-white mb-1">天赋指纹</h1>
      <p class="text-purple-200 text-sm opacity-80">哈佛多元智能理论 × AI 视觉分析</p>
    </div>

    <!-- 中间拍照区 -->
    <div class="flex-grow flex items-center justify-center z-10">
      <HandCaptureGuide />
    </div>

    <!-- 底部科学背书 -->
    <div class="pb-8 px-6 text-center z-10 safe-area-bottom">
      <div class="flex items-center justify-center gap-4 mb-4">
        <div class="flex items-center gap-1 text-xs text-gray-400">
          <q-icon name="verified" size="14px" color="green" />
          <span>500+论文支撑</span>
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-400">
          <q-icon name="psychology" size="14px" color="blue" />
          <span>AI深度学习</span>
        </div>
        <div class="flex items-center gap-1 text-xs text-gray-400">
          <q-icon name="shield" size="14px" color="purple" />
          <span>隐私保护</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: '天赋指纹 - AI儿童天赋分析',
  meta: [
    { name: 'description', content: '3秒拍照，AI解码孩子隐藏天赋。基于哈佛多元智能理论，已服务100万+家庭。' }
  ]
})
</script>
