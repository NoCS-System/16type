export const CAP_KEYS = {
  RESULT_INTENT: 'ad_shown_result_intent',
  MIDROLL_1: 'ad_shown_midroll1',
  RESULT_BOTTOM: 'ad_shown_result_bottom',
  RESULT_ASIDE: 'ad_shown_result_aside',
} as const;

export function isCapOn(key: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return window.sessionStorage.getItem(key) === '1';
  } catch {
    return false;
  }
}

export function setCap(key: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(key, '1');
  } catch {}
}

export function withCapOnce(key: string, fn: () => void) {
  if (!isCapOn(key)) {
    setCap(key);
    fn();
  }
}


