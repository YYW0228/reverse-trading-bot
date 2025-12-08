<template>
  <div class="px-4 pb-6">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <q-icon name="auto_awesome" color="warning" size="24px" />
        <span class="text-lg font-bold text-white">天赋基因图谱</span>
      </div>
      <span class="text-xs text-purple-300 bg-purple-900/50 px-3 py-1 rounded-full">
        {{ unlockedCount }}/{{ talents.length }} 已解锁
      </span>
    </div>

    <div class="overflow-x-auto pb-2 -mx-4 px-4" style="scrollbar-width: none;">
      <div class="flex gap-4" style="width: max-content;">
        <div
          v-for="(talent, index) in talents"
          :key="index"
          class="talent-card glass-card w-36 h-52 p-4 flex flex-col justify-between cursor-pointer relative"
          :class="{ 'opacity-60 grayscale': talent.locked }"
          @click="onCardClick(talent, index)"
        >
          <!-- 锁定遮罩 -->
          <div v-if="talent.locked" class="absolute inset-0 flex items-center justify-center bg-black/40 rounded-[20px] z-10">
            <q-icon name="lock" size="32px" color="warning" />
          </div>

          <!-- 图标 -->
          <div class="text-4xl">{{ talent.icon }}</div>

          <!-- 信息 -->
          <div>
            <div class="text-xs text-purple-300 uppercase tracking-wider mb-1">{{ talent.type }}</div>
            <div class="text-base font-bold text-white leading-tight">{{ talent.name }}</div>
          </div>

          <!-- 进度条 -->
          <div class="space-y-1">
            <div class="flex justify-between text-xs">
              <span class="text-gray-400">潜力值</span>
              <span class="text-gold-gradient font-bold">{{ talent.score }}%</span>
            </div>
            <div class="h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div
                class="h-full rounded-full transition-all duration-500"
                :class="talent.locked ? 'bg-gray-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'"
                :style="{ width: talent.score + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useQuasar } from 'quasar'

interface Talent {
  name: string
  type: string
  score: number
  icon: string
  locked: boolean
  description?: string
}

const $q = useQuasar()

const talents = ref<Talent[]>([
  { name: '逻辑领袖', type: 'Logic', score: 96, icon: '🧠', locked: false, description: '您的孩子拥有超越同龄人的逻辑推理能力，未来适合从事战略规划、数据分析等领域。' },
  { name: '艺术感知', type: 'Art', score: 88, icon: '🎨', locked: false, description: '天生的美学敏感度，对色彩和形状有独特的理解，是未来的设计师或艺术家。' },
  { name: '语言天赋', type: 'Verbal', score: 82, icon: '🗣️', locked: true, description: '解锁查看完整语言天赋分析...' },
  { name: '共情能力', type: 'EQ', score: 95, icon: '❤️', locked: true, description: '解锁查看完整情商分析...' },
  { name: '空间思维', type: 'Space', score: 79, icon: '🚀', locked: true, description: '解锁查看完整空间智能分析...' },
])

const unlockedCount = computed(() => talents.value.filter(t => !t.locked).length)

const emit = defineEmits(['unlock-request'])

const onCardClick = (talent: Talent, index: number) => {
  if (talent.locked) {
    $q.dialog({
      title: '🔒 深度解读已锁定',
      message: `<div class="text-center">
        <p class="text-lg mb-4">"${talent.name}"的完整分析需要解锁</p>
        <p class="text-gray-400 text-sm">邀请2位好友即可免费解锁，或直接购买完整报告</p>
      </div>`,
      html: true,
      cancel: { label: '邀请好友', flat: true, color: 'grey' },
      ok: { label: '立即解锁 ¥29.9', color: 'warning' },
      persistent: true
    }).onOk(() => {
      emit('unlock-request')
    })
    return
  }

  // 显示已解锁内容
  $q.dialog({
    title: `${talent.icon} ${talent.name}`,
    message: `<div class="space-y-3">
      <div class="flex items-center gap-2">
        <span class="text-gold-gradient text-2xl font-bold">${talent.score}%</span>
        <span class="text-gray-400">潜力指数</span>
      </div>
      <p class="text-gray-300">${talent.description}</p>
    </div>`,
    html: true,
    ok: { label: '了解', flat: true }
  })
}
</script>
