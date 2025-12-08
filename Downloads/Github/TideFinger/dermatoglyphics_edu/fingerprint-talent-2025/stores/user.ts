import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  subscription: 'free' | 'basic' | 'premium'
  credits: number
}

export interface Analysis {
  id: string
  userId: string
  childName: string
  childAge: number
  fingerprints: string[]
  oceanScores: {
    openness: number
    conscientiousness: number
    extraversion: number
    agreeableness: number
    neuroticism: number
  }
  archetypeType: 'eagle' | 'wolf' | 'water' | 'monkey' | 'earth' | 'volcano' | 'cocktail'
  reportUrl?: string
  createdAt: Date
  status: 'processing' | 'completed' | 'failed'
}

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as User | null,
    isAuthenticated: false,
    analyses: [] as Analysis[],
    currentAnalysis: null as Analysis | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    canAnalyze: (state) => {
      if (!state.user) return false
      if (state.user.subscription === 'premium') return true
      if (state.user.subscription === 'basic') return state.user.credits > 0
      return state.user.credits > 0 // free tier gets limited credits
    },

    analysesThisMonth: (state) => {
      const now = new Date()
      const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      return state.analyses.filter(a => a.createdAt >= thisMonth).length
    },

    recentAnalyses: (state) => {
      return state.analyses
        .filter(a => a.status === 'completed')
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
        .slice(0, 5)
    }
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/auth/login', {
          method: 'POST',
          body: { email, password }
        })

        this.user = data.user
        this.isAuthenticated = true

        // 设置认证令牌
        const token = useCookie('auth-token', {
          httpOnly: true,
          secure: true,
          maxAge: 60 * 60 * 24 * 7 // 7 days
        })
        token.value = data.token

        await this.fetchAnalyses()

      } catch (error: any) {
        this.error = error.message || '登录失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async register(userData: {
      email: string
      password: string
      name: string
      inviteCode?: string
    }) {
      this.loading = true
      this.error = null

      try {
        const { data } = await $fetch('/api/auth/register', {
          method: 'POST',
          body: userData
        })

        this.user = data.user
        this.isAuthenticated = true

        // 新用户赠送免费额度
        await this.addCredits(3, '新用户赠送')

      } catch (error: any) {
        this.error = error.message || '注册失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async logout() {
      this.user = null
      this.isAuthenticated = false
      this.analyses = []
      this.currentAnalysis = null

      const token = useCookie('auth-token')
      token.value = null

      await navigateTo('/')
    },

    async startAnalysis(analysisData: {
      childName: string
      childAge: number
      fingerprints: string[]
    }) {
      if (!this.canAnalyze) {
        throw new Error('分析额度不足，请升级会员或购买额度')
      }

      this.loading = true

      try {
        const { data } = await $fetch('/api/analysis/start', {
          method: 'POST',
          body: analysisData
        })

        const analysis: Analysis = {
          ...data,
          createdAt: new Date(data.createdAt),
          status: 'processing'
        }

        this.currentAnalysis = analysis
        this.analyses.unshift(analysis)

        // 扣除额度
        if (this.user!.subscription !== 'premium') {
          this.user!.credits--
        }

        // 轮询分析状态
        this.pollAnalysisStatus(analysis.id)

        return analysis

      } catch (error: any) {
        this.error = error.message || '分析启动失败'
        throw error
      } finally {
        this.loading = false
      }
    },

    async pollAnalysisStatus(analysisId: string) {
      const checkStatus = async () => {
        try {
          const { data } = await $fetch(`/api/analysis/${analysisId}/status`)

          const analysisIndex = this.analyses.findIndex(a => a.id === analysisId)
          if (analysisIndex !== -1) {
            this.analyses[analysisIndex] = {
              ...this.analyses[analysisIndex],
              ...data,
              createdAt: new Date(data.createdAt)
            }

            if (this.currentAnalysis?.id === analysisId) {
              this.currentAnalysis = this.analyses[analysisIndex]
            }
          }

          if (data.status === 'processing') {
            setTimeout(checkStatus, 3000) // 每3秒检查一次
          }

        } catch (error) {
          console.error('Failed to check analysis status:', error)
        }
      }

      checkStatus()
    },

    async fetchAnalyses() {
      if (!this.isAuthenticated) return

      try {
        const { data } = await $fetch('/api/user/analyses')
        this.analyses = data.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt)
        }))
      } catch (error) {
        console.error('Failed to fetch analyses:', error)
      }
    },

    async addCredits(amount: number, reason: string) {
      if (!this.user) return

      try {
        await $fetch('/api/user/credits', {
          method: 'POST',
          body: { amount, reason }
        })

        this.user.credits += amount

      } catch (error) {
        console.error('Failed to add credits:', error)
      }
    },

    async upgradeSubscription(plan: 'basic' | 'premium') {
      if (!this.user) return

      try {
        const { data } = await $fetch('/api/user/upgrade', {
          method: 'POST',
          body: { plan }
        })

        this.user.subscription = data.subscription
        this.user.credits = data.credits

      } catch (error: any) {
        this.error = error.message || '升级失败'
        throw error
      }
    },

    async updateProfile(updates: Partial<User>) {
      if (!this.user) return

      try {
        const { data } = await $fetch('/api/user/profile', {
          method: 'PUT',
          body: updates
        })

        this.user = { ...this.user, ...data }

      } catch (error: any) {
        this.error = error.message || '更新失败'
        throw error
      }
    },

    clearError() {
      this.error = null
    }
  }
})
