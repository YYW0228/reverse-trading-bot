<template>
  <div class="w-full relative z-20 -mt-6">
    <q-carousel v-model="slide" transition-prev="scale" transition-next="scale" swipeable animated padding height="230px" class="bg-transparent text-white shadow-none">
      <q-carousel-slide v-for="(card, index) in cards" :key="index" :name="index" class="column no-wrap flex-center p-0">
        <div class="talent-card glass-card w-[85%] h-full rounded-2xl p-6 relative overflow-hidden border border-white/20">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-40 animate-pulse"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-bold font-serif">{{ card.title }}</h3>
              <q-badge color="amber-9" text-color="black" :label="`TOP ${Math.max(100 - (card.score || 90), 1)}%`" class="shadow-lg" />
            </div>
            <div class="relative">
              <div :class="{ 'blur-md grayscale opacity-60': isLocked(index) }">
                <p class="text-sm text-gray-200 leading-relaxed mb-4">{{ card.desc }}</p>
                <div class="flex items-center gap-2">
                  <span class="text-xs text-purple-200">潜力值</span>
                  <q-linear-progress :value="(card.score || 90) / 100" color="amber" track-color="purple-9" rounded size="8px" class="flex-1" />
                  <span class="text-lg font-bold text-amber-400">{{ (card.score || 90) }}</span>
                </div>
              </div>
              <div v-if="isLocked(index)" class="absolute inset-0 flex items-center justify-center"
                   @click.stop="emit('unlock')">
                <div class="bg-black/40 backdrop-blur-md rounded-full p-4 border border-amber-400/50">
                  <q-icon name="lock" color="amber" size="32px" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = withDefaults(defineProps<{
  cards: Array<{ title: string; score?: number; desc?: string; isLocked?: boolean; hooks?: string[] }>
  lockFrom?: number
}>(), { lockFrom: 2 })

const emit = defineEmits<{ (e: 'trigger-unlock'): void }>()
const slide = ref(0)

const isLocked = (index: number) => props.cards[index]?.isLocked ?? (index >= (props.lockFrom ?? 2))

// 简单倒计时（职业卡专用视觉压迫）
const countdown = ref(15 * 60) // 15:00
let timer: any
onMounted(() => {
  timer = setInterval(() => {
    if (countdown.value > 0) countdown.value--
  }, 1000)
})

const fmt = (s: number) => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`
</script>

<style scoped>
.glass-card { background: rgba(30, 27, 75, 0.6); backdrop-filter: blur(16px); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37); }
</style>
