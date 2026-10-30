import { useEffect, useRef } from 'react'
import styles from './MatrixRain.module.css'

const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ<>/{}[]=+*'
const CELL = 16
const FRAME_MS = 1000 / 30
const TICK_MIN_MS = 50
const TICK_MAX_MS = 120
const RESTART_MIN_MS = 1500
const RESTART_MAX_MS = 4000
const FADE_ALPHA = 0.1

type Stream = {
  head: number // row of the next character to draw
  interval: number // ms between ticks for this column
  nextTick: number // timestamp of the next tick
  restartAt: number | null // set once the head passes the bottom
}

const random = (min: number, max: number) => min + Math.random() * (max - min)

function createStream(rows: number, now: number): Stream {
  return {
    head: -Math.floor(Math.random() * (rows + 1)), // in [-rows, 0] so the rain fades in
    interval: random(TICK_MIN_MS, TICK_MAX_MS),
    nextTick: now,
    restartAt: null,
  }
}

type Props = { running: boolean }

// Decorative "digital rain" behind the hero (DESIGN.md §4.2.1).
export function MatrixRain({ running }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const setRunningRef = useRef<(running: boolean) => void>(() => {})

  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !hero || !ctx) return

    const rootStyle = getComputedStyle(document.documentElement)
    const bg = rootStyle.getPropertyValue('--bg').trim()
    const accent = rootStyle.getPropertyValue('--accent').trim()

    let width = 0
    let height = 0
    let rows = 0
    let streams: Stream[] = []

    let fontsReady = false
    let intersecting = true
    let paused = false
    let frame = 0
    let lastFrame = 0
    let stoppedAt: number | null = null

    function resizeBackingStore() {
      const dpr = window.devicePixelRatio || 1
      canvas!.width = Math.round(width * dpr)
      canvas!.height = Math.round(height * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx!.font = `${CELL}px 'JetBrains Mono', monospace`
      ctx!.textBaseline = 'top'
    }

    function measure() {
      const nextWidth = canvas!.clientWidth
      const nextHeight = canvas!.clientHeight
      if (nextWidth === width && nextHeight === height) return
      const columnsChanged = Math.ceil(nextWidth / CELL) !== streams.length
      width = nextWidth
      height = nextHeight
      rows = Math.ceil(height / CELL)
      resizeBackingStore()
      if (columnsChanged) {
        const now = performance.now()
        streams = Array.from({ length: Math.ceil(width / CELL) }, () => createStream(rows, now))
      }
    }

    function draw(now: number) {
      ctx!.globalAlpha = FADE_ALPHA
      ctx!.fillStyle = bg
      ctx!.fillRect(0, 0, width, height)
      ctx!.globalAlpha = 1

      streams.forEach((stream, column) => {
        const x = column * CELL
        if (stream.restartAt !== null) {
          if (now < stream.restartAt) return
          // Hard-clear the column to remove faint ghosts left by 8-bit alpha rounding.
          ctx!.fillStyle = bg
          ctx!.fillRect(x, 0, CELL, height)
          stream.head = 0
          stream.restartAt = null
          stream.nextTick = now
        }
        if (now < stream.nextTick) return
        stream.nextTick = now + stream.interval
        if (stream.head >= 0) {
          ctx!.fillStyle = accent
          ctx!.fillText(CHARS[Math.floor(Math.random() * CHARS.length)], x, stream.head * CELL)
        }
        stream.head += 1
        if (stream.head > rows) stream.restartAt = now + random(RESTART_MIN_MS, RESTART_MAX_MS)
      })
    }

    function loop(now: number) {
      frame = requestAnimationFrame(loop)
      // Small tolerance so rAF timestamp jitter on 60Hz displays doesn't drop us to 20fps.
      if (now - lastFrame < FRAME_MS - 2) return
      lastFrame = now
      draw(now)
    }

    function shouldRun() {
      return fontsReady && intersecting && !paused && !document.hidden
    }

    // Start or stop the loop. On resume, shift every timer by the time spent
    // stopped so streams continue exactly where they left off.
    function update() {
      const run = shouldRun()
      if (run && !frame) {
        if (stoppedAt !== null) {
          const elapsed = performance.now() - stoppedAt
          for (const stream of streams) {
            stream.nextTick += elapsed
            if (stream.restartAt !== null) stream.restartAt += elapsed
          }
          stoppedAt = null
        }
        frame = requestAnimationFrame(loop)
      } else if (!run && frame) {
        cancelAnimationFrame(frame)
        frame = 0
        stoppedAt = performance.now()
      }
    }

    setRunningRef.current = (running) => {
      paused = !running
      update()
    }

    measure()
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(hero)

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      intersecting = entry.isIntersecting
      update()
    })
    intersectionObserver.observe(hero)

    document.addEventListener('visibilitychange', update)

    let disposed = false
    document.fonts.ready.then(() => {
      if (disposed) return
      fontsReady = true
      ctx.font = `${CELL}px 'JetBrains Mono', monospace`
      update()
    })

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      intersectionObserver.disconnect()
      document.removeEventListener('visibilitychange', update)
      setRunningRef.current = () => {}
    }
  }, [])

  useEffect(() => {
    setRunningRef.current(running)
  }, [running])

  return <canvas ref={canvasRef} className={styles.canvas} aria-hidden="true" />
}
