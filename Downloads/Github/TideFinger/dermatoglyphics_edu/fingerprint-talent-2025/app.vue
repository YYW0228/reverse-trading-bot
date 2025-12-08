<template>
  <div id="q-app">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { Dark } from 'quasar'

// 页面头部配置
useHead({
  title: '天赋指纹·AI儿童人格分析',
  meta: [
    {
      name: 'description',
      content: '3秒拍照，AI解码孩子7型天赋原型，科学指导家庭教育'
    },
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
  ]
})

// 自动检测暗色模式
onMounted(() => {
  Dark.set('auto')
})
</script>

<style>
html {
  font-family: 'Inter', sans-serif;
}

#q-app {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: rgba(139, 92, 246, 0.5);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: rgba(139, 92, 246, 0.8);
}
</style>
