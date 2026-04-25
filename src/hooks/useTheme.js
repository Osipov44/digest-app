import { useEffect, useState } from 'react'
import { useLocalStorage } from './useLocalStorage'

// Moscow = UTC+3
function getMskHour() {
  return (new Date().getUTCHours() + 3) % 24
}

function resolveAuto() {
  const h = getMskHour()
  return h >= 7 && h < 22 ? 'light' : 'dark'
}

export function useTheme() {
  const [mode, setMode] = useLocalStorage('digest:theme', 'auto')
  const [resolved, setResolved] = useState(() =>
    mode === 'auto' ? resolveAuto() : mode
  )

  useEffect(() => {
    const next = mode === 'auto' ? resolveAuto() : mode
    setResolved(next)
    document.documentElement.setAttribute('data-theme', next)
  }, [mode])

  // Re-check auto every minute (theme can switch during use)
  useEffect(() => {
    if (mode !== 'auto') return
    const id = setInterval(() => {
      const next = resolveAuto()
      setResolved(next)
      document.documentElement.setAttribute('data-theme', next)
    }, 60_000)
    return () => clearInterval(id)
  }, [mode])

  return { mode, setMode, resolved }
}
