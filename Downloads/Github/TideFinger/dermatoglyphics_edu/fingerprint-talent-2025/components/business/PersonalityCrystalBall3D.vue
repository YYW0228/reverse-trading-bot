<template>
  <div class="w-full h-[420px] relative z-10">
    <TresCanvas clear-color="#000000" alpha>
      <TresPerspectiveCamera :position="[0, 0, 5]" :fov="45" />
      <OrbitControls :enable-zoom="false" :auto-rotate="true" :auto-rotate-speed="1.6" />

      <!-- 光照 -->
      <TresAmbientLight :intensity="0.55" />
      <TresDirectionalLight :position="[5, 5, 5]" :intensity="2" color="#ffffff" />
      <TresPointLight :position="[-5, -5, 5]" :intensity="4" color="#a855f7" />

      <!-- 水晶球 -->
      <TresMesh ref="crystalBall">
        <TresSphereGeometry :args="[1.5, 64, 64]" />
        <TresMeshPhysicalMaterial color="#ffffff" :transmission="1" :opacity="1" :metalness="0" :roughness="0" :ior="1.7" :thickness="2" :clearcoat="1" />
      </TresMesh>

      <!-- 内核：多面体 (代替五芒星占位) -->
      <TresMesh ref="starCore">
        <TresIcosahedronGeometry :args="[0.85, 0]" />
        <TresMeshStandardMaterial ref="starMat" color="#ffd700" :emissive="emissive" :emissive-intensity="2" wireframe />
      </TresMesh>

      <!-- 假阴影地面（性能友好） -->
      <TresMesh :position="[0, -1.7, 0]" :rotation="[-Math.PI/2, 0, 0]">
        <TresCircleGeometry :args="[2.2, 32]" />
        <TresMeshBasicMaterial :color="'#000'" :opacity="0.35" transparent />
      </TresMesh>
    </TresCanvas>
  </div>
</template>

<script setup lang="ts">
import { shallowRef, watch, computed } from 'vue'
import { useRenderLoop } from '@tresjs/core'
import { OrbitControls } from '@tresjs/cientos'
import * as THREE from 'three'
import gsap from 'gsap'

const props = defineProps<{ activeTalentIndex: number }>()

const crystalBall = shallowRef<any>(null)
const starCore = shallowRef<any>(null)

const palette = ['#ff6b6b', '#61e294', '#4dabf7', '#f7e26b', '#69dbd1']
const emissive = computed(() => new THREE.Color('#ffaa00'))

watch(() => props.activeTalentIndex, (i) => {
  if (!starCore.value) return
  const c = new THREE.Color(palette[i % palette.length])
  const mat: any = starCore.value.material
  gsap.to(mat.color, { r: c.r, g: c.g, b: c.b, duration: 0.5 })
  gsap.fromTo(starCore.value.scale, { x: 0.8, y: 0.8, z: 0.8 }, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3, yoyo: true, repeat: 1 })
})

const { onLoop } = useRenderLoop()
onLoop(({ elapsed }) => {
  if (crystalBall.value) {
    crystalBall.value.position.y = Math.sin(elapsed) * 0.1
  }
  if (starCore.value) {
    starCore.value.rotation.y += 0.01
  }
})
</script>
