'use client'
import {useEffect, useRef, useState} from 'react'
import {Box, Button, Typography} from '@mui/material'
import {PolicyModal} from './PolicyModal'
import {PrivacyPolicy} from './policies/PrivacyPolicy'
import {
  CONSENT_OPEN_EVENT,
  ConsentValue,
  readConsent,
  updateGtagConsent,
  writeConsent,
} from './utils/consent'
import {inter} from './font'

export const CookieConsentBanner = () => {
  const [visible, setVisible] = useState(false)
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)
  const bannerRef = useRef<HTMLDivElement>(null)

  // The banner is fixed to the bottom, so without this it sits on top of the
  // footer's policy links and swallows clicks on them until a choice is made.
  useEffect(() => {
    if (!visible) {
      document.body.style.removeProperty('padding-bottom')
      return
    }
    const apply = () => {
      const height = bannerRef.current?.offsetHeight
      if (height) document.body.style.paddingBottom = `${height}px`
    }
    apply()
    window.addEventListener('resize', apply)
    return () => {
      window.removeEventListener('resize', apply)
      document.body.style.removeProperty('padding-bottom')
    }
  }, [visible])

  // Start hidden and reveal in an effect — the server can't know localStorage,
  // so rendering the banner during SSR would cause a hydration mismatch.
  //
  // A Global Privacy Control signal is itself an opt-out, which our Privacy
  // Policy commits to honoring, so we don't ask. Consent already defaults to
  // denied; the footer link still lets those visitors opt in deliberately.
  useEffect(() => {
    if (readConsent() !== null) return
    if (navigator.globalPrivacyControl === true) return
    setVisible(true)
  }, [])

  // Lets the footer's "Cookie Preferences" link reopen the banner after a choice.
  useEffect(() => {
    const handler = () => setVisible(true)
    window.addEventListener(CONSENT_OPEN_EVENT, handler)
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, handler)
  }, [])

  const choose = (value: ConsentValue) => {
    writeConsent(value)
    updateGtagConsent(value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <>
      <Box
        ref={bannerRef}
        role="region"
        aria-label="Cookie consent"
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 1200,
          backgroundColor: '#111113',
          borderTop: '1px solid #2E2E38',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          px: {xs: 2, md: 4},
          py: {xs: 2, md: 2.5},
          display: 'flex',
          flexDirection: {xs: 'column', md: 'row'},
          alignItems: {xs: 'stretch', md: 'center'},
          justifyContent: 'center',
          gap: {xs: 1.5, md: 3},
          fontFamily: inter.style.fontFamily,
          animation: 'fadeSlideUp 0.3s ease-out',
        }}
      >
        <Typography
          sx={{
            fontFamily: inter.style.fontFamily,
            fontSize: {xs: '0.8125rem', md: '0.875rem'},
            color: '#A1A1AA',
            lineHeight: 1.5,
            maxWidth: 640,
          }}
        >
          We use cookies to measure how the site is used. Analytics cookies are
          only set if you accept — rejecting keeps everything working.{' '}
          <Box
            component="button"
            onClick={() => setPrivacyPolicyOpen(true)}
            sx={{
              background: 'none',
              border: 'none',
              padding: 0,
              color: '#D4A843',
              fontFamily: 'inherit',
              fontSize: 'inherit',
              cursor: 'pointer',
              textDecoration: 'underline',
              textUnderlineOffset: 3,
            }}
          >
            Privacy Policy
          </Box>
        </Typography>

        {/* Equal prominence for both choices — rejecting must be as easy as accepting. */}
        <Box
          sx={{
            display: 'flex',
            gap: 1.5,
            flexShrink: 0,
            '& > *': {flex: {xs: 1, md: '0 0 auto'}},
          }}
        >
          <Button
            onClick={() => choose('denied')}
            variant="outlined"
            color="primary"
            sx={{minWidth: {md: 120}}}
          >
            Reject
          </Button>
          <Button
            onClick={() => choose('granted')}
            variant="contained"
            color="primary"
            sx={{minWidth: {md: 120}}}
          >
            Accept
          </Button>
        </Box>
      </Box>

      <PolicyModal
        open={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </PolicyModal>
    </>
  )
}
