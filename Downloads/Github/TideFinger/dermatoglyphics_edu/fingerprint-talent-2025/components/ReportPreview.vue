<template>
  <div class="report-preview">
    <q-card class="report-card">
      <q-card-section class="report-header">
        <div class="report-title">
          <q-icon name="psychology" size="32px" color="purple" />
          <h3>个性化天赋分析报告</h3>
        </div>
        <p class="report-subtitle">基于AI皮纹学分析 · 专属定制</p>
      </q-card-section>

      <q-card-section class="report-content">
        <!-- 主要类型展示 -->
        <div class="primary-type">
          <h4>主导人格类型</h4>
          <div class="type-display">
            <div class="type-icon">🦅</div>
            <div class="type-info">
              <div class="type-name">鹰型·完美主义者</div>
              <div class="type-desc">目标导向，追求完美，独立思考</div>
            </div>
          </div>
        </div>

        <!-- 五维雷达图 -->
        <div class="radar-section">
          <h4>五维人格分析</h4>
          <PersonalityRadar3D
            :ocean-scores="scores"
            class="mini-radar"
          />
        </div>

        <!-- 关键特质 -->
        <div class="key-traits">
          <h4>核心特质解读</h4>
          <div class="traits-list">
            <q-chip
              v-for="trait in keyTraits"
              :key="trait.name"
              :color="trait.color"
              text-color="white"
              :icon="trait.icon"
            >
              {{ trait.name }}
            </q-chip>
          </div>
        </div>

        <!-- 教育建议预览 -->
        <div class="education-tips">
          <h4>教育指导要点</h4>
          <ul class="tips-list">
            <li v-for="tip in educationTips" :key="tip">
              <q-icon name="lightbulb" color="orange" />
              {{ tip }}
            </li>
          </ul>
        </div>
      </q-card-section>

      <q-card-actions class="report-actions">
        <q-btn
          color="purple"
          label="获取完整报告"
          icon="download"
          @click="getFullReport"
        />
        <q-btn
          flat
          color="grey"
          label="了解更多"
          @click="learnMore"
        />
      </q-card-actions>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import PersonalityRadar3D from './PersonalityRadar3D.vue'

interface Props {
  scores: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
}

const props = defineProps<Props>()

const keyTraits = computed(() => [
  { name: '完美主义', color: 'purple', icon: 'star' },
  { name: '目标导向', color: 'blue', icon: 'flag' },
  { name: '独立思考', color: 'green', icon: 'psychology' },
  { name: '责任感强', color: 'orange', icon: 'verified' }
])

const educationTips = computed(() => [
  '给予明确的目标和期望',
  '尊重孩子的独立思考空间',
  '提供有挑战性的任务',
  '避免过度干预和催促'
])

function getFullReport() {
  // 跳转到付费页面
}

function learnMore() {
  // 显示更多信息
}
</script>

<style scoped>
.report-preview {
  max-width: 600px;
  margin: 0 auto;
}

.report-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
}

.report-header {
  text-align: center;
  background: linear-gradient(135deg, #8B5CF6, #A855F7);
  color: white;
  border-radius: 20px 20px 0 0;
}

.report-title {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 8px;
}

.report-title h3 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
}

.report-subtitle {
  margin: 0;
  opacity: 0.9;
  font-size: 0.9rem;
}

.report-content > div {
  margin-bottom: 2rem;
}

.report-content h4 {
  font-size: 1.2rem;
  color: #5B21B6;
  margin-bottom: 1rem;
  font-weight: 600;
}

.primary-type .type-display {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #F3E8FF, #E9D5FF);
  border-radius: 15px;
  border: 2px solid #A855F7;
}

.type-icon {
  font-size: 3rem;
}

.type-name {
  font-size: 1.3rem;
  font-weight: 600;
  color: #5B21B6;
  margin-bottom: 4px;
}

.type-desc {
  color: #6B7280;
  font-size: 0.95rem;
}

.mini-radar {
  height: 250px;
}

.traits-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tips-list {
  list-style: none;
  padding: 0;
}

.tips-list li {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #E5E7EB;
}

.tips-list li:last-child {
  border-bottom: none;
}

.report-actions {
  justify-content: center;
  gap: 16px;
  padding: 24px;
}
</style>
