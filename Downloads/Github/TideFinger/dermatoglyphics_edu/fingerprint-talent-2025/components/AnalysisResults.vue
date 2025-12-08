<template>
  <q-card class="analysis-results" style="min-width: 400px; max-width: 600px;">
    <q-card-section class="results-header">
      <div class="success-icon">
        <q-icon name="celebration" size="64px" color="positive" />
      </div>
      <h4>分析完成！</h4>
      <p>您孩子的天赋分析报告已生成</p>
    </q-card-section>

    <q-card-section v-if="analysis" class="results-summary">
      <!-- 主导原型 -->
      <div class="archetype-preview">
        <div class="archetype-emoji">{{ getArchetypeEmoji(analysis.archetypeType) }}</div>
        <div class="archetype-info">
          <h5>{{ getArchetypeName(analysis.archetypeType) }}</h5>
          <p>{{ getArchetypeDescription(analysis.archetypeType) }}</p>
        </div>
      </div>

      <!-- 五维评分预览 -->
      <div class="scores-preview">
        <h6>五维人格评分</h6>
        <div class="score-bars">
          <div v-for="(score, trait) in analysis.oceanScores" :key="trait" class="score-bar">
            <span class="trait-name">{{ getTraitName(trait) }}</span>
            <q-linear-progress
              :value="score / 100"
              color="purple"
              rounded
              size="8px"
              class="trait-progress"
            />
            <span class="trait-score">{{ score }}</span>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions align="center" class="results-actions">
      <q-btn
        flat
        color="grey"
        label="稍后查看"
        @click="$emit('close')"
        no-caps
      />
      <q-btn
        color="purple"
        label="查看完整报告"
        icon="description"
        @click="viewReport"
        no-caps
      />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
interface Analysis {
  id: string
  archetypeType: string
  oceanScores: Record<string, number>
}

const props = defineProps<{
  analysis: Analysis | null
}>()

const emit = defineEmits(['close', 'view-report'])

const archetypeMap: Record<string, { emoji: string; name: string; desc: string }> = {
  eagle: { emoji: '🦅', name: '鹰型·完美主义者', desc: '目标导向，追求卓越' },
  wolf: { emoji: '🐺', name: '狼型·战略家', desc: '善于合作，具备领导力' },
  water: { emoji: '💧', name: '水型·适应者', desc: '情感丰富，善解人意' },
  monkey: { emoji: '🐒', name: '猴型·创新者', desc: '思维活跃，富有创意' },
  earth: { emoji: '🌍', name: '地型·积累者', desc: '稳重踏实，善于学习' },
  volcano: { emoji: '🌋', name: '火山型·艺术家', desc: '情感强烈，创造力丰富' },
  cocktail: { emoji: '🍹', name: '鸡尾酒型·融合者', desc: '多元发展，适应性强' }
}

const traitMap: Record<string, string> = {
  openness: '开放性',
  conscientiousness: '尽责性',
  extraversion: '外向性',
  agreeableness: '宜人性',
  neuroticism: '情绪稳定性'
}

const getArchetypeEmoji = (type: string) => archetypeMap[type]?.emoji || '🦅'
const getArchetypeName = (type: string) => archetypeMap[type]?.name || '鹰型'
const getArchetypeDescription = (type: string) => archetypeMap[type]?.desc || ''
const getTraitName = (trait: string) => traitMap[trait] || trait

const viewReport = () => {
  if (props.analysis) {
    emit('view-report', props.analysis.id)
  }
}
</script>

<style scoped>
.analysis-results {
  border-radius: 20px;
}

.results-header {
  text-align: center;
  padding-bottom: 0;
}

.success-icon {
  margin-bottom: 1rem;
}

.results-header h4 {
  color: #10B981;
  margin-bottom: 0.5rem;
}

.results-header p {
  color: #666;
}

.results-summary {
  padding-top: 0;
}

.archetype-preview {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: linear-gradient(135deg, #F3E8FF 0%, #E9D5FF 100%);
  padding: 1rem;
  border-radius: 15px;
  margin-bottom: 1.5rem;
}

.archetype-emoji {
  font-size: 3rem;
}

.archetype-info h5 {
  color: #5B21B6;
  margin-bottom: 0.25rem;
}

.archetype-info p {
  color: #666;
  font-size: 0.9rem;
  margin: 0;
}

.scores-preview h6 {
  color: #5B21B6;
  margin-bottom: 1rem;
}

.score-bars {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.score-bar {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.trait-name {
  width: 80px;
  font-size: 0.85rem;
  color: #666;
}

.trait-progress {
  flex: 1;
}

.trait-score {
  width: 30px;
  text-align: right;
  font-weight: 600;
  color: #5B21B6;
}

.results-actions {
  padding-top: 1rem;
}
</style>
