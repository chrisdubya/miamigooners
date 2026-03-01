'use client'
import {useState, useEffect} from 'react'
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Badge,
  useMediaQuery,
  useTheme,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Instagram,
  X,
  Mail,
  ShoppingCart,
} from '@mui/icons-material'
import Link from 'next/link'
import {usePathname} from 'next/navigation'
import {useCart} from './context/CartContext'
import {doppler} from './font'

export const Navbar = () => {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const {state} = useCart()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const isShopPage = pathname.startsWith('/shop')

  const navLinks = [
    {label: 'MATCHES', href: '/#matches'},
    {label: 'SHOP', href: '/shop'},
  ]

  const isActive = (href: string) => {
    if (href === '/shop') return isShopPage
    if (href === '/#matches') return pathname === '/'
    return false
  }

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: 'rgba(10, 10, 11, 0.9)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #2E2E38',
          boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          zIndex: 50,
        }}
      >
        <Toolbar
          sx={{
            height: {xs: 56, md: 64},
            maxWidth: 1200,
            width: '100%',
            mx: 'auto',
            px: {xs: 2, md: 4},
          }}
        >
          {/* Wordmark */}
          <Link href="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center'}}>
            <Box
              component="span"
              sx={{
                fontFamily: doppler.style.fontFamily,
                fontSize: '1rem',
                letterSpacing: '0.05em',
                textTransform: 'lowercase',
                display: 'flex',
                gap: '0.35em',
              }}
            >
              <Box component="span" sx={{color: 'text.secondary', fontWeight: 400}}>
                MIAMI
              </Box>
              <Box component="span" sx={{color: '#DB0007', fontWeight: 700}}>
                GOONERS
              </Box>
            </Box>
          </Link>

          <Box sx={{flex: 1}} />

          {/* Desktop nav */}
          {!isMobile && (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 4}}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{textDecoration: 'none'}}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: 'inherit',
                      fontWeight: 500,
                      fontSize: '0.75rem',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      color: isActive(link.href) ? 'text.primary' : 'text.secondary',
                      borderBottom: isActive(link.href)
                        ? '2px solid #DB0007'
                        : '2px solid transparent',
                      paddingBottom: '4px',
                      transition: 'color 200ms ease, border-color 200ms ease',
                      '&:hover': {
                        color: 'text.primary',
                      },
                    }}
                  >
                    {link.label}
                  </Box>
                </Link>
              ))}

              {/* Social icons */}
              <Box sx={{display: 'flex', alignItems: 'center', gap: 1, ml: 1}}>
                <IconButton
                  component="a"
                  href="https://www.instagram.com/miamigooners"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label="Follow us on Instagram"
                  sx={{
                    color: 'text.secondary',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    '&:hover': {color: '#DB0007', transform: 'scale(1.15)'},
                  }}
                >
                  <Instagram sx={{fontSize: 20}} />
                </IconButton>
                <IconButton
                  component="a"
                  href="https://twitter.com/miamigooners"
                  target="_blank"
                  rel="noopener noreferrer"
                  size="small"
                  aria-label="Follow us on X/Twitter"
                  sx={{
                    color: 'text.secondary',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    '&:hover': {color: '#DB0007', transform: 'scale(1.15)'},
                  }}
                >
                  <X sx={{fontSize: 20}} />
                </IconButton>
                <IconButton
                  component="a"
                  href="mailto:info@miamigooners.com"
                  size="small"
                  aria-label="Email us"
                  sx={{
                    color: 'text.secondary',
                    transition: 'color 0.2s ease, transform 0.2s ease',
                    '&:hover': {color: '#DB0007', transform: 'scale(1.15)'},
                  }}
                >
                  <Mail sx={{fontSize: 20}} />
                </IconButton>
              </Box>

              {/* Cart icon for shop pages */}
              {isShopPage && (
                <Link href="/shop/cart">
                  <IconButton
                    size="small"
                    aria-label="Shopping cart"
                    sx={{color: 'text.secondary', '&:hover': {color: 'text.primary'}}}
                  >
                    <Badge badgeContent={state.totalQuantity} color="error" max={99}>
                      <ShoppingCart sx={{fontSize: 20}} />
                    </Badge>
                  </IconButton>
                </Link>
              )}
            </Box>
          )}

          {/* Mobile: cart + hamburger */}
          {isMobile && (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
              {isShopPage && (
                <Link href="/shop/cart">
                  <IconButton
                    size="small"
                    aria-label="Shopping cart"
                    sx={{color: 'text.primary'}}
                  >
                    <Badge badgeContent={state.totalQuantity} color="error" max={99}>
                      <ShoppingCart sx={{fontSize: 22}} />
                    </Badge>
                  </IconButton>
                </Link>
              )}
              <IconButton
                onClick={() => setDrawerOpen(true)}
                aria-label="Open menu"
                sx={{color: 'text.primary'}}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: {
            width: '100%',
            backgroundColor: '#0A0A0B',
            color: '#F5F5F7',
          },
        }}
      >
        <Box sx={{display: 'flex', justifyContent: 'flex-end', p: 2}}>
          <IconButton
            onClick={() => setDrawerOpen(false)}
            aria-label="Close menu"
            sx={{color: 'text.primary'}}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <List sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, mt: 4}}>
          {navLinks.map((link) => (
            <ListItemButton
              key={link.href}
              component={Link}
              href={link.href}
              onClick={() => setDrawerOpen(false)}
              sx={{
                justifyContent: 'center',
                '&:hover': {backgroundColor: 'rgba(219, 0, 7, 0.08)'},
              }}
            >
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  sx: {
                    fontFamily: doppler.style.fontFamily,
                    fontWeight: 600,
                    fontSize: '1.5rem',
                    letterSpacing: '-0.015em',
                    textAlign: 'center',
                    color: isActive(link.href) ? '#DB0007' : '#F5F5F7',
                  },
                }}
              />
            </ListItemButton>
          ))}

          {/* Social links in drawer */}
          <Box sx={{display: 'flex', gap: 3, mt: 4}}>
            <IconButton
              component="a"
              href="https://www.instagram.com/miamigooners"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              sx={{color: 'text.secondary', '&:hover': {color: '#DB0007'}}}
            >
              <Instagram />
            </IconButton>
            <IconButton
              component="a"
              href="https://twitter.com/miamigooners"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X/Twitter"
              sx={{color: 'text.secondary', '&:hover': {color: '#DB0007'}}}
            >
              <X />
            </IconButton>
            <IconButton
              component="a"
              href="mailto:info@miamigooners.com"
              aria-label="Email"
              sx={{color: 'text.secondary', '&:hover': {color: '#DB0007'}}}
            >
              <Mail />
            </IconButton>
          </Box>
        </List>
      </Drawer>
    </>
  )
}
