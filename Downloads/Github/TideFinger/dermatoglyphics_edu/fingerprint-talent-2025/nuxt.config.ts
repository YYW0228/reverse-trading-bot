// nuxt.config.ts - 造神模式配置
// 目标：25-45岁中国妈妈的「降维打击」式体验
export default defineNuxtConfig({
  ssr: false, // PWA 强客户端体验，关掉 SSR 减少冷启动
  devtools: { enabled: false },

  // CSS配置 - 皇家紫+鎏金
  css: [
    '@quasar/extras/material-icons/material-icons.css',
    '@quasar/extras/material-symbols-rounded/material-symbols-rounded.css',
    'quasar/src/css/index.sass',
    '~/assets/css/main.scss'
  ],

  // 核心模块
  modules: [
    '@pinia/nuxt',
    '@vite-pwa/nuxt',
    '@tresjs/nuxt',
    '@nuxtjs/tailwindcss',
    '@vueuse/motion/nuxt'
  ],

  // Quasar配置 - 造神配色
  build: {
    transpile: ['quasar', 'gsap']
  },

  // PWA配置 - 原生App体验
  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      name: '天赋指纹·AI儿童天赋分析',
      short_name: '天赋指纹',
      description: '3秒拍照，AI解码孩子隐藏天赋',
      theme_color: '#0F172A',
      background_color: '#0F172A',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
        { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
      ]
    },
    workbox: {
      cleanupOutdatedCaches: true,
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      maximumFileSizeToCacheInBytes: 5 * 1024 * 1024 // 5MB
    }
  },

  // 运行时配置
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:8000'
    }
  },

  // App配置 - iOS优化
  app: {
    head: {
      title: 'AI 儿童天赋指纹分析',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' }
      ]
    }
  },

  // TresJS 3D性能优化
  tres: {
    devtools: false
  },

  // Vite配置
  vite: {
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['three', 'gsap', 'simplex-noise']
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: ''
        }
      }
    }
  }
})
