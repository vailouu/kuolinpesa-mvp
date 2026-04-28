'use client'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { supabase } from '../supabase'

const JULKISET_REITIT = new Set([
  '/', '/kirjaudu', '/aloita', '/valitse',
  '/miten-toimii', '/ukk', '/hinnat', '/ota-yhteytta',
  '/tietosuoja', '/kayttoehdot', '/unohdin-salasanani', '/vaihda-salasana',
])

export default function SessionWatcher() {
  const router = useRouter()
  const pathname = usePathname()
  const pathnameRef = useRef(pathname)
  const oliKirjautunut = useRef(false)

  useEffect(() => {
    pathnameRef.current = pathname
  }, [pathname])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) oliKirjautunut.current = true
      if (event === 'SIGNED_OUT' && oliKirjautunut.current) {
        oliKirjautunut.current = false
        if (!JULKISET_REITIT.has(pathnameRef.current)) {
          router.push('/kirjaudu?syy=istunto')
        }
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  return null
}
