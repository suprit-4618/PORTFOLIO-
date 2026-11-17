"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export type Dish = {
  /** The first title line, e.g. "CORE RUNTIME &". */
  title: string
  /** The heavy second title line, e.g. "PYTHON 3.11". */
  subtitle: string
  /** Tech disc or plate visual, ideally transparent SVG/PNG. */
  image: string
  alt?: string
  /** Eyebrow line above title. */
  eyebrow?: string
  /** Short label under thumbnail. */
  label?: string
  /** Engineering Domain / Discipline */
  domain?: string
  /** Key production metric, e.g. "< 35ms", "5-Min", "60 FPS", "< 50ms" */
  metricValue?: string
  /** Metric subtitle, e.g. "Inference Latency", "DAG Cadence", "WebGL Rate" */
  metricLabel?: string
  /** Real production project where this technology is deployed */
  projectBadge?: string
  /** In-depth technical architecture narrative */
  description?: string
  /** Toolchain packages, libraries, or competencies */
  ingredients?: string[]
  /** Accent color (hex/rgb) for morphing band and badges */
  accent: string

  // Optional backward compat
  rating?: number
  chef?: string
  kitchen?: string
  likes?: number
}

export type DomainGroup = {
  id: string
  label: string
  dishes: Dish[]
}

export type DishOrbitCarouselProps = {
  dishes?: Dish[]
  domains?: DomainGroup[]
  /** Root height. A definite length: percentages collapse on a host page. */
  height?: string
  /** Optional photo behind the display, e.g. a subtle grid or texture. */
  backdrop?: string
  /** Scroll forever both ways. */
  loop?: boolean
  /** Embedded display face. Pass null to use host font. */
  fontSrc?: string | null
  onPlay?: (dish: Dish, index: number) => void
  onOrder?: (dish: Dish, index: number) => void
  onChange?: (index: number) => void
  className?: string
  action1Label?: string
  action2Label?: string
  tab2Label?: string
}

// #region carousel helpers
export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0
  return ((Math.round(i) % n) + n) % n
}

export function stepDirection(from: number, to: number, n: number): 1 | -1 {
  if (n <= 0) return 1
  const fwd = (((to - from) % n) + n) % n
  return fwd <= n - fwd ? 1 : -1
}

export function scrollSteps(n: number, loop: boolean): number {
  return Math.max(0, loop ? n : n - 1)
}

export function segmentFor(i: number, current: number, n: number, loop: boolean): number {
  return loop && i === 0 && current > n / 2 ? n : i
}

export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0
  return Math.max(0, Math.min(index - 2, n - visible))
}

export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em))
}

export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45)
    const c = Math.cos(a)
    const s = Math.sin(a)
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1))
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1))
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z"
}

export const ARC_REST = [[48, 102], [44, 126], [58, 128], [38, 104], [50, 114]]
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length]
}

export const ARC_SWEEP = [36, 148]
// #endregion

const ORBIT_X = 300
const ORBIT_Y = -420
const ORBIT_R = 640
const SCROLL_PER_DISH = 0.22
const ITEM = 100
const VISIBLE = 5

const CSS =
  ".dsh-trk{position:relative;width:100%}" +
  ".dsh-root{position:sticky;top:0;overflow:hidden;width:100%;background:var(--color-background,#ffffff);color:var(--color-foreground,#09090b);" +
  "font-family:var(--font-sans,ui-sans-serif,sans-serif);container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  ".dsh-root *{box-sizing:border-box}" +
  ".dsh-bd{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;pointer-events:none}" +
  ".dsh-wash{position:absolute;inset:0;background:color-mix(in oklab,var(--color-background,#ffffff) 38%,transparent);pointer-events:none}" +
  ".dsh-dim{position:absolute;inset:0;background:var(--color-background,#ffffff);mix-blend-mode:multiply;opacity:.72;pointer-events:none}" +
  ".dsh-root:focus-visible{outline:2px solid var(--color-primary,#09090b);outline-offset:-4px}" +
  ".dsh-canvas{position:absolute;left:50%;top:50%;width:1040px;height:540px;transform:translate(-50%,-50%) scale(var(--dsh-s,1));transform-origin:50% 50%}" +
  ".dsh-arc{position:absolute;left:0;top:0;width:1040px;height:540px;overflow:visible;pointer-events:none}" +
  ".dsh-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer}" +
  ".dsh-btn:focus-visible{outline:2px solid var(--color-primary,#09090b);outline-offset:3px;border-radius:10px}" +
  
  /* Domain Navigator (replaces 32 raw dots) */
  ".dsh-domains{position:absolute;left:18px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;gap:9px;z-index:10;max-width:145px}" +
  ".dsh-dom-group{display:flex;flex-direction:column;align-items:flex-start;gap:5px}" +
  ".dsh-dom-btn{display:inline-flex;align-items:center;gap:7px;padding:6px 12px;border-radius:20px;font-size:11.5px;font-weight:700;letter-spacing:.03em;text-transform:uppercase;color:color-mix(in oklab,var(--color-foreground,#09090b) 68%,transparent);background:color-mix(in oklab,var(--color-foreground,#09090b) 5%,transparent);border:1px solid transparent;cursor:pointer;transition:all .22s cubic-bezier(.16,1,.3,1)}" +
  ".dsh-dom-btn:hover{background:color-mix(in oklab,var(--color-foreground,#09090b) 12%,transparent);color:var(--color-foreground,#09090b);transform:translateX(2px)}" +
  ".dsh-dom-btn.is-active{background:var(--color-foreground,#09090b);color:var(--color-background,#ffffff);border-color:var(--color-foreground,#09090b);box-shadow:0 4px 14px rgba(0,0,0,.15)}" +
  ".dsh-dom-indicator{width:6px;height:6px;border-radius:50%;background:currentColor;opacity:.6}" +
  ".dsh-dom-btn.is-active .dsh-dom-indicator{opacity:1}" +
  ".dsh-dom-label{font-size:11px}" +
  ".dsh-dom-count{font-size:9.5px;opacity:.65;font-family:monospace;margin-left:4px}" +
  ".dsh-dom-subdots{display:flex;align-items:center;gap:5px;padding-left:14px;padding-top:2px}" +
  ".dsh-subdot{width:6px;height:6px;border-radius:50%;background:var(--color-foreground,#09090b);opacity:.25;border:0;padding:0;cursor:pointer;transition:all .25s ease}" +
  ".dsh-subdot:hover{opacity:.7;transform:scale(1.2)}" +
  ".dsh-subdot.is-active{width:16px;border-radius:4px;opacity:1}" +

  /* Vertical Pager Dots fallback */
  ".dsh-pager{position:absolute;left:28px;top:50%;transform:translateY(-50%);display:flex;flex-direction:column;align-items:center;gap:3px;max-height:460px}" +
  ".dsh-dot{width:12px;height:7px;display:grid;place-items:center;padding:0}" +
  ".dsh-dot i{display:block;width:3px;height:3px;border-radius:3px;background:var(--color-foreground,#09090b);opacity:.3;transition:height .35s cubic-bezier(.16,1,.3,1),opacity .3s,background .3s}" +
  ".dsh-dot[aria-current] i{height:16px;opacity:1}" +
  ".dsh-dot[aria-current]{height:18px}" +

  /* Active Tech Disc Orbit Stage */
  ".dsh-plates{position:absolute;left:180px;top:50px;width:270px;height:270px;touch-action:pan-y}" +
  ".dsh-orbit{position:absolute;inset:0;display:none;align-items:center;justify-content:center;transform-origin:50% 50%;visibility:hidden;opacity:0;will-change:transform,opacity}" +
  ".dsh-orbit>img{display:block;width:270px;height:270px;max-width:none;object-fit:contain;user-select:none;-webkit-user-drag:none;" +
  "filter:drop-shadow(0 20px 35px rgba(0,0,0,.22)) drop-shadow(0 4px 12px rgba(0,0,0,.12))}" +

  /* Two-Weight Headings */
  ".dsh-head{position:absolute;left:475px;top:90px;width:530px;height:180px}" +
  ".dsh-hd{position:absolute;inset:0;display:none;visibility:hidden;opacity:0}" +
  ".dsh-t1,.dsh-t2{display:block;white-space:nowrap;line-height:1.05;text-transform:uppercase;margin:0;font-family:var(--font-display,var(--font-sans,sans-serif))}" +
  ".dsh-t1{font-weight:200;letter-spacing:-.015em;margin-top:4px;opacity:.88}" +
  ".dsh-t2{font-weight:800;letter-spacing:-.035em;margin-top:8px;color:var(--color-foreground,#09090b)}" +

  /* Thumbnail Strip at Bottom */
  ".dsh-strip{position:absolute;left:56%;transform:translateX(-50%);top:370px;width:660px;height:120px;display:flex;align-items:center;justify-content:center}" +
  ".dsh-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none;border-radius:10px;background:color-mix(in oklab,var(--color-foreground,#09090b) 5%,transparent);transition:background .2s}" +
  ".dsh-arrow:hover{background:color-mix(in oklab,var(--color-foreground,#09090b) 10%,transparent)}" +
  ".dsh-arrow svg{width:12px;height:16px;fill:currentColor}" +
  ".dsh-win{position:relative;width:" + (ITEM * VISIBLE) + "px;height:120px;overflow:hidden;flex:none;margin:0 8px;" +
  "-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}" +
  ".dsh-track{position:absolute;left:0;top:0;display:flex;transition:transform .5s cubic-bezier(.16,1,.3,1)}" +
  ".dsh-th{width:" + ITEM + "px;height:120px;display:flex;justify-content:center;padding-top:3px}" +
  ".dsh-th .dsh-btn{width:86px;height:114px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:8px;padding-top:10px;" +
  "border:1px solid transparent;transition:all .35s ease}" +
  ".dsh-th .dsh-btn[aria-current]{background:color-mix(in oklab,var(--color-background,#ffffff) 75%,transparent);box-shadow:0 8px 24px -8px rgba(0,0,0,.2)}" +
  ".dsh-th img{width:48px;height:48px;max-width:none;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.15));transition:transform .35s ease}" +
  ".dsh-th .dsh-btn[aria-current] img{transform:scale(1.1)}" +
  ".dsh-th span{font-size:10.5px;line-height:1.2;text-align:center;font-weight:600;color:var(--color-foreground,#09090b);opacity:.85;max-width:82px}" +
  ".dsh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +

  ".dsh-mobile-nav{display:none;align-items:center;justify-content:center;gap:16px;margin-top:14px;z-index:20}" +
  ".dsh-mobile-arrow{display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:50%;background:color-mix(in oklab,var(--color-foreground,#09090b) 8%,transparent);border:1px solid color-mix(in oklab,var(--color-foreground,#09090b) 14%,transparent);color:var(--color-foreground,#09090b);font-size:14px;cursor:pointer;transition:all .18s ease}" +
  ".dsh-mobile-arrow:active{transform:scale(0.92);background:color-mix(in oklab,var(--color-foreground,#09090b) 16%,transparent)}" +
  ".dsh-mobile-counter{font-family:ui-monospace,monospace;font-size:12px;font-weight:700;letter-spacing:.08em;color:var(--color-foreground,#09090b);opacity:.75}" +

  /* Mobile Responsive for both Container and Viewport Queries */
  "@media (max-width:768px), @container (max-width:768px){" +
  ".dsh-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:16px 10px}" +
  ".dsh-arc{width:200%;height:auto;left:-50%;top:-20px}" +
  ".dsh-domains{position:relative;left:auto;top:auto;transform:none;flex-direction:row;overflow-x:auto;max-width:100%;width:100%;padding:4px 6px;gap:6px;margin-bottom:12px;-webkit-overflow-scrolling:touch}" +
  ".dsh-dom-subdots{display:none}" +
  ".dsh-pager{display:none}" +
  ".dsh-plates{position:relative;left:auto;top:auto;width:min(68vw,240px);height:min(68vw,240px);margin:0 auto}" +
  ".dsh-orbit>img{width:100%;height:100%}" +
  ".dsh-head{position:relative;left:auto;top:auto;width:100%;height:auto;margin:16px 0 6px 0;text-align:center}" +
  ".dsh-t1,.dsh-t2{white-space:normal;text-align:center}" +
  ".dsh-strip{display:none}" +
  ".dsh-mobile-nav{display:flex}" +
  "}"

export function DishOrbitCarousel({
  dishes: propDishes,
  domains,
  height = "88vh",
  backdrop,
  loop = false,
  fontSrc = null,
  onChange,
  className,
}: DishOrbitCarouselProps) {
  const [domainIdx, setDomainIdx] = useState(0)
  const dishes = domains && domains.length > 0 ? domains[domainIdx].dishes : (propDishes || [])
  const n = dishes.length
  const [index, setIndex] = useState(0)

  const trackRef = useRef<HTMLDivElement | null>(null)
  const rootRef = useRef<HTMLDivElement | null>(null)
  const stRef = useRef<ScrollTrigger | null>(null)
  const segRef = useRef(0)
  const indexRef = useRef(0)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const orbits = useRef<(HTMLDivElement | null)[]>([])
  const heads = useRef<(HTMLDivElement | null)[]>([])
  const arcRef = useRef<SVGPathElement | null>(null)
  const arc = useRef({ a0: 0, a1: 0 })
  const shown = useRef(-1)
  const dirRef = useRef<1 | -1>(1)
  const tlRef = useRef<gsap.core.Timeline | null>(null)
  const isNavigatingRef = useRef(false)
  const swipe = useRef<{ x: number; y: number } | null>(null)

  const handleSelectDomain = (nextDom: number) => {
    if (nextDom === domainIdx || !domains) return
    setDomainIdx(nextDom)
    setIndex(0)
    indexRef.current = 0
    segRef.current = 0
    shown.current = -1
    const st = stRef.current
    if (st) {
      st.scroll(st.start)
    }
  }

  // Sync GSAP ScrollTrigger with global Lenis smooth scroll
  useEffect(() => {
    const w = window as unknown as { lenis?: { on?: (event: string, cb: () => void) => void; off?: (event: string, cb: () => void) => void } }
    if (w.lenis && typeof w.lenis.on === "function") {
      const onScroll = () => ScrollTrigger.update()
      w.lenis.on("scroll", onScroll)
      return () => {
        w.lenis?.off?.("scroll", onScroll)
      }
    }
  }, [])

  // Fit the design canvas to the root container measured on resize
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      el.style.setProperty("--dsh-s", String(Math.min(w / 1040, h / 540, 1.45)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // Core Slide & Orbital Animation with Strict Anti-Ghosting
  useLayoutEffect(() => {
    const from = shown.current
    const to = index

    const parts = (i: number) => {
      const head = heads.current[i]
      return {
        orbit: orbits.current[i],
        head,
        t1: head ? head.querySelector(".dsh-t1") : null,
        t2: head ? head.querySelector(".dsh-t2") : null,
      }
    }

    const drawArc = () => arcRef.current?.setAttribute("d", arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 120))
    const rest = arcRest(to)
    const tint = dishes[to] ? dishes[to].accent : "transparent"

    // Stop and kill any in-flight timeline
    if (tlRef.current) {
      tlRef.current.kill()
      tlRef.current = null
    }

    // STRICT CLEANUP: Hide all non-participating elements immediately
    for (let i = 0; i < n; i++) {
      if (i !== from && i !== to) {
        const p = parts(i)
        if (p.orbit) {
          gsap.killTweensOf(p.orbit)
          gsap.set(p.orbit, { autoAlpha: 0, display: "none" })
        }
        if (p.head) {
          gsap.killTweensOf(p.head)
          gsap.set(p.head, { autoAlpha: 0, display: "none" })
        }
      }
    }

    const b = parts(to)

    // Initial mount or re-selection of the same index
    if (from === -1 || from === to) {
      for (let i = 0; i < n; i++) {
        if (i !== to) {
          const p = parts(i)
          if (p.orbit) gsap.set(p.orbit, { autoAlpha: 0, display: "none" })
          if (p.head) gsap.set(p.head, { autoAlpha: 0, display: "none" })
        }
      }
      if (b.orbit) gsap.set(b.orbit, { autoAlpha: 1, display: "flex", x: 0, y: 0, rotation: 0, scale: 1 })
      if (b.head) gsap.set(b.head, { autoAlpha: 1, display: "block", x: 0, y: 0 })
      if (b.t1) gsap.set(b.t1, { autoAlpha: 1, x: 0 })
      if (b.t2) gsap.set(b.t2, { autoAlpha: 1, x: 0 })

      arc.current.a0 = rest[0]
      arc.current.a1 = rest[1]
      drawArc()
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint })
      shown.current = to
      isNavigatingRef.current = false
      return
    }

    const a = parts(from)
    const d = dirRef.current

    // Set display for animating items
    if (a.orbit) gsap.set(a.orbit, { display: "flex" })
    if (a.head) gsap.set(a.head, { display: "block" })
    if (b.orbit) gsap.set(b.orbit, { display: "flex", autoAlpha: 0 })
    if (b.head) gsap.set(b.head, { display: "block", autoAlpha: 0 })

    const tl = gsap.timeline({
      onComplete: () => {
        // Once slide completes, hide `a` completely
        if (a.orbit) gsap.set(a.orbit, { autoAlpha: 0, display: "none" })
        if (a.head) gsap.set(a.head, { autoAlpha: 0, display: "none" })

        // Ensure `b` is fully settled
        if (b.orbit) gsap.set(b.orbit, { autoAlpha: 1, display: "flex", x: 0, y: 0, rotation: 0, scale: 1 })
        if (b.head) gsap.set(b.head, { autoAlpha: 1, display: "block", x: 0, y: 0 })

        tlRef.current = null
        isNavigatingRef.current = false
      },
    })
    tlRef.current = tl

    // 1. VISIBLE HORIZONTAL SLIDE FOR TECH DISCS
    if (a.orbit) {
      tl.to(
        a.orbit,
        {
          x: -270 * d,
          rotation: -22 * d,
          scale: 0.72,
          autoAlpha: 0,
          duration: 0.42,
          ease: "power2.in",
        },
        0
      )
    }

    if (b.orbit) {
      tl.fromTo(
        b.orbit,
        {
          x: 280 * d,
          rotation: 24 * d,
          scale: 0.72,
          autoAlpha: 0,
        },
        {
          x: 0,
          rotation: 0,
          scale: 1,
          autoAlpha: 1,
          duration: 0.72,
          ease: "power3.out",
        },
        0.12
      )
    }

    // 2. TITLE SLIDE WIPE
    if (a.head) {
      tl.to(a.head, { x: -35 * d, autoAlpha: 0, duration: 0.28, ease: "power2.in" }, 0)
        .set(a.head, { display: "none" }, 0.28)
    }

    if (b.head) {
      tl.fromTo(
        b.head,
        { x: 45 * d, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: 0.58, ease: "power3.out" },
        0.24
      )
    }

    // 3. PASTEL ACCENT BAND COLOR MORPH
    tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.42, ease: "power2.inOut", onUpdate: drawArc }, 0)
      .to(arc.current, { a0: rest[0], a1: rest[1], duration: 0.65, ease: "power3.out", onUpdate: drawArc }, 0.4)
    if (arcRef.current) tl.to(arcRef.current, { fill: tint, duration: 0.7, ease: "power1.inOut" }, 0.08)

    shown.current = to
  }, [index, n, dishes, domainIdx])

  useEffect(() => () => { tlRef.current?.kill() }, [])

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return
    dirRef.current = dir
    indexRef.current = next
    setIndex(next)
    onChangeRef.current?.(next)
  }

  // Scroll snapping drive
  const steps = scrollSteps(n, loop)
  useEffect(() => {
    const track = trackRef.current
    if (!track || steps < 1) return
    const trigger = ScrollTrigger.create({
      trigger: track,
      start: "top top",
      end: "bottom bottom",
      snap: { snapTo: 1 / steps, duration: { min: 0.3, max: 0.8 }, delay: 0.08, ease: "power2.inOut" },
      onUpdate: (self) => {
        if (isNavigatingRef.current) return
        if (loop && self.progress >= 1 && self.direction > 0) {
          segRef.current = 0
          self.scroll(self.start + 1)
          select(0, 1)
          return
        }
        const seg = Math.round(self.progress * steps)
        if (seg === segRef.current) return
        const dir = seg > segRef.current ? 1 : -1
        segRef.current = seg
        select(wrapIndex(seg, n), dir)
      },
    })

    let raf = 0
    const onWheel = (e: WheelEvent) => {
      const y = trigger.scroll()
      if (!loop || e.deltaY >= 0 || y < trigger.start - 1 || y > trigger.start + 1) return
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        segRef.current = n - 1
        trigger.scroll(trigger.start + ((trigger.end - trigger.start) * (n - 1)) / steps)
        select(n - 1, -1)
      })
    }
    window.addEventListener("wheel", onWheel, { passive: true })
    stRef.current = trigger
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener("wheel", onWheel)
      trigger.kill()
      stRef.current = null
    }
  }, [steps, loop, n, domainIdx])

  // Programmatic jump with smooth slide animation guarantee
  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return
    const next = wrapIndex(to, n)
    if (next === index) return
    const d = dir ?? stepDirection(index, next, n)
    isNavigatingRef.current = true
    select(next, d)
    const st = stRef.current
    if (st) {
      const seg = segmentFor(next, segRef.current, n, loop)
      segRef.current = seg
      st.scroll(st.start + ((st.end - st.start) * seg) / steps)
    }
    setTimeout(() => {
      isNavigatingRef.current = false
    }, 750)
  }

  const step = (d: 1 | -1) => go(index + d, d)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
  }

  const onPointerDown = (e: React.PointerEvent) => { swipe.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1)
  }

  const start = stripStart(index, n, VISIBLE)
  const currentDish = dishes[index]

  return (
    <div
      ref={trackRef}
      className={"dsh-trk" + (className ? " " + className : "")}
      style={{ height: "calc(" + height + " * " + (1 + steps * SCROLL_PER_DISH) + ")" }}
    >
      <div
        ref={rootRef}
        className="dsh-root"
        style={{ height }}
        role="region"
        aria-roledescription="carousel"
        aria-label="Technologies"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        <style>
          {(fontSrc ? "@font-face{font-family:dsh-face;src:url(" + fontSrc + ") format('woff2');font-weight:100 900;font-display:swap}" : "") + CSS}
        </style>

        {backdrop ? <img className="dsh-bd" src={backdrop} alt="" width={1200} height={900} /> : null}
        {backdrop ? <div className="dsh-dim" /> : null}
        {backdrop ? <div className="dsh-wash" /> : null}

        <div className="dsh-canvas">
          {/* Morphing colored background arc */}
          <svg className="dsh-arc" viewBox="0 0 1040 540" aria-hidden="true">
            <path ref={arcRef} style={{ opacity: 0.32 }} />
          </svg>

          {/* Domain Navigator (organized by domain) or fallback dots */}
          {domains && domains.length > 0 ? (
            <div className="dsh-domains" role="tablist" aria-label="Technology Domains">
              {domains.map((dom, domIdx) => {
                const isDomActive = domIdx === domainIdx;
                return (
                  <div key={dom.id || domIdx} className="dsh-dom-group">
                    <button
                      type="button"
                      role="tab"
                      aria-selected={isDomActive}
                      className={`dsh-btn dsh-dom-btn ${isDomActive ? "is-active" : ""}`}
                      onClick={() => handleSelectDomain(domIdx)}
                    >
                      <span className="dsh-dom-indicator" style={isDomActive ? { background: currentDish?.accent || "#B96846" } : {}} />
                      <span className="dsh-dom-label">{dom.label}</span>
                      <span className="dsh-dom-count">{dom.dishes.length}</span>
                    </button>

                    {isDomActive && (
                      <div className="dsh-dom-subdots" role="tablist" aria-label={`${dom.label} tools`}>
                        {dom.dishes.map((subDish, dotIdx) => (
                          <button
                            key={dotIdx}
                            type="button"
                            role="tab"
                            aria-selected={dotIdx === index}
                            className={`dsh-btn dsh-subdot ${dotIdx === index ? "is-active" : ""}`}
                            style={dotIdx === index ? { background: subDish.accent } : {}}
                            onClick={() => go(dotIdx)}
                            title={subDish.label || subDish.subtitle}
                            aria-label={subDish.label || subDish.subtitle}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dsh-pager" role="tablist" aria-label="Select a technology">
              {dishes.map((d, i) => (
                <button
                  key={i}
                  type="button"
                  role="tab"
                  className="dsh-btn dsh-dot"
                  aria-selected={i === index}
                  aria-current={i === index ? "true" : undefined}
                  aria-label={d.title + " " + d.subtitle}
                  onClick={() => go(i)}
                >
                  <i style={i === index ? { background: d.accent } : {}} />
                </button>
              ))}
            </div>
          )}

          {/* Active Tech Discs with GSAP Horizontal Slide Animation */}
          <div
            className="dsh-plates"
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
            onPointerCancel={() => (swipe.current = null)}
          >
            {dishes.map((d, i) => (
              <div
                key={i}
                ref={(el) => { orbits.current[i] = el }}
                className="dsh-orbit"
                style={{ display: i === index ? "flex" : "none" }}
                aria-hidden={i !== index}
              >
                <img
                  src={d.image}
                  alt={d.alt ?? d.title + " " + d.subtitle}
                  width={280}
                  height={280}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Clean, Bold Two-Weight Headings (No Eyebrow) */}
          <div className="dsh-head" aria-live="polite">
            {dishes.map((d, i) => (
              <div
                key={i}
                ref={(el) => { heads.current[i] = el }}
                className="dsh-hd"
                style={{ display: i === index ? "block" : "none" }}
                aria-hidden={i !== index}
              >
                <h2 style={{ margin: 0, font: "inherit" }}>
                  <span className="dsh-t1" style={{ fontSize: fitSize(d.title.length, 42, 520, 0.55) + "px" }}>
                    {d.title}
                  </span>
                  <span className="dsh-t2" style={{ fontSize: fitSize(d.subtitle.length, 58, 520, 0.6) + "px" }}>
                    {d.subtitle}
                  </span>
                </h2>
              </div>
            ))}
          </div>

          {/* Dedicated Touch Navigation for Mobile Screens */}
          <div className="dsh-mobile-nav">
            <button
              type="button"
              className="dsh-mobile-arrow"
              aria-label="Previous technology"
              onClick={() => step(-1)}
            >
              ◀
            </button>
            <span className="dsh-mobile-counter">
              {index + 1} / {n}
            </span>
            <button
              type="button"
              className="dsh-mobile-arrow"
              aria-label="Next technology"
              onClick={() => step(1)}
            >
              ▶
            </button>
          </div>

          {/* Centered Bottom Thumbnails Navigation Strip */}
          <div className="dsh-strip">
            <button
              type="button"
              className="dsh-btn dsh-arrow"
              aria-label="Previous technology"
              onClick={() => step(-1)}
            >
              <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M11 0v16L0 8z" /></svg>
            </button>
            <div className="dsh-win">
              <div
                className="dsh-track"
                style={{ transform: "translateX(" + -start * ITEM + "px)" }}
              >
                {dishes.map((d, i) => (
                  <div key={i} className="dsh-th">
                    <button
                      type="button"
                      className="dsh-btn"
                      aria-current={i === index ? "true" : undefined}
                      style={i === index ? { borderColor: `${d.accent}88`, boxShadow: `0 6px 20px ${d.accent}30` } : {}}
                      onClick={() => go(i)}
                    >
                      <img src={d.image} alt="" width={48} height={48} draggable={false} />
                      <span>{d.label ?? d.subtitle}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <button
              type="button"
              className="dsh-btn dsh-arrow"
              aria-label="Next technology"
              onClick={() => step(1)}
            >
              <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 0v16l11-8z" /></svg>
            </button>
          </div>

        </div>

        <p className="dsh-sr" aria-live="polite">
          {currentDish ? "Technology " + (index + 1) + " of " + n + ": " + currentDish.title + " " + currentDish.subtitle : ""}
        </p>
      </div>
    </div>
  )
}

export default DishOrbitCarousel
