// composables/useCamera.ts - 相机控制逻辑
export const useCamera = () => {
  // 响应式状态
  const stream = ref<MediaStream | null>(null)
  const videoElement = ref<HTMLVideoElement | null>(null)
  const isInitialized = ref(false)
  const isCapturing = ref(false)
  const facingMode = ref<'user' | 'environment'>('user')
  const supportedConstraints = ref<any>({})

  // 错误状态
  const error = ref<string | null>(null)

  // 相机约束配置
  const getConstraints = () => ({
    video: {
      facingMode: facingMode.value,
      width: { ideal: 1280, min: 640 },
      height: { ideal: 720, min: 480 },
      frameRate: { ideal: 30, min: 15 }
    },
    audio: false
  })

  // 初始化相机
  const initCamera = async (videoRef?: HTMLVideoElement) => {
    try {
      error.value = null

      // 检查浏览器支持
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('浏览器不支持相机访问')
      }

      // 获取支持的约束
      supportedConstraints.value = navigator.mediaDevices.getSupportedConstraints()

      // 请求相机权限
      const constraints = getConstraints()
      stream.value = await navigator.mediaDevices.getUserMedia(constraints)

      // 绑定到video元素
      if (videoRef) {
        videoElement.value = videoRef
        videoRef.srcObject = stream.value

        // 等待视频加载
        await new Promise<void>((resolve, reject) => {
          videoRef.onloadedmetadata = () => resolve()
          videoRef.onerror = () => reject(new Error('视频加载失败'))
          setTimeout(() => reject(new Error('视频加载超时')), 10000)
        })
      }

      isInitialized.value = true
      console.log('相机初始化成功')

    } catch (err: any) {
      error.value = err.message || '相机初始化失败'
      console.error('相机初始化失败:', err)
      throw err
    }
  }

  // 切换前后摄像头
  const switchCamera = async () => {
    if (!isInitialized.value) return

    try {
      facingMode.value = facingMode.value === 'user' ? 'environment' : 'user'

      // 停止当前流
      if (stream.value) {
        stream.value.getTracks().forEach(track => track.stop())
      }

      // 重新初始化
      if (videoElement.value) {
        await initCamera(videoElement.value)
      }

    } catch (err: any) {
      error.value = '切换相机失败: ' + err.message
      console.error('切换相机失败:', err)
    }
  }

  // 拍照
  const capturePhoto = async (quality: number = 0.9): Promise<string> => {
    if (!videoElement.value || !isInitialized.value) {
      throw new Error('相机未初始化')
    }

    isCapturing.value = true

    try {
      const video = videoElement.value
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      if (!ctx) {
        throw new Error('无法创建canvas上下文')
      }

      // 设置canvas尺寸
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // 绘制当前视频帧
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // 转换为base64
      const imageData = canvas.toDataURL('image/jpeg', quality)

      // 添加拍照效果
      await simulateShutter()

      return imageData

    } finally {
      isCapturing.value = false
    }
  }

  // 模拟拍照效果
  const simulateShutter = async () => {
    if (!videoElement.value) return

    // 白色闪光效果
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      opacity: 0.8;
      pointer-events: none;
      z-index: 9999;
    `

    const videoContainer = videoElement.value.parentElement
    if (videoContainer) {
      videoContainer.style.position = 'relative'
      videoContainer.appendChild(overlay)

      // 动画效果
      setTimeout(() => {
        overlay.style.opacity = '0'
        setTimeout(() => {
          videoContainer.removeChild(overlay)
        }, 200)
      }, 100)
    }
  }

  // 获取相机信息
  const getCameraInfo = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = devices.filter(device => device.kind === 'videoinput')

      return {
        deviceCount: videoDevices.length,
        devices: videoDevices.map(device => ({
          deviceId: device.deviceId,
          label: device.label || `相机 ${videoDevices.indexOf(device) + 1}`,
          groupId: device.groupId
        })),
        supportedConstraints: supportedConstraints.value
      }
    } catch (err) {
      console.error('获取相机信息失败:', err)
      return null
    }
  }

  // 设置视频约束
  const updateConstraints = async (newConstraints: any) => {
    if (!stream.value) return

    try {
      const videoTrack = stream.value.getVideoTracks()[0]
      if (videoTrack) {
        await videoTrack.applyConstraints(newConstraints)
      }
    } catch (err) {
      console.error('更新约束失败:', err)
    }
  }

  // 获取当前视频尺寸
  const getVideoSize = () => {
    if (!videoElement.value) return { width: 0, height: 0 }

    return {
      width: videoElement.value.videoWidth,
      height: videoElement.value.videoHeight
    }
  }

  // 清理资源
  const cleanup = () => {
    if (stream.value) {
      stream.value.getTracks().forEach(track => track.stop())
      stream.value = null
    }

    if (videoElement.value) {
      videoElement.value.srcObject = null
      videoElement.value = null
    }

    isInitialized.value = false
    error.value = null
  }

  // 检查权限状态
  const checkPermissions = async () => {
    try {
      const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
      return permission.state // 'granted', 'denied', 'prompt'
    } catch (err) {
      console.warn('无法检查相机权限:', err)
      return 'unknown'
    }
  }

  // 生命周期清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    // 状态
    stream: readonly(stream),
    videoElement,
    isInitialized: readonly(isInitialized),
    isCapturing: readonly(isCapturing),
    facingMode: readonly(facingMode),
    error: readonly(error),

    // 方法
    initCamera,
    switchCamera,
    capturePhoto,
    getCameraInfo,
    updateConstraints,
    getVideoSize,
    checkPermissions,
    cleanup,

    // 工具方法
    getConstraints
  }
}
