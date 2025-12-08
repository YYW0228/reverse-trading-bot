<template>
  <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-40">
    <transition name="slide-up">
      <div v-if="visible" class="px-3 py-2 rounded-full bg-black/70 backdrop-blur text-[11px] text-amber-200 border border-amber-500/30 shadow-lg flex items-center gap-2">
        <q-icon name="bolt" size="14px" color="amber" />
        <span>{{ current }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const msgs = [
  '上海的李妈妈刚刚解锁了【光之领袖】',
  '北京的张妈妈刚刚解锁了【深海哲人】',
  '杭州的王妈妈刚刚解锁了【星际造梦师】',
  '深圳的赵妈妈刚刚解锁了【治愈天使】',
  '成都的周妈妈刚刚解锁了【理性王者】',
  '南京的孙妈妈刚刚解锁了【引力中心】',
  '广州的吴妈妈刚刚解锁了【定海神针】',
  '苏州的郑妈妈刚刚解锁了【高感雷达】',
  '武汉的冯妈妈刚刚解锁了【现实筑基者】',
  '西安的朱妈妈刚刚解锁了【灵动游侠】'
]

const visible = ref(false)
const current = ref('')
let timer: any

const play = () => {
  const pick = msgs[Math.floor(Math.random() * msgs.length)]
  current.value = pick
  visible.value = true
  setTimeout(() => { visible.value = false }, 2500)
}

onMounted(() => {
  timer = setInterval(() => {
    play()
  }, 5000 + Math.floor(Math.random() * 3000))
})

onBeforeUnmount(() => clearInterval(timer))
</script>

<style scoped>
.slide-up-enter-active, .slide-up-leave-active { transition: transform .35s ease, opacity .35s ease }
.slide-up-enter-from, .slide-up-leave-to { transform: translateY(8px); opacity: 0 }
</style>
