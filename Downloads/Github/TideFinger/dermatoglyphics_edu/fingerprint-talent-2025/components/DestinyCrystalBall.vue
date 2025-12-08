<template>
  <div class="w-full h-[420px] relative">
    <TresCanvas clear-color="transparent" :shadows="true" alpha>
      <TresPerspectiveCamera :position="[0, 0, 5]" :fov="45" />

      <!-- 灯光系统：打出高级感 -->
      <TresAmbientLight :intensity="0.6" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="1.2" cast-shadow />
      <TresPointLight :position="[-3, -2, 3]" :intensity="2" color="#EC4899" />
      <TresPointLight :position="[3, 2, -2]" :intensity="1.5" color="#F59E0B" />

      <!-- 核心水晶球 -->
      <TresMesh ref="sphereRef" :position="[0, 0, 0]" @click="onBallClick">
        <TresIcosahedronGeometry :args="[1.6, 6]" />
        <TresMeshPhysicalMaterial
          :roughness="0.08"
          :metalness="0.15"
          :transmission="0.92"
          :thickness="2.5"
          :ior="1.5"
          :clearcoat="1"
          color="#ffffff"
          :emissive="emissiveColor"
          :emissive-intensity="emissiveIntensity"
        />
      </TresMesh>

      <!-- 内部能量粒子 -->
      <TresPoints>
        <TresSphereGeometry :args="[1.3, 24, 24]" />
        <TresPointsMaterial
          color="#F59E0B"
          :size="0.04"
          :size-attenuation="true"
          :transparent="true"
          :opacity="0.8"
        />
      </TresPoints>

      <!-- 外部光环 -->
      <TresMesh :rotation="[Math.PI / 2, 0, 0]">
        <TresTorusGeometry :args="[2.2, 0.02, 16, 100]" />
        <TresMeshBasicMaterial color="#8B5CF6" :transparent="true" :opacity="0.4" />
      </TresMesh>

      <OrbitControls
        :enable-zoom="false"
        :auto-rotate="true"
        :auto-rotate-speed="1.8"
        :enable-pan="false"
        :enable-damping="true"
        :damping-factor="0.05"
      />
    </TresCanvas>

    <!-- 引导提示 -->
    <div class="absolute bottom-6 left-0 right-0 text-center pointer-events-none">
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm">
        <q-icon name="360" size="16px" color="white" />
        <span class="text-xs text-white/70">拖拽旋转查看</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { OrbitControls } from '@tresjs/cientos'

interface Props {
  dominantTrait?: string
}

const props = withDefaults(defineProps<Props>(), {
  dominantTrait: 'leader'
})

const sphereRef = ref<any>(null)
const isGlowing = ref(false)

// 根据主导特质决定发光颜色
const emissiveColor = computed(() => {
  const colorMap: Record<string, string> = {
    leader: '#6D28D9',
    creative: '#EC4899',
    logic: '#3B82F6',
    social: '#F59E0B',
    nature: '#10B981'
  }
  return colorMap[props.dominantTrait] || '#6D28D9'
})

const emissiveIntensity = computed(() => isGlowing.value ? 0.8 : 0.25)

// 点击发光效果
const onBallClick = () => {
  if (navigator.vibrate) navigator.vibrate(30)
  isGlowing.value = true
  setTimeout(() => {
    isGlowing.value = false
  }, 400)
}

// 截图方法暴露
const getSnapshot = (): string | null => {
  try {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement
    return canvas?.toDataURL('image/png', 0.9) || null
  } catch {
    return null
  }
}

defineExpose({ getSnapshot })
</script>
