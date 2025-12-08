<template>
  <canvas ref="canvas" class="particle-canvas"></canvas>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue'

const canvas = ref<HTMLCanvasElement | null>(null)
let ctx: CanvasRenderingContext2D | null = null
let particles: { x: number; y: number; vx: number; vy: number; r: number }[] = []
let raf = 0

const resize = () => {
  if (!canvas.value) return
  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  canvas.value.width = Math.floor(window.innerWidth * dpr)
  canvas.value.height = Math.floor(window.innerHeight * dpr)
  canvas.value.style.width = window.innerWidth + 'px'
  canvas.value.style.height = window.innerHeight + 'px'
  ctx = canvas.value.getContext('2d')
}

const init = () => {
  particles = []
  const count = Math.min(120, Math.floor((window.innerWidth * window.innerHeight) / 12000))
  for (let i = 0; i < count; i++) {
    particles.push({
      x: Math.random() * (canvas.value!.width),
      y: Math.random() * (canvas.value!.height),
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      r: Math.random() * 1.5 + 0.3
    })
  }
}

const render = () => {
  if (!ctx || !canvas.value) return
  ctx.clearRect(0, 0, canvas.value.width, canvas.value.height)
  for (const p of particles) {
    p.x += p.vx
    p.y += p.vy
    if (p.x < 0 || p.x > canvas.value.width) p.vx *= -1
    if (p.y < 0 || p.y > canvas.value.height) p.vy *= -1

    const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6)
    g.addColorStop(0, 'rgba(168,85,247,0.9)')
    g.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.fillStyle = g
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2)
    ctx.fill()
  }
  raf = requestAnimationFrame(render)
}

onMounted(() => {
  resize()
  init()
  render()
  window.addEventListener('resize', () => {
    resize()
    init()
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(raf)
  window.removeEventListener('resize', () => {})
})
</script>

<style scoped>
.particle-canvas {
  position: fixed;
  inset: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  pointer-events: none;
  opacity: 0.35;
}
</style>
