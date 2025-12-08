export type AnalyticEvent =
  | 'scan_lock_time'
  | 'angel_transition_play'
  | 'result_view_time_start'
  | 'unlock_click'
  | 'unlock_success'
  | 'unlock_cancel'
  | 'poster_generate'
  | 'share_click'

export const useAnalytics = () => {
  const track = (event: AnalyticEvent, payload?: Record<string, any>) => {
    try {
      // TODO: replace with real analytics endpoint
      console.debug('[analytics]', event, payload || {})
    } catch {}
  }
  return { track }
}
