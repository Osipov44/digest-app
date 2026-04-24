import { useEffect } from 'react'

const tg = window.Telegram?.WebApp

export function useTelegram() {
  useEffect(() => {
    if (!tg) return
    tg.ready()
    tg.expand()
    tg.setHeaderColor('#17212b')
    tg.setBackgroundColor('#17212b')
  }, [])

  return {
    tg,
    user: tg?.initDataUnsafe?.user ?? null,
    isReady: !!tg,
    platform: tg?.platform ?? 'unknown',
  }
}
