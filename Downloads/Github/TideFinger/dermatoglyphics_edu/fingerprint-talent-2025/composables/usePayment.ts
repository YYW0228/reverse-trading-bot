import { useReportStore } from '~/stores/report'
import { useAnalytics } from './useAnalytics'

export const usePayment = () => {
  const store = useReportStore()
  const { track } = useAnalytics()

  const payAndUnlock = async (): Promise<boolean> => {
    track('unlock_click')
    try {
      // TODO: integrate real payment (WeChat/Stripe). Simulate success delay.
      await new Promise((r) => setTimeout(r, 1200))
      store.unlock()
      track('unlock_success')
      return true
    } catch (e) {
      track('unlock_cancel', { reason: (e as any)?.message || 'cancelled' })
      return false
    }
  }

  return { payAndUnlock }
}
