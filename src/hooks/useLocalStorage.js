import { useState } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  function setValue(value) {
    try {
      const next = value instanceof Function ? value(storedValue) : value
      setStoredValue(next)
      localStorage.setItem(key, JSON.stringify(next))
    } catch (err) {
      console.error('localStorage write error:', err)
    }
  }

  return [storedValue, setValue]
}
