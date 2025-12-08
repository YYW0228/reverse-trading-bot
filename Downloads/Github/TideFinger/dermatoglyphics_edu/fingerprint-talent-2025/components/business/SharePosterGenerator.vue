<template>
  <q-dialog v-model="show" maximized transition-show="slide-up" transition-hide="slide-down">
    <div class="bg-black text-white flex flex-col items-center justify-center p-4">
      <div id="poster-node" class="w-[375px] h-[667px] bg-gradient-to-b from-[#1a0b2e] to-[#000000] relative overflow-hidden flex flex-col items-center pt-10">
        <div class="absolute inset-0" style="background-image: url('/noise.png'); opacity: .1; mix-blend: overlay"></div>
        <div class="absolute top-0 w-full h-64 bg-purple-600 blur-[100px] opacity-20"></div>
        <h1 class="font-serif text-3xl text-amber-200 tracking-widest mb-2">天赋档案</h1>
        <div class="w-10 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent mb-8"></div>
        <img src="/mock-crystal.png" class="w-64 h-64 mb-6 drop-shadow-[0_0_30px_rgba(168,85,247,0.4)]" />
        <div class="text-center px-8 z-10">
          <p class="text-purple-300 text-sm mb-2">经过 AI 深度神经网络分析</p>
          <h2 class="text-4xl font-bold text-white mb-1">{{ childName }}</h2>
          <div class="inline-block border border-amber-500/50 bg-amber-500/10 px-3 py-1 rounded-full text-amber-300 text-sm mt-2">稀有度: SSR (前 1%)</div>
        </div>
        <div class="mt-auto mb-10 w-full flex items-center justify-between px-8">
          <div class="text-left">
            <p class="text-xs text-gray-400">扫码解锁</p>
            <p class="text-xs text-gray-400">宝宝隐藏天赋</p>
          </div>
          <img src="/qr-code.png" class="w-16 h-16 rounded-lg border-2 border-white/20" />
        </div>
      </div>
      <div class="mt-8 flex gap-4">
        <q-btn label="保存到相册" color="purple-8" unelevated rounded class="px-8 py-3 font-bold shadow-[0_0_20px_rgba(168,85,247,0.6)]" @click="saveImage" />
      </div>
    </div>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import html2canvas from 'html2canvas'

const props = withDefaults(defineProps<{
  modelValue: boolean
  childName?: string
}>(), { childName: '悠悠' })

const emit = defineEmits<{ (e: 'update:modelValue', v: boolean): void }>()

const show = computed({
  get: () => props.modelValue,
  set: v => emit('update:modelValue', v)
})

const childName = computed(() => props.childName || '宝宝')

const saveImage = async () => {
  const el = document.getElementById('poster-node')
  if (!el) return
  const canvas = await html2canvas(el as HTMLElement, { scale: 2, useCORS: true, backgroundColor: null })
  const link = document.createElement('a')
  link.download = `天赋档案-${childName.value}.png`
  link.href = canvas.toDataURL()
  link.click()
}
</script>
