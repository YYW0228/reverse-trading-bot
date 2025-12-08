<template>
  <div class="w-full h-[50vh] relative z-10" ref="containerRef">
    <img v-if="showFallback" src="/assets/fallback-radar.svg" class="absolute inset-0 w-full h-full object-contain" />
    <TresCanvas v-else alpha :pixel-ratio="2">
      <TresPerspectiveCamera :position="[0, 0, 5]" :fov="45" />
      <OrbitControls :enable-zoom="false" :auto-rotate="true" :auto-rotate-speed="1.5" :enable-damping="true" />

      <!-- 影棚光照环境 -->
      <TresAmbientLight :intensity="0.7" />
      <TresSpotLight :position="[10, 10, 10]" :intensity="2" :penumbra="1" />
      <TresPointLight :position="[-10, -5, -5]" :intensity="2" color="#a855f7" />
      <TresPointLight :position="[5, -5, 5]" :intensity="1" color="#f59e0b" />

      <!-- 液态琉璃性格球 -->
      <TresMesh ref="blobRef" @click="handleTouch">
        <TresIcosahedronGeometry :args="[1.5, 6]" />
        <TresMeshPhysicalMaterial
          :color="dominantColor"
          :roughness="0.15"
          :metalness="0.1"
          :transmission="0.9"
          :thickness="2.0"
          :ior="1.5"
          :clearcoat="1.0"
          :attenuation-color="dominantColor"
          :attenuation-distance="0.5"
        />
      </TresMesh>

      <!-- 装饰粒子（轻量） -->
      <primitive v-if="points" :object="points" />
    </TresCanvas>

    <div class="absolute bottom-4 w-full text-center pointer-events-none animate-pulse">
      <span class="text-white/40 text-[10px] tracking-[0.3em] uppercase">Touch to Resonate</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRenderLoop, useTresContext } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import { createNoise3D } from 'simplex-noise'
import { usePerformance } from '~/composables/usePerformance'

const props = defineProps<{ traits: { o: number; c: number; e: number; a: number; n: number } }>()

const containerRef = ref<HTMLElement | null>(null)
const blobRef = ref<any>(null)
const points = ref<THREE.Points | null>(null)

const { renderer, scene, camera } = useTresContext()
const { isLowEnd } = usePerformance()
const showFallback = ref(false)

const noise3D = createNoise3D()

// 主色调：按最高维度切换
const dominantColor = computed(() => {
  const { o, c, e, a, n } = props.traits
  const max = Math.max(o, c, e, a, n)
  if (max === o) return '#3b82f6'
  if (max === c) return '#10b981'
  if (max === e) return '#f59e0b'
  if (max === a) return '#ec4899'
  return '#8b5cf6'
})

// 轻量粒子
onMounted(() => {
  // 极低端机直接降级静态图
  // @ts-ignore
  if (isLowEnd || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4)) {
    showFallback.value = true
    return
  }
  const geo = new THREE.BufferGeometry()
  const COUNT = 300
  const arr = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i++) {
    arr[i * 3 + 0] = (Math.random() - 0.5) * 10
    arr[i * 3 + 1] = (Math.random() - 0.5) * 10
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  geo.setAttribute('position', new THREE.BufferAttribute(arr, 3))
  const mat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.03, transparent: true, opacity: 0.4, sizeAttenuation: true })
  points.value = new THREE.Points(geo, mat)
})

// 顶点形变：根据 OCEAN 与噪声呼吸
const { onLoop } = useRenderLoop()
onLoop(({ elapsed }) => {
  if (!blobRef.value) return
  const mesh: any = blobRef.value
  const geometry = mesh.geometry as THREE.BufferGeometry
  const pos = geometry.attributes.position as THREE.BufferAttribute
  const v = new THREE.Vector3()

  const { o, c, e, a, n } = props.traits

  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i)
    // 归一化到球面
    v.normalize().multiplyScalar(1.5)

    // base noise 呼吸
    const t = elapsed * 0.6
    const noise = noise3D(v.x + t, v.y + t, v.z + t) * 0.15

    // 维度影响（方向性形变）
    const eMorph = Math.abs(v.x) * e * 0.35 * Math.sin(t + 1)
    const oMorph = Math.abs(v.y) * o * 0.35 * Math.cos(t + 2)
    const aMorph = Math.abs(v.z) * a * 0.2 * Math.sin(t * 0.8 + 0.5)
    const cSmooth = 1 + c * 0.1 // 尽责性让球更“紧致”

    // 神经质：增加表面起伏的频率与幅度
    const nMorph = n * noise * 2

    const scale = cSmooth + noise + (eMorph + oMorph + aMorph) * 0.3 + nMorph * 0.1
    v.multiplyScalar(scale)

    pos.setXYZ(i, v.x, v.y, v.z)
  }
  geometry.computeVertexNormals()
  pos.needsUpdate = true
})

const handleTouch = () => {
  if (!blobRef.value) return
  const s = blobRef.value.scale
  s.setScalar(1.2)
  setTimeout(() => s.setScalar(1), 200)
}

// 对外暴露截图方法
// 监听 WebGL 上下文丢失
onMounted(() => {
  try {
    const el = renderer?.value?.domElement as HTMLCanvasElement | undefined
    if (el) {
      el.addEventListener('webglcontextlost', (e) => {
        e.preventDefault()
        showFallback.value = true
      }, { passive: false })
    }
  } catch {}
})

const getSnapshot = (): string | null => {
  try {
    if (renderer?.value && scene?.value && camera?.value) {
      renderer.value.render(scene.value, camera.value)
      const el = renderer.value.domElement as HTMLCanvasElement
      return el?.toDataURL('image/png', 0.9) || null
    }
  } catch (e) {
    return null
  }
  return null
}

defineExpose({ getSnapshot })
</script>
