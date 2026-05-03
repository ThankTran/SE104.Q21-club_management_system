import { useState, useEffect, useRef } from 'react'

export default function useTyping(lines, speed = 60, start = false) {
  const [displayed, setDisplayed] = useState(lines.map(() => ''))
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)

  const prevStart = useRef(false)

  // ✅ Detect false → true
  useEffect(() => {
  if (start && !prevStart.current) {
    const t = setTimeout(() => {
      setDisplayed(lines.map(() => ''))
      setLineIdx(0)
      setCharIdx(0)
    }, 0)

    return () => clearTimeout(t)
  }

  prevStart.current = start
}, [start, lines])

  // Typing
  useEffect(() => {
    if (!start) return
    if (lineIdx >= lines.length) return

    if (charIdx < lines[lineIdx].length) {
      const t = setTimeout(() => {
        setDisplayed(prev => {
          const next = [...prev]
          next[lineIdx] = lines[lineIdx].slice(0, charIdx + 1)
          return next
        })
        setCharIdx(c => c + 1)
      }, speed)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => {
        setLineIdx(l => l + 1)
        setCharIdx(0)
      }, 120)
      return () => clearTimeout(t)
    }
  }, [start, lineIdx, charIdx, lines, speed])

  return {
    displayed,
    done: lineIdx >= lines.length,
    lineIdx,
  }
}