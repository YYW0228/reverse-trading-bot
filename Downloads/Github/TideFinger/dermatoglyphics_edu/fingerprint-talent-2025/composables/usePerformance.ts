export const usePerformance = () => {
  const isLowEnd = (() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      if (!gl) return true
      const dbg: any = gl.getExtension('WEBGL_debug_renderer_info')
      const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : ''
      if (/Adreno\s(3|4|5)\d|Mali\s-T|Mali\s-4|PowerVR/i.test(renderer)) return true
      if (/iPhone OS 1[0-3]/.test(navigator.userAgent)) return true
      return false
    } catch {
      return true
    }
  })()
  return { isLowEnd }
}
