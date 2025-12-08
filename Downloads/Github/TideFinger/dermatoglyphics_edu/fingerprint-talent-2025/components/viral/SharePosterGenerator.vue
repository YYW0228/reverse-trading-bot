<template>
  <div>
    <!-- 隐藏绘图 DOM -->
    <div class="fixed left-[9999px] top-0 z-[-1]" aria-hidden="true">
      <div ref="posterRef" class="w-[375px] h-[667px] bg-gradient-to-b from-[#1a0b2e] to-[#2E0249] relative overflow-hidden flex flex-col items-center text-white font-sans">
        <div class="absolute inset-0" style="background-image:url('/assets/noise.png');opacity:.2;mix-blend:overlay"></div>
        <div class="absolute -top-20 -left-20 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-40"></div>
        <div class="absolute top-40 -right-20 w-64 h-64 bg-amber-500 rounded-full blur-[80px] opacity-30"></div>

        <div class="mt-12 text-center z-10">
          <p class="text-xs tracking-[0.3em] text-white/50 mb-2">GENIUS CODE REPORT</p>
          <h2 class="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 to-yellow-500">{{ userName }} · {{ headline }}</h2>
        </div>

        <div class="w-64 h-64 my-6 relative flex items-center justify-center">
          <div class="w-full h-full rounded-full border border-white/10 bg-white/5 backdrop-blur-md flex items-center justify-center overflow-hidden">
            <img v-if="innerSnapshot" :src="innerSnapshot" class="w-full h-full object-cover"/>
            <div v-else class="text-4xl">🧬</div>
          </div>
          <div class="absolute top-0 text-xs font-bold text-amber-400">创造力 TOP 1%</div>
        </div>

        <div class="px-8 text-center space-y-4 z-10">
          <div class="p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/5">
            <p class="text-lg font-serif leading-relaxed">"{{ highlightText }}"</p>
          </div>
          <div class="flex justify-around text-xs text-white/60">
            <span class="flex flex-col items-center"><strong class="text-lg text-white block">{{ scores.e }}</strong> 外向性</span>
            <span class="flex flex-col items-center"><strong class="text-lg text-white block">{{ scores.o }}</strong> 开放性</span>
            <span class="flex flex-col items-center"><strong class="text-lg text-white block">{{ scores.c }}</strong> 尽责性</span>
          </div>
        </div>

        <div class="mt-auto mb-8 flex items-center space-x-4 bg-black/20 p-3 rounded-lg backdrop-blur">
          <div class="w-16 h-16 bg-white p-1 rounded">
            <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://your-saas.com" class="w-full h-full" />
          </div>
          <div class="text-left">
            <p class="text-sm font-bold text-amber-400">长按识别测试</p>
            <p class="text-[10px] text-white/60">解锁你家孩子的隐藏天赋</p>
          </div>
        </div>
      </div>
    </div>

    <q-dialog v-model="showDialog" position="bottom">
      <div class="bg-white rounded-t-3xl p-6 flex flex-col items-center w-full">
        <h3 class="text-gray-900 font-bold text-lg mb-4">长按保存海报分享</h3>
        <div class="w-64 h-[400px] shadow-2xl rounded-xl overflow-hidden mb-6 relative">
          <q-spinner v-if="loading" color="primary" size="3em" class="absolute inset-0 m-auto" />
          <img v-if="posterUrl" :src="posterUrl" class="w-full h-full object-contain" />
        </div>
        <p class="text-xs text-gray-500 text-center mb-4">已邀请 <span class="text-purple-600 font-bold">2</span> 位好友，再邀 1 人免费解锁</p>
        <q-btn label="保存图片" color="black" class="w-full rounded-full py-3 font-bold shadow-lg" @click="downloadImage" />
      </div>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import html2canvas from 'html2canvas'

const props = defineProps<{ userName: string; headline?: string; highlightText: string; scores: any; snapshotUrl?: string }>()

const showDialog = ref(false)
const posterRef = ref<HTMLElement | null>(null)
const posterUrl = ref('')
const loading = ref(true)
const innerSnapshot = ref<string | undefined>(undefined)

const generate = async (snapshotUrl?: string) => {
  // 注入 3D 截图
  innerSnapshot.value = snapshotUrl || props.snapshotUrl
  showDialog.value = true
  loading.value = true
  await nextTick()
  setTimeout(async () => {
    if (posterRef.value) {
      try {
        const canvas = await html2canvas(posterRef.value, { useCORS: true, scale: 2, backgroundColor: null })
        posterUrl.value = canvas.toDataURL('image/png')
      } catch (e) {
        console.error('Poster gen failed', e)
      } finally {
        loading.value = false
      }
    }
  }, 400)
}

const downloadImage = () => {
  const link = document.createElement('a')
  link.download = `天赋报告-${props.userName}.png`
  link.href = posterUrl.value
  link.click()
}

defineExpose({ generate, showDialog })
</script>
