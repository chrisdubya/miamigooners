'use client'
import Link from 'next/link'
import {useState} from 'react'
import {PolicyModal} from './PolicyModal'
import {ReturnPolicy} from './policies/ReturnPolicy'
import {PrivacyPolicy} from './policies/PrivacyPolicy'
import {Box, Container, IconButton, Typography} from '@mui/material'
import {Instagram, X, Mail} from '@mui/icons-material'
import {doppler} from './font'

export const Footer = () => {
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false)
  const [privacyPolicyOpen, setPrivacyPolicyOpen] = useState(false)

  return (
    <>
      <Box
        component="footer"
        sx={{
          backgroundColor: '#111113',
          borderTop: '1px solid #2E2E38',
          pt: {xs: 6, md: 8},
          pb: {xs: 4, md: 6},
        }}
      >
        <Container maxWidth="lg">
          {/* 3-column grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {xs: '1fr', md: '1fr 1fr 1fr'},
              gap: {xs: 4, md: 4},
            }}
          >
            {/* Column 1: Brand */}
            <Box>
              <Box
                component="span"
                sx={{
                  fontFamily: doppler.style.fontFamily,
                  fontSize: '1rem',
                  letterSpacing: '0.05em',
                  textTransform: 'lowercase',
                  display: 'flex',
                  gap: '0.35em',
                  mb: 2,
                }}
              >
                <Box component="span" sx={{color: '#A1A1AA', fontWeight: 400}}>
                  MIAMI
                </Box>
                <Box component="span" sx={{color: '#DB0007', fontWeight: 700}}>
                  GOONERS
                </Box>
              </Box>
              <Typography variant="body2" sx={{color: '#A1A1AA', mb: 1}}>
                Arsenal&apos;s Official Supporters Club in Miami, FL
              </Typography>
              <Typography variant="body2" sx={{color: '#71717A'}}>
                We watch all matches at The Bar in Coral Gables
              </Typography>
            </Box>

            {/* Column 2: Quick Links */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  color: '#71717A',
                  letterSpacing: '0.1em',
                  display: 'block',
                  mb: 2,
                }}
              >
                Links
              </Typography>
              <Box sx={{display: 'flex', flexDirection: 'column', gap: 1.5}}>
                <Link
                  href="/#matches"
                  style={{
                    color: '#A1A1AA',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 200ms ease',
                  }}
                >
                  Matches
                </Link>
                <Link
                  href="/shop"
                  style={{
                    color: '#A1A1AA',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 200ms ease',
                  }}
                >
                  Shop
                </Link>
                <a
                  href="https://www.arsenalamerica.com/branches/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#A1A1AA',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 200ms ease',
                  }}
                >
                  Arsenal America
                </a>
              </Box>
            </Box>

            {/* Column 3: Connect */}
            <Box>
              <Typography
                variant="caption"
                sx={{
                  textTransform: 'uppercase',
                  color: '#71717A',
                  letterSpacing: '0.1em',
                  display: 'block',
                  mb: 2,
                }}
              >
                Follow Us
              </Typography>
              <Box sx={{display: 'flex', gap: 2, mb: 2}}>
                <IconButton
                  component="a"
                  href="https://www.instagram.com/miamigooners"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  size="small"
                  sx={{
                    color: '#A1A1AA',
                    transition: 'color 0.2s ease',
                    '&:hover': {color: '#DB0007'},
                  }}
                >
                  <Instagram sx={{fontSize: 24}} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://twitter.com/miamigooners"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X/Twitter"
                  size="small"
                  sx={{
                    color: '#A1A1AA',
                    transition: 'color 0.2s ease',
                    '&:hover': {color: '#DB0007'},
                  }}
                >
                  <X sx={{fontSize: 24}} />
                </IconButton>
                <IconButton
                  component="a"
                  href="mailto:info@miamigooners.com"
                  aria-label="Email"
                  size="small"
                  sx={{
                    color: '#A1A1AA',
                    transition: 'color 0.2s ease',
                    '&:hover': {color: '#DB0007'},
                  }}
                >
                  <Mail sx={{fontSize: 24}} />
                </IconButton>
              </Box>
              <a
                href="mailto:info@miamigooners.com"
                style={{color: '#A1A1AA', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 200ms ease'}}
              >
                info@miamigooners.com
              </a>
            </Box>
          </Box>

          {/* Bottom bar */}
          <Box
            sx={{
              borderTop: '1px solid #2E2E38',
              mt: 4,
              pt: 3,
              display: 'flex',
              flexDirection: {xs: 'column', md: 'row'},
              justifyContent: 'space-between',
              alignItems: {xs: 'center', md: 'flex-start'},
              gap: 2,
            }}
          >
            <Typography variant="caption" sx={{color: '#71717A'}}>
              &copy; {new Date().getFullYear()} Miami Gooners. All rights
              reserved.
            </Typography>
            <Box sx={{display: 'flex', gap: 2, alignItems: 'center'}}>
              <button
                onClick={() => setPrivacyPolicyOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717A',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Privacy Policy
              </button>
              <Typography variant="caption" sx={{color: '#2E2E38'}}>
                |
              </Typography>
              <button
                onClick={() => setReturnPolicyOpen(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#71717A',
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                Return Policy
              </button>
            </Box>
          </Box>
        </Container>
      </Box>

      <PolicyModal
        open={privacyPolicyOpen}
        onClose={() => setPrivacyPolicyOpen(false)}
        title="Privacy Policy"
      >
        <PrivacyPolicy />
      </PolicyModal>

      <PolicyModal
        open={returnPolicyOpen}
        onClose={() => setReturnPolicyOpen(false)}
        title="Return and Refund Policy"
      >
        <ReturnPolicy />
      </PolicyModal>
    </>
  )
}
