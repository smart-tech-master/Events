import {useEffect, useCallback, useRef} from 'react'

export function useInterval(callback: () => void, interval: number) {
  const isMountedRef = useRef(true)

  const update = useCallback(() => {
    if (!isMountedRef.current) {
      return
    }

    return callback()
  }, [callback])

  useEffect(() => {
    isMountedRef.current = true
    const timer = setInterval(update, interval)

    return () => {
      isMountedRef.current = false
      clearInterval(timer)
    }
  }, [update, interval])
}
