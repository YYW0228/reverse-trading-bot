<template>
  <div class="min-h-screen bg-[#0f0c29] text-white pb-28 overflow-x-hidden relative">
    <div ref="flashRef" class="pointer-events-none fixed inset-0 z-50 opacity-0" style="background: radial-gradient(ellipse at center, rgba(255,255,255,0.9), rgba(255,215,0,0.2), transparent 70%);"></div>
    <!-- 顶部导航 -->
    <div class="sticky top-0 z-50 flex justify-between items-center p-4 bg-gradient-to-b from-black/60 to-transparent">
      <q-btn flat round icon="chevron_left" color="white" @click="$router.push('/')" />
      <div class="text-sm font-bold tracking-widest opacity-80">REPORT</div>
      <q-btn flat round icon="share" color="amber" @click="triggerShare" />
    </div>

    <!-- 1) 3D 琉璃球 -->
    <section class="relative h-[55vh]">
      <PersonalityRadarBall3D ref="ballRef" :traits="traits" />
      <div class="absolute bottom-10 left-6 z-20">
        <h1 class="text-3xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-white to-purple-200">{{ archetype }}</h1>
        <div class="flex items-center space-x-2">
          <q-badge color="amber" text-color="black" :label="rarity" />
          <span class="text-sm text-white/60">独特人格画像</span>
        </div>
      </div>
    </section>

    <!-- 2) 天赋卡片 + 付费钩子 -->
    <section class="relative z-30 -mt-8 rounded-t-[30px] bg-[#1a1635] min-h-[50vh] px-6 pt-8 pb-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
      <div class="w-12 h-1 bg-white/10 rounded-full mx-auto mb-8"></div>
      <div class="mb-6 flex items-center justify-between">
        <h2 class="text-xl font-bold">核心天赋维度</h2>
        <span class="text-xs text-amber-400 border border-amber-400/30 px-2 py-1 rounded-full">{{ store.isUnlocked ? '已解锁 5/5' : '已解锁 2/5' }}</span>
      </div>

      <TalentCardCarousel :cards="cards as any" :lock-from="store.isUnlocked ? 999 : 2" @trigger-unlock="onUnlockRequest" />

      <!-- 转化诱导区 -->
      <div class="mt-10 p-1 bg-gradient-to-r from-purple-500 via-amber-500 to-purple-500 rounded-2xl animate-gradient-x">
        <div class="bg-[#252042] rounded-xl p-6 text-center">
          <p class="text-amber-200 font-bold text-lg mb-2">解锁完整 12,000 字报告</p>
          <p class="text-white/60 text-xs mb-2">包含：职业规划建议、亲子沟通指南、潜能开发方案</p>
          <div class="text-[11px] text-white/40 mb-4">
            线下机构皮纹测试：<span class="line-through">¥1998</span> · 专家1v1：<span class="line-through">¥500/小时</span>
            <span class="text-amber-300 font-bold ml-1">AI 灵视首发特惠：¥29.9</span>
          </div>
          <q-btn
            unelevated
            rounded
            :disable="store.isUnlocked"
            color="white"
            text-color="purple-800"
            class="w-full font-bold py-3 text-lg shadow-[0_0_15px_rgba(255,255,255,0.4)]"
            :label="store.isUnlocked ? '已解锁' : '立即解锁 (¥29.9)'"
            icon-right="lock_open"
            @click="onUnlockRequest"
          />
          <p class="mt-3 text-[10px] text-white/40">限时特惠，距恢复原价还有 04:59</p>
        </div>
      </div>
    </section>

    <!-- 3) 海报裂变 -->
    <SharePosterGenerator ref="shareRef" :user-name="archetype" :headline="rarity" :highlight-text="highlight" :scores="traits" />
    <SocialTicker />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'
import PersonalityRadarBall3D from '~/components/viz/PersonalityRadarBall3D.vue'
import TalentCardCarousel from '~/components/viz/TalentCardCarousel.vue'
import SharePosterGenerator from '~/components/viral/SharePosterGenerator.vue'
import { useReportStore } from '~/stores/report'
import SocialTicker from '~/components/common/SocialTicker.vue'
import gsap from 'gsap'
import { usePayment } from '~/composables/usePayment'
import { useAnalytics } from '~/composables/useAnalytics'

const $q = useQuasar()
const store = useReportStore()

// 数据绑定
const traits = computed(() => store.traits)
const archetype = computed(() => store.analysis.archetype || '潜能觉醒者')
const rarity = computed(() => store.analysis.rarity || 'SR')
const userName = computed(() => '宝宝')
const highlight = computed(() => store.analysis.mainDesc || '天生的外交官，拥有穿透人心的共情力与艺术感知力。')
const cards = [
  { title: '人际引力', score: 96, desc: '在群体中自然成为核心，具备极强的号召力。' },
  { title: '空间思维', score: 88, desc: '对立体结构敏感，适合乐高与建筑设计。' },
  { title: '音乐感知', score: 92, desc: '对音律节奏有超越年龄的捕捉能力。' },
]

// 引用
const ballRef = ref<any>(null)
const shareRef = ref<any>(null)
const flashRef = ref<HTMLElement | null>(null)
const { payAndUnlock } = usePayment()
const { track } = useAnalytics()

onMounted(() => {
  track('result_view_time_start')
})

const playUnlockAnimation = () => {
  if (navigator.vibrate) navigator.vibrate([50,50,200])
  const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3')
  audio.volume = 0.6
  audio.play().catch(()=>{})
  const tl = gsap.timeline()
  if (flashRef.value) {
    tl.to(flashRef.value, { opacity: 1, duration: 0.18, ease: 'power2.in' })
      .to(flashRef.value, { opacity: 0, duration: 0.8, ease: 'power2.out' })
  }
  tl.to('.talent-card', { filter: 'blur(0px) grayscale(0%)', scale: 1.05, duration: 0.5, stagger: 0.08, ease: 'back.out(1.7)' }, '-=0.4')
    .to('.talent-card', { scale: 1, duration: 0.3 })
}

const triggerShare = () => {
  track('share_click')
  const shot = ballRef.value?.getSnapshot?.()
  shareRef.value?.generate(shot)
}

const onUnlockRequest = () => {
  if (store.isUnlocked) return
  $q.dialog({
    title: '立即解锁完整报告',
    message: '包含职业建议、沟通指南、发展路径等 12,000 字内容，限时 ¥29.9',
    cancel: true,
    ok: { label: '支付并解锁', color: 'primary' }
  }).onOk(async () => {
    const ok = await payAndUnlock()
    if (ok) {
      $q.notify({ type: 'positive', message: '解锁成功，已为你开放完整内容' })
      playUnlockAnimation()
    }
  })
}
</script>

<style scoped>
.animate-gradient-x { background-size: 200% 200%; animation: gradient-move 3s ease infinite; }
@keyframes gradient-move { 0% { background-position: 0% 50% } 50% { background-position: 100% 50% } 100% { background-position: 0% 50% } }
</style>
