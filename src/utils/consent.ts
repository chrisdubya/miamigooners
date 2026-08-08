export const CONSENT_STORAGE_KEY = 'miami-gooners-cookie-consent-v1'
export const CONSENT_OPEN_EVENT = 'miami-gooners:open-cookie-settings'

export type ConsentValue = 'granted' | 'denied'

// localStorage throws in Safari private mode and when storage is disabled, so
// every access is guarded — the banner must still work, it just won't persist.
export const readConsent = (): ConsentValue | null => {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY)
    return stored === 'granted' || stored === 'denied' ? stored : null
  } catch {
    return null
  }
}

export const writeConsent = (value: ConsentValue) => {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, value)
  } catch {
    // ignore
  }
}

// Google Consent Mode v2 — GA4 is loaded with analytics_storage denied and
// upgraded here once the visitor chooses. Until then it sets no cookies.
export const updateGtagConsent = (value: ConsentValue) => {
  window.gtag?.('consent', 'update', {analytics_storage: value})
}
