// composables/use3D.ts - 3D场景管理
import * as THREE from 'three'

export const use3D = () => {
  // 响应式状态
  const scene = ref<THREE.Scene | null>(null)
  const camera = ref<THREE.PerspectiveCamera | null>(null)
  const renderer = ref<THREE.WebGLRenderer | null>(null)
  const controls = ref<any>(null)
  const isInitialized = ref(false)

  // 动画状态
  const isAnimating = ref(false)
  const animationId = ref<number | null>(null)

  // 雷达图相关
  const radarMesh = ref<THREE.Mesh | null>(null)
  const dataPoints = ref<THREE.Mesh[]>([])
  const labelSprites = ref<THREE.Sprite[]>([])

  // 初始化3D场景
  const initScene = (container: HTMLElement) => {
    try {
      // 创建场景
      scene.value = new THREE.Scene()
      scene.value.background = new THREE.Color(0x0a0a0a)

      // 创建相机
      const aspect = container.clientWidth / container.clientHeight
      camera.value = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000)
      camera.value.position.set(8, 8, 8)
      camera.value.lookAt(0, 0, 0)

      // 创建渲染器
      renderer.value = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
      })
      renderer.value.setSize(container.clientWidth, container.clientHeight)
      renderer.value.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.value.shadowMap.enabled = true
      renderer.value.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.value.outputColorSpace = THREE.SRGBColorSpace
      renderer.value.toneMapping = THREE.ACESFilmicToneMapping
      renderer.value.toneMappingExposure = 1.2

      container.appendChild(renderer.value.domElement)

      // 添加灯光
      setupLighting()

      isInitialized.value = true
      console.log('3D场景初始化成功')

      return renderer.value.domElement

    } catch (error) {
      console.error('3D场景初始化失败:', error)
      throw error
    }
  }

  // 设置光照
  const setupLighting = () => {
    if (!scene.value) return

    // 环境光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.value.add(ambientLight)

    // 主光源
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    directionalLight.castShadow = true
    directionalLight.shadow.mapSize.width = 2048
    directionalLight.shadow.mapSize.height = 2048
    scene.value.add(directionalLight)

    // 点光源 (紫色调)
    const pointLight = new THREE.PointLight(0x8b5cf6, 0.5, 100)
    pointLight.position.set(0, 10, 0)
    scene.value.add(pointLight)

    // 补充光源 (温暖色调)
    const fillLight = new THREE.DirectionalLight(0xffd700, 0.3)
    fillLight.position.set(-5, 5, -5)
    scene.value.add(fillLight)
  }

  // 创建雷达图
  const createRadarChart = (data: number[], labels: string[]) => {
    if (!scene.value) return

    // 清除旧的雷达图
    clearRadarChart()

    // 创建雷达网格
    createRadarGrid()

    // 创建数据区域
    createDataArea(data)

    // 创建数据点
    createDataPoints(data)

    // 创建标签
    createLabels(labels)
  }

  // 创建雷达网格
  const createRadarGrid = () => {
    if (!scene.value) return

    const gridGroup = new THREE.Group()

    // 同心圆
    for (let i = 1; i <= 5; i++) {
      const geometry = new THREE.RingGeometry(i * 0.8, i * 0.8 + 0.02, 32)
      const material = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        opacity: 0.3,
        transparent: true
      })
      const ring = new THREE.Mesh(geometry, material)
      ring.rotation.x = -Math.PI / 2
      gridGroup.add(ring)
    }

    // 径向线
    for (let i = 0; i < 5; i++) {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const geometry = new THREE.CylinderGeometry(0.01, 0.01, 4, 8)
      const material = new THREE.MeshBasicMaterial({
        color: 0xc084fc,
        opacity: 0.4,
        transparent: true
      })
      const line = new THREE.Mesh(geometry, material)
      line.position.set(
        2 * Math.cos(angle),
        0,
        2 * Math.sin(angle)
      )
      line.rotation.z = -angle - Math.PI / 2
      gridGroup.add(line)
    }

    scene.value.add(gridGroup)
  }

  // 创建数据区域
  const createDataArea = (data: number[]) => {
    if (!scene.value) return

    // 创建五边形形状
    const shape = new THREE.Shape()
    data.forEach((value, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const radius = (value / 100) * 4
      const x = radius * Math.cos(angle)
      const y = radius * Math.sin(angle)

      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    })
    shape.closePath()

    // 创建几何体
    const geometry = new THREE.ShapeGeometry(shape)
    const material = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      opacity: 0.6,
      transparent: true,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(0x441188),
      emissiveIntensity: 0.2
    })

    radarMesh.value = new THREE.Mesh(geometry, material)
    radarMesh.value.rotation.x = -Math.PI / 2
    radarMesh.value.position.y = 0.1
    scene.value.add(radarMesh.value)
  }

  // 创建数据点
  const createDataPoints = (data: number[]) => {
    if (!scene.value) return

    dataPoints.value = []
    const colors = [0xff6b9d, 0x4ecdc4, 0x45b7d1, 0x96ceb4, 0xffeaa7]

    data.forEach((value, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const radius = (value / 100) * 4

      // 主球体
      const geometry = new THREE.SphereGeometry(0.15, 16, 16)
      const material = new THREE.MeshStandardMaterial({
        color: colors[i],
        emissive: new THREE.Color(colors[i]),
        emissiveIntensity: 0.3
      })

      const sphere = new THREE.Mesh(geometry, material)
      sphere.position.set(
        radius * Math.cos(angle),
        0.3,
        radius * Math.sin(angle)
      )

      // 发光外圈
      const glowGeometry = new THREE.SphereGeometry(0.2, 16, 16)
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: colors[i],
        opacity: 0.2,
        transparent: true
      })
      const glow = new THREE.Mesh(glowGeometry, glowMaterial)
      sphere.add(glow)

      dataPoints.value.push(sphere)
      scene.value!.add(sphere)
    })
  }

  // 创建标签
  const createLabels = (labels: string[]) => {
    if (!scene.value) return

    labelSprites.value = []

    labels.forEach((label, i) => {
      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
      const radius = 5.5

      // 创建文字贴图 (简化版本)
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = 256
      canvas.height = 64
      context.fillStyle = '#ffffff'
      context.font = '24px Arial'
      context.textAlign = 'center'
      context.fillText(label, 128, 40)

      const texture = new THREE.CanvasTexture(canvas)
      const material = new THREE.SpriteMaterial({ map: texture })
      const sprite = new THREE.Sprite(material)

      sprite.position.set(
        radius * Math.cos(angle),
        0.5,
        radius * Math.sin(angle)
      )
      sprite.scale.set(2, 0.5, 1)

      labelSprites.value.push(sprite)
      scene.value!.add(sprite)
    })
  }

  // 清除雷达图
  const clearRadarChart = () => {
    if (!scene.value) return

    // 清除网格、数据区域、数据点和标签
    const objectsToRemove: THREE.Object3D[] = []
    scene.value.traverse((child) => {
      if (child !== scene.value && child.type !== 'Light') {
        objectsToRemove.push(child)
      }
    })

    objectsToRemove.forEach((object) => {
      scene.value!.remove(object)
    })

    radarMesh.value = null
    dataPoints.value = []
    labelSprites.value = []
  }

  // 启动渲染循环
  const startAnimation = () => {
    if (!renderer.value || !scene.value || !camera.value) return

    isAnimating.value = true

    const animate = () => {
      if (!isAnimating.value) return

      animationId.value = requestAnimationFrame(animate)

      // 旋转动画
      if (radarMesh.value) {
        radarMesh.value.rotation.y += 0.005
      }

      dataPoints.value.forEach((point, i) => {
        point.rotation.y += 0.01 * (i + 1)
      })

      // 渲染
      renderer.value!.render(scene.value!, camera.value!)
    }

    animate()
  }

  // 停止动画
  const stopAnimation = () => {
    isAnimating.value = false
    if (animationId.value) {
      cancelAnimationFrame(animationId.value)
      animationId.value = null
    }
  }

  // 响应式调整
  const handleResize = (width: number, height: number) => {
    if (!camera.value || !renderer.value) return

    camera.value.aspect = width / height
    camera.value.updateProjectionMatrix()
    renderer.value.setSize(width, height)
  }

  // 清理资源
  const cleanup = () => {
    stopAnimation()

    if (renderer.value) {
      const canvas = renderer.value.domElement
      canvas.parentNode?.removeChild(canvas)
      renderer.value.dispose()
      renderer.value = null
    }

    scene.value = null
    camera.value = null
    controls.value = null
    isInitialized.value = false
  }

  // 生命周期清理
  onUnmounted(() => {
    cleanup()
  })

  return {
    // 状态
    scene: readonly(scene),
    camera: readonly(camera),
    renderer: readonly(renderer),
    isInitialized: readonly(isInitialized),
    isAnimating: readonly(isAnimating),

    // 方法
    initScene,
    createRadarChart,
    startAnimation,
    stopAnimation,
    handleResize,
    cleanup
  }
}
