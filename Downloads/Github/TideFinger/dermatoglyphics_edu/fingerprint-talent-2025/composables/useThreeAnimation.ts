import { onMounted, onBeforeUnmount } from 'vue'

export function useThreeAnimation(toggle: () => void) {
  let io: IntersectionObserver | null = null
  const targetId = 'three-viewport-anchor'

  onMounted(() => {
    const el = document.getElementById(targetId)
    if (!el) return
    io = new IntersectionObserver((entries) => {
      const e = entries[0]
      if (!e) return
      if (e.isIntersecting) {
        toggle()
      } else {
        toggle()
      }
    }, { threshold: 0.01 })
    io.observe(el)
  })

  onBeforeUnmount(() => {
    if (io) io.disconnect()
  })
}
