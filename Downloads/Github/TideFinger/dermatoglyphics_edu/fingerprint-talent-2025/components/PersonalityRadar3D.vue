<template>
  <div class="radar-container">
    <!-- 3D Canvas -->
    <TresCanvas v-bind="gl" ref="canvasRef" class="radar-canvas">
      <TresPerspectiveCamera :position="[8, 8, 8]" :look-at="[0, 0, 0]" />

      <!-- 控制器 -->
      <OrbitControls
        :enable-damping="true"
        :auto-rotate="autoRotate"
        :auto-rotate-speed="0.5"
        :enable-zoom="true"
        :min-distance="5"
        :max-distance="15"
      />

      <!-- 光照设置 -->
      <TresAmbientLight :intensity="0.6" />
      <TresDirectionalLight
        :position="[10, 10, 5]"
        :intensity="1"
        cast-shadow
      />
      <TresPointLight
        :position="[0, 10, 0]"
        :intensity="0.5"
        color="#8B5CF6"
      />

      <!-- 雷达网格背景 -->
      <TresMesh>
        <TresRingGeometry :args="[0, 5, 32]" />
        <TresMeshBasicMaterial
          color="#5B21B6"
          :opacity="0.1"
          transparent
        />
      </TresMesh>

      <!-- 雷达圆环 -->
      <template v-for="i in 5" :key="'ring-' + i">
        <TresMesh rotation-x="-Math.PI / 2">
          <TresRingGeometry :args="[i, i + 0.02, 32]" />
          <TresMeshBasicMaterial
            color="#A855F7"
            :opacity="0.3"
            transparent
          />
        </TresMesh>
      </template>

      <!-- 中心连线 -->
      <template v-for="i in 5" :key="'line-' + i">
        <TresMesh>
          <TresCylinderGeometry :args="[0.02, 0.02, 5, 8]" />
          <TresMeshBasicMaterial color="#C084FC" :opacity="0.4" transparent />
          <TresMesh
            :rotation="[0, (i * 2 * Math.PI) / 5, Math.PI / 2]"
            :position="[
              2.5 * Math.cos((i * 2 * Math.PI) / 5),
              0,
              2.5 * Math.sin((i * 2 * Math.PI) / 5)
            ]"
          />
        </TresMesh>
      </template>

      <!-- 主雷达面（五边形） -->
      <TresMesh>
        <TresShapeGeometry :args="[radarShape]" />
        <TresMeshStandardMaterial
          color="#8B5CF6"
          :opacity="0.6"
          transparent
          side="DoubleSide"
          :emissive="0x441188"
          :emissive-intensity="0.2"
        />
      </TresMesh>

      <!-- 数据点球体 -->
      <template v-for="(value, i) in normalizedScores" :key="'point-' + i">
        <TresMesh :position="getPointPosition(value, i)">
          <TresSphereGeometry :args="[0.2]" />
          <TresMeshStandardMaterial
            :color="getPointColor(i)"
            :emissive="getPointColor(i)"
            :emissive-intensity="0.3"
          />

          <!-- 发光效果 -->
          <TresMesh :scale="[1.5, 1.5, 1.5]">
            <TresSphereGeometry :args="[0.15]" />
            <TresMeshBasicMaterial
              :color="getPointColor(i)"
              :opacity="0.2"
              transparent
            />
          </TresMesh>
        </TresMesh>
      </template>

      <!-- 文字标签 -->
      <template v-for="(label, i) in labels" :key="'label-' + i">
        <Text3D
          :text="label.text"
          :position="getLabelPosition(i)"
          :font-size="0.3"
          :color="label.color"
          :material-config="{ emissive: '#E9D5FF', emissiveIntensity: 0.1 }"
        />
      </template>

      <!-- 环境反射 -->
      <TresScene>
        <TresMesh>
          <TresBoxGeometry :args="[100, 100, 100]" />
          <TresMeshBasicMaterial
            color="#1a0033"
            side="BackSide"
          />
        </TresMesh>
      </TresScene>
    </TresCanvas>

    <!-- 控制面板 -->
    <div class="radar-controls">
      <q-btn-toggle
        v-model="currentView"
        :options="[
          {label: '五维', value: 'ocean'},
          {label: '七型', value: 'archetype'}
        ]"
        color="purple"
        toggle-color="white"
        toggle-text-color="purple"
        class="q-mb-md"
      />

      <div class="score-list">
        <div
          v-for="(score, key) in currentScores"
          :key="key"
          class="score-item"
          :class="{ 'score-highlight': hoveredDimension === key }"
          @mouseenter="hoveredDimension = key"
          @mouseleave="hoveredDimension = null"
        >
          <div class="score-label">{{ getDimensionLabel(key) }}</div>
          <q-linear-progress
            :value="score / 100"
            :color="getDimensionColor(key)"
            size="8px"
            rounded
            class="score-bar"
          />
          <div class="score-value">{{ score }}%</div>
        </div>
      </div>

      <div class="radar-actions q-mt-md">
        <q-btn
          @click="autoRotate = !autoRotate"
          :icon="autoRotate ? 'pause' : 'play_arrow'"
          :color="autoRotate ? 'orange' : 'green'"
          round
          size="sm"
        />
        <q-btn
          @click="resetCamera"
          icon="refresh"
          color="blue"
          round
          size="sm"
          class="q-ml-sm"
        />
        <q-btn
          @click="exportImage"
          icon="download"
          color="purple"
          round
          size="sm"
          class="q-ml-sm"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { TresCanvas } from '@tresjs/core'
import { OrbitControls, Text3D } from '@tresjs/cientos'
import { ref, computed, onMounted, watch } from 'vue'
import * as THREE from 'three'

// Props
interface Props {
  oceanScores?: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  archetypeScores?: {
    eagle: number
    wolf: number
    water: number
    monkey: number
    earth: number
    volcano: number
    cocktail: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  oceanScores: () => ({
    openness: 78,
    conscientiousness: 92,
    extraversion: 65,
    agreeableness: 88,
    neuroticism: 42
  }),
  archetypeScores: () => ({
    eagle: 85,
    wolf: 70,
    water: 60,
    monkey: 45,
    earth: 75,
    volcano: 55,
    cocktail: 40
  })
})

// Reactive state
const canvasRef = ref()
const currentView = ref('ocean')
const autoRotate = ref(true)
const hoveredDimension = ref<string | null>(null)

// GL配置
const gl = {
  alpha: true,
  antialias: true,
  shadows: true,
  physicallyCorrectLights: true,
  outputEncoding: THREE.sRGBEncoding,
  toneMapping: THREE.ACESFilmicToneMapping,
  toneMappingExposure: 1.2
}

// 计算属性
const currentScores = computed(() => {
  return currentView.value === 'ocean' ? props.oceanScores : props.archetypeScores
})

const normalizedScores = computed(() => {
  const scores = Object.values(currentScores.value)
  return scores.map(score => score / 100)
})

const labels = computed(() => {
  if (currentView.value === 'ocean') {
    return [
      { text: '开放性 O', color: '#FF6B9D' },
      { text: '尽责性 C', color: '#4ECDC4' },
      { text: '外向性 E', color: '#45B7D1' },
      { text: '宜人性 A', color: '#96CEB4' },
      { text: '神经质 N', color: '#FFEAA7' }
    ]
  } else {
    return [
      { text: '鹰型', color: '#FF6B9D' },
      { text: '狼型', color: '#4ECDC4' },
      { text: '水型', color: '#45B7D1' },
      { text: '猴型', color: '#96CEB4' },
      { text: '地型', color: '#FFEAA7' }
    ].slice(0, 5) // 只显示前5个
  }
})

const radarShape = computed(() => {
  const shape = new THREE.Shape()
  const scores = normalizedScores.value

  scores.slice(0, 5).forEach((value, i) => {
    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
    const x = value * 4 * Math.cos(angle)
    const y = value * 4 * Math.sin(angle)

    if (i === 0) shape.moveTo(x, y)
    else shape.lineTo(x, y)
  })

  shape.closePath()
  return shape
})

// 方法
function getPointPosition(value: number, index: number) {
  const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2
  return [
    value * 4 * Math.cos(angle),
    0.3,
    value * 4 * Math.sin(angle)
  ]
}

function getLabelPosition(index: number) {
  const angle = (index * 2 * Math.PI) / 5 - Math.PI / 2
  return [
    5.5 * Math.cos(angle),
    0.5,
    5.5 * Math.sin(angle)
  ]
}

function getPointColor(index: number) {
  const colors = ['#FF6B9D', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7']
  return colors[index % colors.length]
}

function getDimensionLabel(key: string) {
  const labelMap = {
    openness: '开放性',
    conscientiousness: '尽责性',
    extraversion: '外向性',
    agreeableness: '宜人性',
    neuroticism: '神经质',
    eagle: '鹰型·完美主义',
    wolf: '狼型·战略家',
    water: '水型·适应者',
    monkey: '猴型·创新者',
    earth: '地型·积累者',
    volcano: '火山型·艺术家',
    cocktail: '鸡尾酒·融合型'
  }
  return labelMap[key] || key
}

function getDimensionColor(key: string) {
  const colorMap = {
    openness: 'pink-5',
    conscientiousness: 'teal-5',
    extraversion: 'blue-5',
    agreeableness: 'green-5',
    neuroticism: 'yellow-5',
    eagle: 'purple-7',
    wolf: 'indigo-6',
    water: 'blue-4',
    monkey: 'orange-5',
    earth: 'brown-5',
    volcano: 'red-5',
    cocktail: 'pink-4'
  }
  return colorMap[key] || 'grey-5'
}

function resetCamera() {
  // 重置相机位置的逻辑
  console.log('Reset camera position')
}

function exportImage() {
  // 导出图像的逻辑
  if (canvasRef.value) {
    const canvas = canvasRef.value.renderer.domElement
    const link = document.createElement('a')
    link.download = 'personality-radar-3d.png'
    link.href = canvas.toDataURL()
    link.click()
  }
}

// 监听数据变化
watch(currentView, () => {
  console.log('View changed to:', currentView.value)
})

onMounted(() => {
  console.log('PersonalityRadar3D mounted')
})
</script>

<style scoped>
.radar-container {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 16px;
  overflow: hidden;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(196, 132, 252, 0.1) 100%);
  box-shadow: 0 8px 32px rgba(91, 33, 182, 0.3);
  backdrop-filter: blur(16px);
}

.radar-canvas {
  width: 100%;
  height: 100%;
}

.radar-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(16px);
  border-radius: 12px;
  padding: 16px;
  min-width: 200px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.score-list {
  max-height: 300px;
  overflow-y: auto;
}

.score-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
  transition: all 0.3s ease;
  border-radius: 8px;
  padding: 8px 12px;
  margin: 4px 0;
}

.score-item:hover,
.score-highlight {
  background: rgba(139, 92, 246, 0.2);
  transform: translateX(4px);
}

.score-label {
  min-width: 60px;
  font-size: 12px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.score-bar {
  flex: 1;
  margin: 0 8px;
}

.score-value {
  min-width: 35px;
  text-align: right;
  font-weight: 600;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.9);
}

.radar-actions {
  display: flex;
  justify-content: center;
  gap: 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .radar-container {
    height: 400px;
  }

  .radar-controls {
    position: static;
    margin-top: 16px;
    width: 100%;
  }

  .score-item {
    padding: 6px 8px;
  }

  .score-label {
    min-width: 50px;
    font-size: 11px;
  }
}
</style>
