<template>
  <q-page class="analysis-page">
    <div class="analysis-container">
      <!-- 步骤指示器 -->
      <div class="steps-indicator">
        <q-stepper
          v-model="currentStep"
          vertical
          color="purple"
          active-color="purple"
          done-color="positive"
          class="analysis-stepper"
        >
          <q-step
            :name="1"
            title="基本信息"
            icon="person"
            :done="currentStep > 1"
            :header-nav="currentStep > 1"
          >
            <BasicInfoForm
              v-model="formData.basicInfo"
              @next="nextStep"
            />
          </q-step>

          <q-step
            :name="2"
            title="指纹采集"
            icon="fingerprint"
            :done="currentStep > 2"
            :header-nav="currentStep > 2"
          >
            <FingerprintCollection
              v-model="formData.fingerprints"
              @next="nextStep"
              @back="prevStep"
            />
          </q-step>

          <q-step
            :name="3"
            title="确认提交"
            icon="check_circle"
            :done="currentStep > 3"
          >
            <SubmitConfirmation
              :form-data="formData"
              @submit="submitAnalysis"
              @back="prevStep"
              :loading="submitting"
            />
          </q-step>

          <q-step
            :name="4"
            title="分析处理"
            icon="psychology"
            :done="analysisCompleted"
          >
            <AnalysisProgress
              :analysis="currentAnalysis"
              :progress="processingProgress"
              @complete="handleAnalysisComplete"
            />
          </q-step>
        </q-stepper>
      </div>
    </div>

    <!-- 结果对话框 -->
    <q-dialog v-model="showResults" persistent>
      <AnalysisResults
        :analysis="currentAnalysis"
        @close="handleResultsClose"
        @view-report="viewDetailReport"
      />
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

// SEO配置
useHead({
  title: '开始分析 - 天赋指纹',
  meta: [
    { name: 'description', content: '上传指纹图片，开始AI分析您孩子的天赋特质' }
  ]
})

// 状态管理
const userStore = useUserStore()
const analysisStore = useAnalysis()
const router = useRouter()

// 响应式状态
const currentStep = ref(1)
const submitting = ref(false)
const showResults = ref(false)
const analysisCompleted = ref(false)

// 表单数据
const formData = reactive({
  basicInfo: {
    childName: '',
    childAge: 0,
    gender: '',
    handedness: 'right'
  },
  fingerprints: [] as string[]
})

// 计算属性
const { currentAnalysis, processingProgress } = analysisStore

// 检查用户权限
onMounted(() => {
  if (!userStore.isAuthenticated) {
    router.push('/')
    return
  }

  if (!userStore.canAnalyze) {
    $q.notify({
      type: 'warning',
      message: '分析额度不足，请升级会员或购买额度',
      actions: [
        { label: '立即升级', color: 'white', handler: () => router.push('/pricing') }
      ]
    })
  }
})

// 步骤导航
const nextStep = () => {
  if (currentStep.value < 4) {
    currentStep.value++
  }
}

const prevStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 提交分析
const submitAnalysis = async () => {
  if (!validateForm()) return

  submitting.value = true

  try {
    await analysisStore.startAnalysis({
      childName: formData.basicInfo.childName,
      childAge: formData.basicInfo.childAge,
      fingerprints: formData.fingerprints
    })

    nextStep() // 进入处理步骤

  } catch (error: any) {
    $q.notify({
      type: 'negative',
      message: error.message || '提交失败，请重试'
    })
  } finally {
    submitting.value = false
  }
}

// 表单验证
const validateForm = () => {
  if (!formData.basicInfo.childName) {
    $q.notify({
      type: 'warning',
      message: '请输入孩子姓名'
    })
    return false
  }

  if (formData.basicInfo.childAge < 3 || formData.basicInfo.childAge > 18) {
    $q.notify({
      type: 'warning',
      message: '请输入有效年龄（3-18岁）'
    })
    return false
  }

  if (formData.fingerprints.length < 10) {
    $q.notify({
      type: 'warning',
      message: '请完成十指指纹采集'
    })
    return false
  }

  return true
}

// 分析完成处理
const handleAnalysisComplete = (analysis: any) => {
  analysisCompleted.value = true
  showResults.value = true

  $q.notify({
    type: 'positive',
    message: '分析完成！',
    icon: 'celebration'
  })
}

// 关闭结果弹窗
const handleResultsClose = () => {
  showResults.value = false
  router.push('/profile')
}

// 查看详细报告
const viewDetailReport = (analysisId: string) => {
  router.push(`/result/${analysisId}`)
}
</script>

<style scoped>
.analysis-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.analysis-container {
  max-width: 800px;
  margin: 0 auto;
}

.steps-indicator {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 2rem;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.analysis-stepper {
  background: transparent;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .analysis-page {
    padding: 1rem;
  }

  .steps-indicator {
    padding: 1rem;
    border-radius: 15px;
  }
}
</style>
