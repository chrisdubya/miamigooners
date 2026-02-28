'use client'
import {useEffect, useState, useRef} from 'react'
import {usePathname} from 'next/navigation'
import {LoadingOverlay} from '../src/LoadingOverlay'

export default function NavigationLoader() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const previousPathname = useRef(pathname)

  useEffect(() => {
    if (previousPathname.current !== pathname) {
      setIsLoading(false)
      previousPathname.current = pathname
    }
  }, [pathname])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const anchor = target.closest('a')
      if (
        anchor &&
        anchor.href &&
        !anchor.target &&
        !anchor.download &&
        anchor.origin === window.location.origin &&
        anchor.pathname !== window.location.pathname
      ) {
        setIsLoading(true)
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return <LoadingOverlay open={isLoading} />
}
