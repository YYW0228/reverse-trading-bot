// composables/useAnalysis.ts - 分析状态管理
export const useAnalysis = () => {
  const api = useApi()
  const userStore = useUserStore()

  // 响应式状态
  const currentAnalysis = ref<any>(null)
  const analysisHistory = ref<any[]>([])
  const isProcessing = ref(false)
  const processingProgress = ref(0)

  // 启动新分析
  const startAnalysis = async (analysisData: {
    childName: string
    childAge: number
    fingerprints: string[]
  }) => {
    if (!userStore.canAnalyze) {
      throw new Error('分析额度不足，请升级会员或购买额度')
    }

    isProcessing.value = true
    processingProgress.value = 0

    try {
      const result = await api.startAnalysis(analysisData)

      if (result.success) {
        currentAnalysis.value = result.data

        // 开始轮询状态
        pollAnalysisStatus(result.data.id)

        return result.data
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      isProcessing.value = false
      throw error
    }
  }

  // 轮询分析状态
  const pollAnalysisStatus = async (analysisId: string) => {
    const checkStatus = async () => {
      try {
        const result = await api.getAnalysisStatus(analysisId)

        if (result.success) {
          const status = result.data
          currentAnalysis.value = status

          // 更新进度
          if (status.status === 'processing') {
            processingProgress.value = Math.min(processingProgress.value + 10, 90)
            setTimeout(checkStatus, 3000) // 3秒后再次检查
          } else if (status.status === 'completed') {
            processingProgress.value = 100
            isProcessing.value = false

            // 刷新用户分析历史
            await loadAnalysisHistory()

            // 更新用户积分（如果有变化）
            if (userStore.user && userStore.user.subscription !== 'premium') {
              userStore.user.credits = Math.max(0, userStore.user.credits)
            }
          } else if (status.status === 'failed') {
            isProcessing.value = false
            throw new Error('分析失败，请重试')
          }
        }
      } catch (error) {
        console.error('轮询分析状态失败:', error)
        isProcessing.value = false
      }
    }

    checkStatus()
  }

  // 加载分析历史
  const loadAnalysisHistory = async (limit: number = 20) => {
    try {
      const result = await api.getUserAnalyses(limit)

      if (result.success) {
        analysisHistory.value = result.data.data || []
      }
    } catch (error) {
      console.error('加载分析历史失败:', error)
    }
  }

  // 获取特定分析
  const getAnalysis = async (analysisId: string) => {
    try {
      const result = await api.getAnalysisStatus(analysisId)
      return result.success ? result.data : null
    } catch (error) {
      console.error('获取分析失败:', error)
      return null
    }
  }

  // 分析结果解释
  const interpretResults = (oceanScores: any, archetypeType: string) => {
    const interpretations = {
      eagle: {
        name: '鹰型·完美主义者',
        description: '目标导向，追求完美，独立思考',
        strengths: ['逻辑思维强', '注重细节', '自主性强'],
        challenges: ['过于苛求完美', '难以妥协', '压力敏感'],
        education: ['给予明确目标', '尊重独立思考', '避免过度催促']
      },
      wolf: {
        name: '狼型·灵活战略家',
        description: '适应能力强，善于合作，具备领导潜质',
        strengths: ['团队合作', '应变能力', '沟通能力'],
        challenges: ['决策犹豫', '过度依赖他人', '缺乏坚持'],
        education: ['培养决断力', '鼓励独立思考', '设置挑战目标']
      },
      water: {
        name: '水型·温和适应者',
        description: '情感丰富，善解人意，和谐导向',
        strengths: ['同理心强', '人际和谐', '情感敏感'],
        challenges: ['缺乏主见', '容易受影响', '避免冲突'],
        education: ['建立自信心', '鼓励表达观点', '提供安全环境']
      },
      monkey: {
        name: '猴型·创新思维者',
        description: '创意无限，敢于突破，思维活跃',
        strengths: ['创新思维', '好奇心强', '适应变化'],
        challenges: ['注意力分散', '缺乏持续性', '反叛倾向'],
        education: ['提供创意空间', '设置有趣挑战', '引导而非强制']
      }
    }

    return interpretations[archetypeType] || interpretations.eagle
  }

  // 计算分析完成率
  const getCompletionRate = computed(() => {
    if (!analysisHistory.value.length) return 0

    const completed = analysisHistory.value.filter(a => a.status === 'completed').length
    return Math.round((completed / analysisHistory.value.length) * 100)
  })

  // 获取本月分析数量
  const getThisMonthCount = computed(() => {
    const thisMonth = new Date().getMonth()
    const thisYear = new Date().getFullYear()

    return analysisHistory.value.filter(a => {
      const analysisDate = new Date(a.createdAt)
      return analysisDate.getMonth() === thisMonth &&
             analysisDate.getFullYear() === thisYear
    }).length
  })

  return {
    // 状态
    currentAnalysis: readonly(currentAnalysis),
    analysisHistory: readonly(analysisHistory),
    isProcessing: readonly(isProcessing),
    processingProgress: readonly(processingProgress),

    // 计算属性
    completionRate: getCompletionRate,
    thisMonthCount: getThisMonthCount,

    // 方法
    startAnalysis,
    loadAnalysisHistory,
    getAnalysis,
    interpretResults,
    pollAnalysisStatus
  }
}
