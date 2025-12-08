// composables/useApi.ts - API请求封装
export const useApi = () => {
  const config = useRuntimeConfig()
  const userStore = useUserStore()

  // 获取认证token
  const getAuthHeader = () => {
    const token = useCookie('auth-token')
    return token.value ? { Authorization: `Bearer ${token.value}` } : {}
  }

  // 统一请求方法
  const request = async <T = any>(
    endpoint: string,
    options: any = {}
  ): Promise<{ data: T; success: boolean; error?: string }> => {
    try {
      const response = await $fetch(`${config.public.apiBase}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
          ...options.headers,
        }
      })

      return {
        data: response,
        success: true
      }
    } catch (error: any) {
      console.error(`API请求失败 ${endpoint}:`, error)

      // 处理认证错误
      if (error.status === 401) {
        userStore.logout()
        throw createError({
          statusCode: 401,
          statusMessage: '认证失败，请重新登录'
        })
      }

      return {
        data: null as T,
        success: false,
        error: error.data?.detail || error.message || '请求失败'
      }
    }
  }

  return {
    // 认证相关
    login: (username: string, password: string) =>
      request('/api/auth/login', {
        method: 'POST',
        body: { username, password }
      }),

    register: (userData: { username: string; email: string; password: string }) =>
      request('/api/auth/register', {
        method: 'POST',
        body: userData
      }),

    getCurrentUser: () =>
      request('/api/auth/me'),

    // 分析相关
    startAnalysis: (analysisData: {
      childName: string
      childAge: number
      fingerprints: string[]
    }) =>
      request('/api/analysis/start', {
        method: 'POST',
        body: analysisData
      }),

    getAnalysisStatus: (analysisId: string) =>
      request(`/api/analysis/${analysisId}/status`),

    getUserAnalyses: (limit: number = 20) =>
      request(`/api/user/analyses?limit=${limit}`),

    // 用户相关
    addCredits: (amount: number, reason: string) =>
      request('/api/user/credits', {
        method: 'POST',
        body: { amount, reason }
      }),

    upgradeSubscription: (plan: 'basic' | 'premium') =>
      request('/api/user/upgrade', {
        method: 'POST',
        body: { plan }
      }),

    updateProfile: (updates: any) =>
      request('/api/user/profile', {
        method: 'PUT',
        body: updates
      }),

    // 统计数据
    getDashboardStats: () =>
      request('/api/dashboard/stats'),

    // 产品和支付
    getProducts: () =>
      request('/api/products'),

    createOrder: (productId: string, channel: string = 'wechat') =>
      request('/api/orders', {
        method: 'POST',
        body: { product_id: productId, channel }
      }),

    getOrder: (orderNo: string) =>
      request(`/api/orders/${orderNo}`),

    simulatePay: (orderNo: string) =>
      request(`/api/orders/${orderNo}/pay`, {
        method: 'POST'
      })
  }
}
