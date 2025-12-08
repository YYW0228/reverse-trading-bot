<template>
  <div class="w-full relative z-20 -mt-6">
    <q-carousel
      v-model="slide"
      transition-prev="scale"
      transition-next="scale"
      swipeable
      animated
      padding
      height="230px"
      class="bg-transparent text-white shadow-none"
      @update:model-value="onSlideChange"
    >
      <q-carousel-slide v-for="(talent, index) in talents" :key="index" :name="index" class="column no-wrap flex-center p-0">
        <div class="glass-card w-[85%] h-full rounded-2xl p-6 relative overflow-hidden border border-white/20">
          <div class="absolute -top-10 -right-10 w-32 h-32 bg-purple-500 rounded-full blur-[50px] opacity-40 animate-pulse"></div>
          <div class="relative z-10">
            <div class="flex items-center justify-between mb-2">
              <h3 class="text-2xl font-bold font-serif">{{ talent.title }}</h3>
              <q-badge color="amber-9" text-color="black" label="TOP 5%" class="shadow-lg" />
            </div>
            <p class="text-sm text-gray-200 leading-relaxed mb-4">{{ talent.description }}</p>
            <div class="flex items-center gap-2">
              <span class="text-xs text-purple-200">潜力值</span>
              <q-linear-progress :value="talent.score" color="amber" track-color="purple-9" rounded size="8px" class="flex-1" />
              <span class="text-lg font-bold text-amber-400">{{ (talent.score * 100).toFixed(0) }}</span>
            </div>
          </div>
        </div>
      </q-carousel-slide>
    </q-carousel>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const emit = defineEmits<{ (e: 'update:active', v: number): void }>()
const slide = ref(0)

const talents = [
  { title: '空间建筑师', description: '宝宝对三维空间的感知力极强，具备未来的空间规划与艺术重构能力。', score: 0.92 },
  { title: '语言魔法师', description: '左脑语言区极度活跃，未来在演说、外交领域潜力无限。', score: 0.85 },
  { title: '逻辑炼金师', description: '抽象思维与推理能力突出，是数学与编程的好苗子。', score: 0.88 },
  { title: '情感共鸣者', description: '情绪识别力敏锐，天生的沟通与团队润滑剂。', score: 0.86 },
  { title: '探索冒险家', description: '好奇心爆棚，面对未知眼神会发光。', score: 0.83 }
]

const onSlideChange = (val: number) => {
  emit('update:active', val)
}
</script>

<style scoped>
.glass-card {
  background: rgba(30, 27, 75, 0.6);
  backdrop-filter: blur(16px);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
</style>
