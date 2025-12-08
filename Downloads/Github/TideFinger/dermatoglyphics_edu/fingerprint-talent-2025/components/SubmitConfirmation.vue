<template>
  <div class="submit-confirmation">
    <div class="confirmation-header">
      <q-icon name="fact_check" size="48px" color="purple" />
      <h4>确认提交信息</h4>
      <p>请核对以下信息，确认无误后提交分析</p>
    </div>

    <!-- 信息汇总 -->
    <div class="info-summary">
      <q-card class="summary-card">
        <q-card-section>
          <div class="summary-item">
            <span class="label">孩子姓名</span>
            <span class="value">{{ formData.basicInfo.childName }}</span>
          </div>
          <q-separator class="q-my-sm" />

          <div class="summary-item">
            <span class="label">年龄</span>
            <span class="value">{{ formData.basicInfo.childAge }} 岁</span>
          </div>
          <q-separator class="q-my-sm" />

          <div class="summary-item">
            <span class="label">性别</span>
            <span class="value">{{ genderLabel }}</span>
          </div>
          <q-separator class="q-my-sm" />

          <div class="summary-item">
            <span class="label">惯用手</span>
            <span class="value">{{ handednessLabel }}</span>
          </div>
          <q-separator class="q-my-sm" />

          <div class="summary-item">
            <span class="label">指纹采集</span>
            <span class="value">
              <q-chip color="positive" text-color="white" size="sm">
                {{ formData.fingerprints.length }}/10 已完成
              </q-chip>
            </span>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- 服务条款 -->
    <div class="terms-section">
      <q-checkbox v-model="agreedTerms" color="purple">
        <span class="terms-text">
          我已阅读并同意
          <a href="/terms" target="_blank" class="link">服务条款</a>
          和
          <a href="/privacy" target="_blank" class="link">隐私政策</a>
        </span>
      </q-checkbox>
    </div>

    <!-- 费用提示 -->
    <div class="cost-notice">
      <q-banner class="bg-purple-1 text-purple">
        <template v-slot:avatar>
          <q-icon name="info" color="purple" />
        </template>
        本次分析将消耗 1 个分析额度
      </q-banner>
    </div>

    <!-- 操作按钮 -->
    <div class="action-buttons">
      <q-btn
        flat
        color="grey"
        label="返回修改"
        icon="arrow_back"
        @click="$emit('back')"
        no-caps
      />
      <q-btn
        color="purple"
        label="确认提交"
        icon="send"
        :disable="!agreedTerms"
        :loading="loading"
        @click="handleSubmit"
        no-caps
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface FormData {
  basicInfo: {
    childName: string
    childAge: number
    gender: string
    handedness: string
  }
  fingerprints: string[]
}

const props = defineProps<{
  formData: FormData
  loading: boolean
}>()

const emit = defineEmits(['submit', 'back'])

const agreedTerms = ref(false)

const genderLabel = computed(() => {
  const map: Record<string, string> = { male: '男', female: '女' }
  return map[props.formData.basicInfo.gender] || '未填写'
})

const handednessLabel = computed(() => {
  const map: Record<string, string> = { right: '右手', left: '左手', both: '双手' }
  return map[props.formData.basicInfo.handedness] || '右手'
})

const handleSubmit = () => {
  emit('submit')
}
</script>

<style scoped>
.submit-confirmation {
  padding: 1rem 0;
}

.confirmation-header {
  text-align: center;
  margin-bottom: 2rem;
}

.confirmation-header h4 {
  color: #5B21B6;
  margin: 1rem 0 0.5rem;
}

.confirmation-header p {
  color: #666;
}

.summary-card {
  background: #F9FAFB;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
}

.summary-item .label {
  color: #666;
}

.summary-item .value {
  font-weight: 600;
  color: #333;
}

.terms-section {
  margin: 1.5rem 0;
}

.terms-text {
  font-size: 0.9rem;
  color: #666;
}

.link {
  color: #8B5CF6;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}

.cost-notice {
  margin-bottom: 2rem;
}

.action-buttons {
  display: flex;
  justify-content: space-between;
}
</style>
