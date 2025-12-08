<template>
  <div class="mx-4 p-5 rounded-2xl bg-gradient-to-r from-purple-900/80 to-indigo-900/80 border border-purple-500/30 backdrop-blur-sm">
    <div class="flex justify-between items-center mb-3">
      <span class="text-gold-gradient text-base font-bold">解锁隐藏天赋</span>
      <div class="flex items-center gap-1">
        <q-icon name="lock" color="warning" size="18px" />
        <span class="text-sm text-gray-300">{{ progress }}/{{ total }}</span>
      </div>
    </div>

    <q-linear-progress
      :value="progress / total"
      color="warning"
      track-color="purple-10"
      class="rounded-full h-3 mb-4"
    />

    <div class="flex gap-3">
      <q-btn
        outline
        class="flex-grow"
        color="white"
        @click="$emit('invite')"
      >
        <q-icon name="share" class="mr-2" />
        邀请好友助力
      </q-btn>
      <q-btn
        unelevated
        color="warning"
        text-color="dark"
        class="font-bold"
        @click="$emit('unlock')"
      >
        <q-icon name="diamond" class="mr-1" />
        立即解锁
      </q-btn>
    </div>

    <p class="text-center text-xs text-gray-400 mt-3">
      再邀请 {{ total - progress }} 位好友即可免费解锁完整报告
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  progress?: number
  total?: number
}

withDefaults(defineProps<Props>(), {
  progress: 1,
  total: 3
})

defineEmits(['invite', 'unlock'])
</script>
