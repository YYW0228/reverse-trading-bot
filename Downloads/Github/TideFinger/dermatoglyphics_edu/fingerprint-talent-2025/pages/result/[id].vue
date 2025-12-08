<template>
  <div class="min-h-screen pb-32 relative overflow-x-hidden">
    <!-- 闪光效果 -->
    <div
      ref="flashRef"
      class="pointer-events-none fixed inset-0 z-50 opacity-0"
      style="background: radial-gradient(ellipse at center, rgba(255,255,255,0.9), rgba(255,215,0,0.3), transparent 70%);"
    ></div>

    <!-- 顶部导航 -->
    <div class="fixed top-0 left-0 right-0 z-50 glass-panel safe-area-top">
      <div class="flex justify-between items-center px-4 py-3">
        <q-btn flat round icon="arrow_back" color="white" @click="$router.push('/')" />
        <span class="font-bold text-white text-sm tracking-wider">分析报告 #{{ $route.params.id }}</span>
        <q-btn flat round icon="share" color="warning" @click="onShare" />
      </div>
    </div>

    <!-- 3D 水晶球区域 -->
    <div class="pt-20 relative">
      <!-- SSR稀有度徽章 -->
      <div class="absolute top-24 right-4 z-20">
        <span class="badge-ssr text-sm">{{ rarity }} 稀有度</span>
      </div>

      <DestinyCrystalBall ref="crystalRef" :dominant-trait="dominantTrait" />
    </div>

    <!-- 主结论区 -->
    <div class="text-center px-6 -mt-4 relative z-20">
      <h1 class="text-3xl font-bold text-white mb-2 drop-shadow-lg">{{ archetype }}</h1>
      <p class="text-purple-200 text-sm leading-relaxed opacity-90">
        "{{ mainDescription }}"
      </p>
    </div>

    <!-- 天赋卡片轮播 -->
    <div class="mt-8">
      <TalentCardCarousel @unlock-request="onUnlockRequest" />
    </div>

    <!-- 裂变进度条 -->
    <div class="mt-4">
      <MagicScroll
        :progress="inviteProgress"
        :total="3"
        @invite="onInvite"
        @unlock="onUnlock"
      />
    </div>

    <!-- 深度解读预告 -->
    <div class="mx-4 mt-6 p-5 rounded-2xl bg-gradient-to-br from-purple-900/60 to-pink-900/40 border border-purple-500/20">
      <div class="flex items-start gap-4">
        <div class="text-4xl">📖</div>
        <div class="flex-grow">
          <h3 class="text-white font-bold mb-1">12,000字完整报告</h3>
          <p class="text-gray-400 text-xs mb-3">包含：职业规划路径、亲子沟通指南、学习方法建议、潜能开发方案</p>
          <div class="flex items-center gap-2">
            <span class="line-through text-gray-500 text-sm">¥299</span>
            <span class="text-gold-gradient text-xl font-bold">¥29.9</span>
            <span class="text-xs text-pink-400 bg-pink-500/20 px-2 py-0.5 rounded">限时9折</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 底部固定购买栏 -->
    <div class="fixed bottom-0 left-0 right-0 glass-panel safe-area-bottom z-40">
      <div class="flex items-center gap-3 p-4">
        <div class="flex-grow">
          <div class="text-xs text-gray-400 mb-1">限时特惠价</div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-bold text-gold-gradient">¥29.9</span>
            <span class="line-through text-gray-500 text-sm">¥299</span>
          </div>
        </div>
        <q-btn
          unelevated
          rounded
          color="warning"
          text-color="dark"
          class="px-8 py-3 font-bold text-base"
          @click="onUnlock"
        >
          <q-icon name="lock_open" class="mr-2" />
          立即解锁
        </q-btn>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useQuasar } from 'quasar'
import gsap from 'gsap'
import { useReportStore } from '~/stores/report'

const $q = useQuasar()
const route = useRoute()
const store = useReportStore()

const flashRef = ref<HTMLElement | null>(null)
const crystalRef = ref<any>(null)
const inviteProgress = ref(1)

// 生成报告数据
onMounted(() => {
  store.generateReport({ scanData: route.params.id as string })
})

// 计算属性
const archetype = computed(() => store.analysis.archetype || '天选领袖型')
const rarity = computed(() => store.analysis.rarity || 'SSR')
const dominantTrait = computed(() => 'leader')
const mainDescription = computed(() =>
  store.analysis.mainDesc || '您的孩子拥有改变世界的潜能，其掌纹显示出罕见的决策力纹路，未来有望成为行业领袖。'
)

// 分享
const onShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: `我家宝宝是${rarity.value}级${archetype.value}！`,
        text: '快来测测你家宝宝的天赋指纹，太准了！',
        url: window.location.href
      })
    } catch {}
  } else {
    $q.notify({
      message: '长按保存海报分享给好友',
      color: 'purple',
      icon: 'share'
    })
  }
}

// 邀请
const onInvite = () => {
  $q.dialog({
    title: '邀请好友助力',
    message: '分享给2位好友，即可免费解锁完整报告！',
    ok: { label: '立即分享', color: 'warning' }
  }).onOk(() => {
    onShare()
  })
}

// 解锁
const onUnlock = () => {
  $q.dialog({
    title: '解锁完整报告',
    message: `<div class="text-center space-y-4">
      <p>包含12,000字深度分析</p>
      <ul class="text-left text-sm text-gray-400 space-y-2">
        <li>✓ 5大核心天赋详细解读</li>
        <li>✓ 个性化职业规划建议</li>
        <li>✓ 亲子沟通技巧指南</li>
        <li>✓ 学习方法定制方案</li>
        <li>✓ 潜能开发行动计划</li>
      </ul>
      <div class="pt-2">
        <span class="line-through text-gray-500">¥299</span>
        <span class="text-gold-gradient text-2xl font-bold ml-2">¥29.9</span>
      </div>
    </div>`,
    html: true,
    ok: { label: '立即支付', color: 'warning' },
    cancel: { label: '再想想', flat: true }
  }).onOk(() => {
    playUnlockAnimation()
    store.unlock()
    $q.notify({
      message: '解锁成功！完整报告已生成',
      color: 'positive',
      icon: 'check_circle'
    })
  })
}

// 解锁动画
const playUnlockAnimation = () => {
  if (navigator.vibrate) navigator.vibrate([50, 50, 200])

  if (flashRef.value) {
    gsap.timeline()
      .to(flashRef.value, { opacity: 1, duration: 0.2, ease: 'power2.in' })
      .to(flashRef.value, { opacity: 0, duration: 0.8, ease: 'power2.out' })
  }
}

const onUnlockRequest = () => {
  onUnlock()
}

useHead({
  title: `${archetype.value} - 天赋指纹分析报告`
})
</script>
