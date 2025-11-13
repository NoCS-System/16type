type AnalyticsEvent = 'ad_result_intent_shown' | 'ad_result_intent_skipped' | 'ad_midroll1_shown' | 'ad_result_bottom_shown' | 'ad_result_aside_shown';

export function useAnalytics() {
  function track(event: AnalyticsEvent, payload?: Record<string, unknown>) {
    try {
      // ダミー実装（本番では任意の計測SDKに差し替え）
      // eslint-disable-next-line no-console
      console.log('[analytics]', event, payload || {});
    } catch {}
  }
  return { track };
}


