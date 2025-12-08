<template>
  <div class="development-plan">
    <div class="section-header">
      <h5>个性化发展规划</h5>
      <p>基于孩子特质的阶段性成长建议</p>
    </div>

    <!-- 发展阶段时间线 -->
    <div class="timeline-section">
      <q-timeline color="purple">
        <q-timeline-entry
          v-for="phase in developmentPhases"
          :key="phase.stage"
          :title="phase.stage"
          :subtitle="phase.age"
          :icon="phase.icon"
          :color="phase.color"
        >
          <div class="phase-content">
            <p class="phase-focus">{{ phase.focus }}</p>
            <div class="phase-goals">
              <strong>关键目标：</strong>
              <ul>
                <li v-for="goal in phase.goals" :key="goal">{{ goal }}</li>
              </ul>
            </div>
            <div class="phase-activities">
              <strong>推荐活动：</strong>
              <div class="activity-chips">
                <q-chip
                  v-for="activity in phase.activities"
                  :key="activity"
                  size="sm"
                  color="purple-2"
                  text-color="purple"
                >
                  {{ activity }}
                </q-chip>
              </div>
            </div>
          </div>
        </q-timeline-entry>
      </q-timeline>
    </div>

    <!-- 能力发展雷达 -->
    <div class="abilities-section">
      <q-card class="abilities-card">
        <q-card-section>
          <h6>能力发展重点</h6>
          <div class="abilities-grid">
            <div
              v-for="ability in abilityFocus"
              :key="ability.name"
              class="ability-item"
            >
              <div class="ability-header">
                <q-icon :name="ability.icon" :color="ability.color" size="24px" />
                <span class="ability-name">{{ ability.name }}</span>
              </div>
              <q-linear-progress
                :value="ability.priority / 100"
                :color="ability.color"
                rounded
                size="8px"
                class="ability-progress"
              />
              <span class="ability-label">{{ ability.label }}</span>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 短期行动计划 -->
    <div class="action-plan-section">
      <h6>30天行动计划</h6>
      <div class="action-cards">
        <q-card
          v-for="(week, index) in weeklyPlans"
          :key="index"
          class="week-card"
        >
          <q-card-section>
            <div class="week-header">
              <q-badge :color="week.color">第{{ index + 1 }}周</q-badge>
              <span class="week-theme">{{ week.theme }}</span>
            </div>
            <div class="week-tasks">
              <div v-for="task in week.tasks" :key="task" class="task-item">
                <q-checkbox
                  :model-value="false"
                  color="purple"
                  size="sm"
                />
                <span>{{ task }}</span>
              </div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 长期愿景 -->
    <div class="vision-section">
      <q-card class="vision-card">
        <q-card-section>
          <div class="vision-header">
            <q-icon name="auto_awesome" color="amber" size="32px" />
            <h6>长期发展愿景</h6>
          </div>
          <p class="vision-text">{{ longTermVision }}</p>
          <div class="vision-milestones">
            <div
              v-for="milestone in milestones"
              :key="milestone.year"
              class="milestone-item"
            >
              <div class="milestone-year">{{ milestone.year }}</div>
              <div class="milestone-content">{{ milestone.target }}</div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Analysis {
  archetypeType: string
  oceanScores: Record<string, number>
  childAge?: number
}

const props = defineProps<{ analysis: Analysis }>()

const archetype = computed(() => props.analysis?.archetypeType || 'eagle')
const childAge = computed(() => props.analysis?.childAge || 8)

const developmentPhases = computed(() => {
  const basePhases = [
    {
      stage: '基础建设期',
      age: `${childAge.value}-${childAge.value + 2}岁`,
      icon: 'foundation',
      color: 'blue',
      focus: '建立学习习惯，培养基础能力',
      goals: ['养成规律作息', '培养阅读习惯', '发现兴趣方向'],
      activities: ['亲子阅读', '基础运动', '艺术启蒙']
    },
    {
      stage: '能力拓展期',
      age: `${childAge.value + 2}-${childAge.value + 4}岁`,
      icon: 'trending_up',
      color: 'green',
      focus: '深化特长发展，拓展能力边界',
      goals: ['深化特长领域', '培养团队协作', '提升自我管理'],
      activities: ['专项培训', '团队项目', '竞赛参与']
    },
    {
      stage: '整合提升期',
      age: `${childAge.value + 4}-${childAge.value + 6}岁`,
      icon: 'integration_instructions',
      color: 'purple',
      focus: '整合所学，形成独特优势',
      goals: ['建立知识体系', '发展批判思维', '准备升学规划'],
      activities: ['跨学科项目', '社会实践', '学术探索']
    }
  ]

  return basePhases
})

const abilityFocus = computed(() => {
  const focuses: Record<string, Array<{ name: string; icon: string; color: string; priority: number; label: string }>> = {
    eagle: [
      { name: '逻辑思维', icon: 'psychology', color: 'blue', priority: 90, label: '重点培养' },
      { name: '自主学习', icon: 'school', color: 'green', priority: 85, label: '重点培养' },
      { name: '情感表达', icon: 'favorite', color: 'red', priority: 60, label: '适度发展' },
      { name: '团队协作', icon: 'groups', color: 'orange', priority: 55, label: '适度发展' }
    ],
    wolf: [
      { name: '领导能力', icon: 'military_tech', color: 'amber', priority: 90, label: '重点培养' },
      { name: '团队协作', icon: 'groups', color: 'green', priority: 85, label: '重点培养' },
      { name: '独立思考', icon: 'lightbulb', color: 'blue', priority: 65, label: '适度发展' },
      { name: '情绪管理', icon: 'spa', color: 'purple', priority: 60, label: '适度发展' }
    ],
    water: [
      { name: '情感智能', icon: 'favorite', color: 'red', priority: 90, label: '重点培养' },
      { name: '艺术表达', icon: 'palette', color: 'purple', priority: 85, label: '重点培养' },
      { name: '自信建立', icon: 'emoji_events', color: 'amber', priority: 70, label: '需要加强' },
      { name: '决断能力', icon: 'bolt', color: 'blue', priority: 65, label: '需要加强' }
    ],
    monkey: [
      { name: '创造力', icon: 'auto_awesome', color: 'purple', priority: 90, label: '重点培养' },
      { name: '探索精神', icon: 'explore', color: 'green', priority: 85, label: '重点培养' },
      { name: '专注力', icon: 'center_focus_strong', color: 'blue', priority: 70, label: '需要加强' },
      { name: '坚持性', icon: 'fitness_center', color: 'orange', priority: 65, label: '需要加强' }
    ]
  }
  return focuses[archetype.value] || focuses.eagle
})

const weeklyPlans = computed(() => [
  {
    theme: '习惯建立',
    color: 'blue',
    tasks: ['制定每日学习计划', '设置固定阅读时间', '建立运动习惯']
  },
  {
    theme: '兴趣探索',
    color: 'green',
    tasks: ['尝试一项新活动', '记录感兴趣的事物', '与孩子深入交流']
  },
  {
    theme: '能力提升',
    color: 'purple',
    tasks: ['参加一次相关活动', '完成一个小项目', '总结学习收获']
  },
  {
    theme: '巩固反思',
    color: 'orange',
    tasks: ['回顾本月进步', '调整发展计划', '设定下月目标']
  }
])

const longTermVision = computed(() => {
  const visions: Record<string, string> = {
    eagle: '培养成为具有独立思考能力、追求卓越、能够在专业领域深耕的未来精英',
    wolf: '培养成为善于团队协作、具备领导力、能够影响和带领他人的未来领袖',
    water: '培养成为情感丰富、善解人意、在人文艺术领域具有独特贡献的创作者',
    monkey: '培养成为富有创意、敢于突破、能够创新引领变革的未来创新者'
  }
  return visions[archetype.value] || visions.eagle
})

const milestones = computed(() => [
  { year: '1年后', target: '建立稳定的学习习惯和初步的兴趣方向' },
  { year: '3年后', target: '在特长领域取得阶段性成果' },
  { year: '5年后', target: '形成独特的个人优势和发展路径' }
])
</script>

<style scoped>
.development-plan {
  padding: 1rem 0;
}

.section-header {
  margin-bottom: 1.5rem;
}

.section-header h5 {
  color: #5B21B6;
  margin-bottom: 0.25rem;
}

.section-header p {
  color: #666;
  font-size: 0.9rem;
}

h6 {
  color: #5B21B6;
  margin-bottom: 1rem;
}

.timeline-section {
  margin-bottom: 2rem;
}

.phase-content {
  padding: 0.5rem 0;
}

.phase-focus {
  color: #666;
  margin-bottom: 0.75rem;
}

.phase-goals ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.phase-goals li {
  color: #666;
  margin-bottom: 0.25rem;
}

.phase-activities {
  margin-top: 0.75rem;
}

.activity-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.abilities-card {
  margin-bottom: 2rem;
}

.abilities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.ability-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ability-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.ability-name {
  font-weight: 500;
}

.ability-label {
  font-size: 0.8rem;
  color: #999;
}

.action-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.week-card {
  border-radius: 15px;
}

.week-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.week-theme {
  font-weight: 500;
  color: #333;
}

.task-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.task-item span {
  font-size: 0.9rem;
  color: #666;
}

.vision-card {
  background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
}

.vision-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.vision-header h6 {
  margin: 0;
}

.vision-text {
  color: #666;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.vision-milestones {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.milestone-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.milestone-year {
  background: #F59E0B;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
  min-width: 60px;
  text-align: center;
}

.milestone-content {
  color: #666;
}
</style>
