"use client"

import * as React from "react"

/**
 * Glass Folder Cards — a folder you can actually use, drawn as an object.
 *
 * Three layers, back to front: a back panel holding a piece of artwork, the
 * files the folder contains, and a frosted-glass front panel that blurs
 * whatever sits behind it. Nothing is a picture of a folder; the files are
 * real elements between real panels, so the glass frosts them as they move.
 *
 * - **Rest**: flat and closed. The tops of the files only just show.
 * - **Hover / focus**: the front panel leans toward you on its bottom hinge
 *   and the files lift a little out of the pocket.
 * - **Open** (click, Enter, Space): the panel falls further forward and the
 *   files rise out and fan, each one a button with its name on it.
 * - **Add** (`+`): a new file drops into the folder, the pocket gives a little
 *   under it, and the count rolls over.
 * - **More** (`···`): a frosted menu you can drive from the keyboard.
 *
 * The artwork is generated, not fetched: a domain-warped noise field shaded
 * as a liquid surface, painted once per recipe into a canvas over a few
 * frames and shared between every folder that uses it. Supply `image` to use
 * a picture of your own instead.
 *
 * Self-contained: React is the only import. No CSS file, no images, no fonts.
 */

export type ArtPreset = "aurora" | "ember" | "dusk" | "glacier" | "verdant"

export type ArtRecipe = {
  /** `marble` folds the colours through each other; `streak` pulls them into a long exposure. */
  style: "marble" | "streak"
  /** Two or more colours, in the order they appear through the field. */
  colors: string[]
  /** Size of the forms. Lower is larger and calmer. */
  scale?: number
  /** How hard the field folds into itself. */
  warp?: number
  /** Direction of the flow, in radians. */
  angle?: number
  /** Specular highlight on the liquid surface, 0–1. */
  gloss?: number
  /** Dark veins along the folds, 0–1. */
  veins?: number
}

export type FolderArt = ArtPreset | ArtRecipe | "none"

export type FolderFile = {
  name: string
  /** A short second line: a size, a date, a kind. */
  meta?: string
  /** Makes the file a picture: a generated artwork… */
  art?: ArtPreset | ArtRecipe
  /** …or an image of your own. Without either, the file is a sheet of paper. */
  image?: string
  /** Rendered as a link when the folder is open. */
  href?: string
  /** Authentic technology icon */
  icon?: React.ReactNode
}

export type FolderMenuItem = {
  label: string
  onSelect?: () => void
  /** Drawn in red, for the one you would want to think twice about. */
  danger?: boolean
}

export type GlassFolderProps = {
  label?: string
  /** The second line. Defaults to the number of files, which rolls as you add. */
  meta?: string
  /** `light` is milk glass, `dark` is smoked glass. */
  tone?: "light" | "dark"
  /** What the back panel holds. A preset, your own recipe, or `none` for a plain frosted back. */
  art?: FolderArt
  /** A different arrangement of the same recipe. */
  seed?: number
  /** Your own picture for the back panel, instead of generated art. */
  image?: string
  /** The folder's contents. Read once; after that the folder owns the list. */
  files?: FolderFile[]
  /** Maximum number of files visible in the stack. Defaults to all files. */
  maxVisible?: number
  /** `add` drops new files in, `more` opens a menu, `none` hides the key. */
  action?: "add" | "more" | "none"
  /** What `add` puts in the folder. Return nothing for an "Untitled" sheet. */
  onAdd?: (files: FolderFile[]) => FolderFile | void
  onFilesChange?: (files: FolderFile[]) => void
  /** Items for the `more` menu. An Open / Close item is always first. */
  menu?: FolderMenuItem[]
  /** Where the label sits on the front panel. */
  labelPlacement?: "bottom-left" | "top-left" | "top-right"
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  /** Called when a file is chosen while the folder is open. */
  onFileSelect?: (file: FolderFile, index: number) => void
  /** Width in px. Everything else scales with it; the height is 0.96 × width. */
  width?: number
  /** Assemble itself the first time it scrolls into view. */
  appear?: boolean
  /** Delay before that entrance, in ms — for staggering a row of folders. */
  appearDelay?: number
  className?: string
  style?: React.CSSProperties
}

// #region art
export const ART_PRESETS: Record<ArtPreset, ArtRecipe> = {
  // a long exposure: blush, oxblood and steel pulled across the frame
  aurora: {
    style: "streak",
    colors: ["#f4efe9", "#e9c2b8", "#c2433f", "#2a1e2a", "#22395e", "#6f97c2", "#e5edf4"],
    scale: 0.7,
    warp: 1.4,
    angle: -0.62,
    gloss: 0.18,
    veins: 0,
  },
  // red ink folding through teal-black water
  ember: {
    style: "marble",
    colors: ["#07090c", "#16252c", "#3d5f68", "#1a1416", "#a3201a", "#ef4a2b", "#ff8a5c"],
    scale: 0.62,
    warp: 3.2,
    angle: -0.5,
    gloss: 0.55,
    veins: 0.6,
  },
  // plum and rust, swirled
  dusk: {
    style: "marble",
    colors: ["#120c18", "#3e2850", "#8f6c9c", "#2b1a24", "#b3502f", "#eab08a", "#fbe7d2"],
    scale: 0.75,
    warp: 3.6,
    angle: 0.8,
    gloss: 0.5,
    veins: 0.5,
  },
  // cold, pale, nearly white
  glacier: {
    style: "streak",
    colors: ["#f7f8fa", "#d9e2ea", "#9fb4c7", "#e8edf2", "#bccbd8", "#ffffff"],
    scale: 0.7,
    warp: 1.6,
    angle: 0.35,
    gloss: 0.25,
    veins: 0,
  },
  // moss and brass
  verdant: {
    style: "marble",
    colors: ["#070b08", "#173024", "#4f7a5a", "#141812", "#a7843a", "#e9cf87", "#fbf3d6"],
    scale: 0.7,
    warp: 3.4,
    angle: 2.1,
    gloss: 0.5,
    veins: 0.5,
  },
}

/** `#rgb` or `#rrggbb` to a triple. Anything unreadable comes back mid-grey. */
export function hexToRgb(hex: string): [number, number, number] {
  let h = hex.trim().replace(/^#/, "")
  if (h.length === 3) h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2]
  const n = /^[0-9a-f]{6}$/i.test(h) ? parseInt(h, 16) : 0x808080
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

/** A small, fast, seedable PRNG (mulberry32). */
export function rng(seed: number): () => number {
  let a = seed >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = a
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** A stable small integer for a string, so a file's art follows its name. */
export function hashString(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619)
  return h >>> 0
}

/** Seeded gradient noise, summed into fractal octaves with a rotation between each. */
function makeFbm(seed: number): (x: number, y: number, octaves: number) => number {
  const r = rng(seed)
  const perm = new Uint8Array(512)
  const grad = new Float32Array(512)
  const p: number[] = []
  for (let i = 0; i < 256; i++) p.push(i)
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    const t = p[i]
    p[i] = p[j]
    p[j] = t
  }
  for (let i = 0; i < 256; i++) {
    perm[i] = p[i]
    perm[i + 256] = p[i]
    const a = r() * Math.PI * 2
    grad[i * 2] = Math.cos(a)
    grad[i * 2 + 1] = Math.sin(a)
    grad[(i + 256) * 2] = grad[i * 2]
    grad[(i + 256) * 2 + 1] = grad[i * 2 + 1]
  }

  const noise2d = (x: number, y: number): number => {
    const X = Math.floor(x) & 255
    const Y = Math.floor(y) & 255
    const xf = x - Math.floor(x)
    const yf = y - Math.floor(y)
    const u = xf * xf * xf * (xf * (xf * 6 - 15) + 10)
    const v = yf * yf * yf * (yf * (yf * 6 - 15) + 10)

    const g00 = perm[X + perm[Y]] * 2
    const g10 = perm[X + 1 + perm[Y]] * 2
    const g01 = perm[X + perm[Y + 1]] * 2
    const g11 = perm[X + 1 + perm[Y + 1]] * 2

    const d00 = grad[g00] * xf + grad[g00 + 1] * yf
    const d10 = grad[g10] * (xf - 1) + grad[g10 + 1] * yf
    const d01 = grad[g01] * xf + grad[g01 + 1] * (yf - 1)
    const d11 = grad[g11] * (xf - 1) + grad[g11 + 1] * (yf - 1)

    const x1 = d00 + u * (d10 - d00)
    const x2 = d01 + u * (d11 - d01)
    return x1 + v * (x2 - x1)
  }

  // Golden ratio angle rotation between octaves spreads frequencies evenly
  const C = Math.cos(2.39996)
  const S = Math.sin(2.39996)

  return (x: number, y: number, octaves: number): number => {
    let sum = 0
    let amp = 0.5
    let freq = 1.0
    let nx = x
    let ny = y
    for (let o = 0; o < octaves; o++) {
      sum += amp * noise2d(nx * freq, ny * freq)
      const tx = C * nx - S * ny
      ny = S * nx + C * ny
      nx = tx
      amp *= 0.5
      freq *= 2.02
    }
    return sum
  }
}

/** Pre-interpolate the colour palette into a 256-entry lookup table. */
function buildPaletteLut(colors: string[]): Uint8Array {
  const lut = new Uint8Array(256 * 3)
  const rgb = colors.map(hexToRgb)
  const stops = rgb.length
  for (let i = 0; i < 256; i++) {
    const t = i / 255
    const pos = t * (stops - 1)
    const i0 = Math.floor(pos)
    const i1 = Math.min(stops - 1, i0 + 1)
    const f = pos - i0
    const smooth = f * f * (3 - 2 * f)
    const c0 = rgb[i0]
    const c1 = rgb[i1]
    const idx = i * 3
    lut[idx] = Math.round(c0[0] + (c1[0] - c0[0]) * smooth)
    lut[idx + 1] = Math.round(c0[1] + (c1[1] - c0[1]) * smooth)
    lut[idx + 2] = Math.round(c0[2] + (c1[2] - c0[2]) * smooth)
  }
  return lut
}

export type ArtJob = {
  width: number
  height: number
  pixels: Uint8ClampedArray
  step: (maxRows?: number) => boolean
}

/**
 * Creates an asynchronous generator-style job that computes the artwork into
 * a buffer. It evaluates a lower-resolution grid of the noise field and
 * upsamples it with bilinear interpolation, so the expensive noise function
 * runs far fewer times with very little visual difference.
 */
export function createArtJob(w: number, h: number, recipe: ArtRecipe, seed: number): ArtJob {
  const pixels = new Uint8ClampedArray(w * h * 4)
  const fbm = makeFbm(seed)
  const palette = buildPaletteLut(recipe.colors)

  const scale = (recipe.scale ?? 0.7) * 0.005
  const warp = recipe.warp ?? 2.0
  const angle = recipe.angle ?? 0
  const cosA = Math.cos(angle)
  const sinA = Math.sin(angle)
  const gloss = recipe.gloss ?? 0.35
  const veins = recipe.veins ?? 0.25
  const isStreak = recipe.style === "streak"

  // Grid step: 2px gives a 4× speedup, sharp enough for blurred glass
  const STEP = 2
  const gw = Math.ceil(w / STEP) + 1
  const gh = Math.ceil(h / STEP) + 1
  const fieldGrid = new Float32Array(gw * gh)

  let row = 0

  function field(r: number) {
    const y = r * STEP
    for (let c = 0; c < gw; c++) {
      const x = c * STEP
      // Rotate space so the directional streak can run at any angle
      const rx = (x * cosA - y * sinA) * scale
      const ry = (x * sinA + y * cosA) * scale

      let v: number
      if (isStreak) {
        // High frequency along the cross axis, low along the flow axis
        const qx = fbm(rx * 0.3, ry * 3.0, 3)
        const qy = fbm(rx * 0.3 + 5.2, ry * 3.0 + 1.3, 3)
        v = fbm(rx * 0.2 + warp * qx, ry * 2.5 + warp * qy, 4)
      } else {
        // Domain warping: sample noise at coordinates offset by noise
        const qx = fbm(rx, ry, 3)
        const qy = fbm(rx + 5.2, ry + 1.3, 3)
        const rx2 = rx + warp * qx
        const ry2 = ry + warp * qy
        const bx = fbm(rx2 + 1.7, ry2 + 9.2, 3)
        const by = fbm(rx2 + 8.3, ry2 + 2.8, 3)
        v = fbm(rx + warp * bx, ry + warp * by, 4)
      }
      fieldGrid[r * gw + c] = v
    }
  }

  function upsample() {
    for (let y = 0; y < h; y++) {
      const r = Math.floor(y / STEP)
      const fy = (y % STEP) / STEP
      const rNext = Math.min(gh - 1, r + 1)
      const rowA = r * gw
      const rowB = rNext * gw
      const outRow = y * w

      for (let x = 0; x < w; x++) {
        const c = Math.floor(x / STEP)
        const fx = (x % STEP) / STEP
        const cNext = Math.min(gw - 1, c + 1)

        const v00 = fieldGrid[rowA + c]
        const v10 = fieldGrid[rowA + cNext]
        const v01 = fieldGrid[rowB + c]
        const v11 = fieldGrid[rowB + cNext]

        const top = v00 + fx * (v10 - v00)
        const bot = v01 + fx * (v11 - v01)
        const v = top + fy * (bot - top)

        // Stash the field value in the alpha channel temporarily
        const idx = (outRow + x) * 4
        // Map roughly -0.8..0.8 into 0..1
        let norm = v * 0.65 + 0.5
        norm = norm < 0 ? 0 : norm > 1 ? 1 : norm
        pixels[idx + 3] = (norm * 255) | 0
      }
    }
  }

  function colorize() {
    const lightX = 0.58
    const lightY = -0.58
    const lightZ = 0.58

    for (let y = 0; y < h; y++) {
      const ym = y > 0 ? y - 1 : 0
      const yp = y < h - 1 ? y + 1 : h - 1
      const row = y * w

      for (let x = 0; x < w; x++) {
        const xm = x > 0 ? x - 1 : 0
        const xp = x < w - 1 ? x + 1 : w - 1
        const idx = (row + x) * 4

        const nCenter = pixels[idx + 3] / 255
        const nLeft = pixels[(y * w + xm) * 4 + 3] / 255
        const nRight = pixels[(y * w + xp) * 4 + 3] / 255
        const nUp = pixels[(ym * w + x) * 4 + 3] / 255
        const nDown = pixels[(yp * w + x) * 4 + 3] / 255

        // Gradients along x and y give normal on the liquid surface
        const dx = (nRight - nLeft) * 3.5
        const dy = (nDown - nUp) * 3.5
        const len = Math.hypot(dx, dy, 1)
        const nx = -dx / len
        const ny = -dy / len
        const nz = 1 / len

        // Diffuse light + Blinn-Phong specular highlight
        const diff = Math.max(0, nx * lightX + ny * lightY + nz * lightZ)
        const hx = lightX
        const hy = lightY
        const hz = lightZ + 1
        const hlen = Math.hypot(hx, hy, hz)
        const ndoth = Math.max(0, (nx * hx + ny * hy + nz * hz) / hlen)
        const spec = Math.pow(ndoth, 28) * gloss

        // Dark veins where the fold turns sharpest
        const curve = Math.min(1, Math.hypot(dx, dy) * 1.8) * veins

        let t = Math.pow(nCenter, 1.1)
        const palIdx = Math.min(255, Math.max(0, (t * 255) | 0)) * 3

        let r = palette[palIdx]
        let g = palette[palIdx + 1]
        let b = palette[palIdx + 2]

        // Darken folds
        if (curve > 0) {
          const dark = 1 - curve * 0.55
          r *= dark
          g *= dark
          b *= dark
        }

        // Apply diffuse lighting gently to preserve the palette's own values
        const lit = 0.8 + diff * 0.35
        r = r * lit + spec * 220
        g = g * lit + spec * 220
        b = b * lit + spec * 220

        pixels[idx] = r > 255 ? 255 : r < 0 ? 0 : r | 0
        pixels[idx + 1] = g > 255 ? 255 : g < 0 ? 0 : g | 0
        pixels[idx + 2] = b > 255 ? 255 : b < 0 ? 0 : b | 0
        pixels[idx + 3] = 255
      }
    }
  }

  function step(maxRows = 8): boolean {
    const end = Math.min(gh, row + maxRows)
    while (row < end) field(row++)
    if (row < gh) return false
    upsample()
    colorize()
    return true
  }

  return { width: w, height: h, pixels, step }
}

/** Where a file sits in the fan: -1 … 1 across the visible stack, 0 for one file. */
export function fanSlot(index: number, count: number): number {
  return count <= 1 ? 0 : (index / (count - 1)) * 2 - 1
}
// #endregion

const recipeOf = (art: ArtPreset | ArtRecipe): ArtRecipe => (typeof art === "string" ? ART_PRESETS[art] : art)

// ---------------------------------------------------------------------------
// One shared painter: every folder on the page queues its art here and the
// queue spends a few milliseconds a frame, so a row of folders never janks.

type Painted = HTMLCanvasElement
const artCache = new Map<string, Promise<Painted>>()
const queue: { job: ArtJob; priority: number; done: (c: Painted) => void }[] = []
let pumping = false

function pump() {
  if (pumping) return
  pumping = true
  const tick = () => {
    const until = performance.now() + 7
    while (queue.length && performance.now() < until) {
      const head = queue[0]
      if (head.job.step(4)) {
        queue.shift()
        const c = document.createElement("canvas")
        c.width = head.job.width
        c.height = head.job.height
        c.getContext("2d")?.putImageData(new ImageData(head.job.pixels as Uint8ClampedArray<ArrayBuffer>, c.width, c.height), 0, 0)
        head.done(c)
      }
    }
    if (queue.length) requestAnimationFrame(tick)
    else pumping = false
  }
  requestAnimationFrame(tick)
}

/** Lower priority paints first: back panels (0) before the files tucked behind glass (1). */
function paint(recipe: ArtRecipe, seed: number, w: number, h: number, priority: number): Promise<Painted> {
  const key = JSON.stringify([recipe, seed, w, h])
  let p = artCache.get(key)
  if (!p) {
    p = new Promise<Painted>((done) => {
      // never jump the job already in progress
      let at = queue.length
      while (at > 1 && queue[at - 1].priority > priority) at--
      queue.splice(at, 0, { job: createArtJob(w, h, recipe, seed), priority, done })
      pump()
    })
    artCache.set(key, p)
  }
  return p
}

function ArtCanvas({
  art,
  seed,
  w,
  h,
  density,
  priority,
  className,
}: {
  art: ArtPreset | ArtRecipe
  seed: number
  w: number
  h: number
  density: number
  priority: number
  className?: string
}) {
  const ref = React.useRef<HTMLCanvasElement>(null)
  const [ready, setReady] = React.useState(false)
  const recipe = recipeOf(art)
  const key = JSON.stringify(recipe)
  const pw = Math.round(w * density)
  const ph = Math.round(h * density)

  React.useEffect(() => {
    let live = true
    setReady(false)
    paint(JSON.parse(key) as ArtRecipe, seed, pw, ph, priority).then((src) => {
      const c = ref.current
      if (!live || !c) return
      c.width = src.width
      c.height = src.height
      c.getContext("2d")?.drawImage(src, 0, 0)
      setReady(true)
    })
    return () => {
      live = false
    }
  }, [key, seed, pw, ph, priority])

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className}
      data-ready={ready || undefined}
      style={{ width: w, height: h, maxWidth: "none" }}
    />
  )
}

// ---------------------------------------------------------------------------
// Geometry, in the folder's own units. The stage is drawn at 340 × 272 and
// scaled to `width`, so the shapes can be fixed paths.

const W = 340
const H = 272
const HEADROOM = 54 // room above the back panel for the files to rise into
const FRONT_TOP = 74
const FRONT_H = H - FRONT_TOP
const SHEET_W = 272
const SHEET_H = 184

const BACK_PATH =
  "M0 56A22 22 0 0 1 22 34L146 34C170 34 172 0 198 0L318 0A22 22 0 0 1 340 22L340 250A22 22 0 0 1 318 272L22 272A22 22 0 0 1 0 250Z"
const FRONT_PATH =
  "M0 22A22 22 0 0 1 22 0L118 0C144 0 146 32 172 32L318 32A22 22 0 0 1 340 54L340 " +
  (FRONT_H - 22) +
  "A22 22 0 0 1 318 " +
  FRONT_H +
  "L22 " +
  FRONT_H +
  "A22 22 0 0 1 0 " +
  (FRONT_H - 22) +
  "Z"

const MAX_VISIBLE = 4

const SAMPLE_FILES: FolderFile[] = [
  { name: "Cover — final", meta: "PNG · 4.8 MB", art: "ember" },
  { name: "Moodboard", meta: "24 images", art: "dusk" },
  { name: "Brief.pdf", meta: "PDF · 1.2 MB" },
]

export default function GlassFolder({
  label = "My Files",
  meta,
  tone = "light",
  art = "aurora",
  seed = 3,
  image,
  files: initialFiles = SAMPLE_FILES,
  maxVisible,
  action = "add",
  onAdd,
  onFilesChange,
  menu = [],
  labelPlacement = "bottom-left",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  onFileSelect,
  width = 340,
  appear = true,
  appearDelay = 0,
  className,
  style,
}: GlassFolderProps) {
  const uid = React.useId().replace(/:/g, "")
  const rootRef = React.useRef<HTMLDivElement>(null)
  const filesRef = React.useRef<HTMLDivElement>(null)
  const hitRef = React.useRef<HTMLButtonElement>(null)
  const keyRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  const [files, setFiles] = React.useState<FolderFile[]>(initialFiles)
  // ids survive re-renders so a newly added file is the only one that animates in
  const ids = React.useRef<number[]>(initialFiles.map((_, i) => i))
  const nextId = React.useRef(initialFiles.length)
  const [dropped, setDropped] = React.useState<number | null>(null)
  const [bump, setBump] = React.useState(0)

  const [openState, setOpenState] = React.useState(defaultOpen)
  const open = openProp ?? openState
  const setOpen = React.useCallback(
    (next: boolean) => {
      if (openProp === undefined) setOpenState(next)
      onOpenChange?.(next)
    },
    [openProp, onOpenChange],
  )
  const [menuOpen, setMenuOpen] = React.useState(false)
  const [entered, setEntered] = React.useState(!appear)

  const k = width / W
  const density = Math.min(1.5, Math.max(1, typeof window === "undefined" ? 1 : window.devicePixelRatio || 1)) * k

  // ---- entrance: assemble the first time the folder is on screen ----------
  React.useEffect(() => {
    if (!appear) return
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setEntered(true)
      return
    }
    let t = 0
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        t = window.setTimeout(() => setEntered(true), appearDelay)
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => {
      io.disconnect()
      window.clearTimeout(t)
    }
  }, [appear, appearDelay])

  // ---- pointer: light and parallax follow the cursor, no re-renders -------
  React.useEffect(() => {
    const el = rootRef.current
    if (!el) return
    let raf = 0
    let px = 0
    let py = 0
    const write = () => {
      raf = 0
      el.style.setProperty("--gf-px", px.toFixed(3))
      el.style.setProperty("--gf-py", py.toFixed(3))
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType === "touch") return
      const r = el.getBoundingClientRect()
      px = ((e.clientX - r.left) / r.width) * 2 - 1
      py = ((e.clientY - r.top) / r.height) * 2 - 1
      if (!raf) raf = requestAnimationFrame(write)
    }
    const leave = () => {
      px = 0
      py = 0
      if (!raf) raf = requestAnimationFrame(write)
    }
    el.addEventListener("pointermove", move)
    el.addEventListener("pointerleave", leave)
    return () => {
      el.removeEventListener("pointermove", move)
      el.removeEventListener("pointerleave", leave)
      cancelAnimationFrame(raf)
    }
  }, [])

  // ---- closed files are out of the tab order ------------------------------
  React.useEffect(() => {
    filesRef.current?.toggleAttribute("inert", !open)
  }, [open])

  // ---- Escape and a press outside close whatever is open ------------------
  React.useEffect(() => {
    if (!open && !menuOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return
      if (menuOpen) {
        setMenuOpen(false)
        keyRef.current?.focus()
      } else {
        setOpen(false)
        hitRef.current?.focus()
      }
    }
    const onDown = (e: PointerEvent) => {
      const t = e.target as Node
      if (menuOpen && !menuRef.current?.contains(t) && !keyRef.current?.contains(t)) setMenuOpen(false)
      if (open && !menuOpen && !rootRef.current?.contains(t)) setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("pointerdown", onDown)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("pointerdown", onDown)
    }
  }, [open, menuOpen, setOpen])

  // focus the first menu item when the menu opens
  React.useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector<HTMLElement>("[role=menuitem]")?.focus()
  }, [menuOpen])

  const addFile = () => {
    const made = onAdd?.(files)
    const file: FolderFile = made || { name: "Untitled " + (files.length + 1), meta: "Just now" }
    const next = [...files, file]
    const id = nextId.current++
    ids.current = [...ids.current, id]
    setFiles(next)
    setDropped(id)
    setBump((b) => b + 1)
    onFilesChange?.(next)
  }

  const menuItems: FolderMenuItem[] = [
    { label: open ? "Close folder" : "Open folder", onSelect: () => setOpen(!open) },
    ...menu,
  ]

  const onMenuKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const items = Array.from(menuRef.current?.querySelectorAll<HTMLElement>("[role=menuitem]") ?? [])
    const at = items.indexOf(document.activeElement as HTMLElement)
    const go = (i: number) => {
      e.preventDefault()
      items[(i + items.length) % items.length]?.focus()
    }
    if (e.key === "ArrowDown") go(at + 1)
    else if (e.key === "ArrowUp") go(at - 1)
    else if (e.key === "Home") go(0)
    else if (e.key === "End") go(items.length - 1)
    else if (e.key === "Tab") setMenuOpen(false)
  }

  // Display all files or specified limit
  const max = maxVisible ?? (files.length > 4 ? files.length : MAX_VISIBLE)
  const start = Math.max(0, files.length - max)
  const visible = files.slice(start)
  const count = files.length
  const metaLine = meta ?? count + (count === 1 ? " item" : " items")

  // For larger file stacks, adjust stack offset slightly so cards fan gracefully
  const stackOpen = visible.length > 5 ? Math.max(16, Math.min(26, Math.round(180 / (visible.length - 1)))) : 30

  return (
    <div
      ref={rootRef}
      className={"gf-root" + (className ? " " + className : "")}
      data-tone={tone}
      data-open={open || undefined}
      data-entered={entered || undefined}
      data-place={labelPlacement}
      style={{
        width,
        height: (H + HEADROOM) * k,
        ["--gf-stack-open" as any]: `${stackOpen}px`,
        ...style,
      }}
    >
      <style>{GF_CSS}</style>
      <div className="gf-stage" style={{ transform: "translateY(" + HEADROOM * k + "px) scale(" + k + ")" }}>
        <div className="gf-tilt">
          <div className="gf-shadow" aria-hidden="true" />

          {/* back panel and its artwork */}
          <div className="gf-back" style={{ clipPath: "path('" + BACK_PATH + "')" }} aria-hidden="true">
            {image ? (
              <img className="gf-art" src={image} alt="" width={W + 24} height={H + 24} draggable={false} />
            ) : art !== "none" ? (
              <ArtCanvas className="gf-art" art={art} seed={seed} w={W + 24} h={H + 24} density={density} priority={0} />
            ) : null}
            <div className="gf-back-sheen" />
          </div>
          <svg className="gf-rim gf-back-rim" viewBox={"0 0 " + W + " " + H} aria-hidden="true">
            <path d={BACK_PATH} />
          </svg>

          {/* the frosted front panel, hinged on its bottom edge */}
          <div
            key={bump}
            className={"gf-front" + (bump ? " gf-front--bump" : "")}
            style={{ clipPath: "path('" + FRONT_PATH + "')" }}
          >
            <div className="gf-tint" aria-hidden="true" />
            <div className="gf-spec" aria-hidden="true" />
            <svg className="gf-rim gf-front-rim" viewBox={"0 0 " + W + " " + FRONT_H} aria-hidden="true">
              <defs>
                <linearGradient id={"gf-rim-" + uid} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ffffff" stopOpacity={tone === "dark" ? "0.45" : "0.9"} />
                  <stop offset="100%" stopColor="#ffffff" stopOpacity={tone === "dark" ? "0.08" : "0.25"} />
                </linearGradient>
              </defs>
              <path d={FRONT_PATH} stroke={"url(#gf-rim-" + uid + ")"} />
            </svg>

            {/* the entire front panel is the click target to open/close */}
            <button
              ref={hitRef}
              type="button"
              className="gf-hit"
              aria-label={(open ? "Close " : "Open ") + label + " folder"}
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            />

            <div className="gf-label" aria-hidden="true">
              <span className="gf-title">{label}</span>
              <span className="gf-meta" key={metaLine}>
                {metaLine}
              </span>
            </div>
          </div>

          {/* the contents: after the glass in tab order, beneath it on screen */}
          <div ref={filesRef} className="gf-files" role="list" aria-label={label + " contents"}>
            {visible.map((file, v) => {
              const id = ids.current[start + v]
              const slot = fanSlot(v, visible.length)
              const jitter = rng(hashString(file.name) + id)
              const picture = !!(file.art || file.image)
              const inner = (
                <>
                  {picture ? (
                    file.image ? (
                      <img className="gf-sheet-art" src={file.image} alt="" width={SHEET_W} height={SHEET_H} draggable={false} />
                    ) : (
                      <ArtCanvas
                        className="gf-sheet-art"
                        art={file.art as ArtPreset | ArtRecipe}
                        seed={hashString(file.name) % 997}
                        w={SHEET_W}
                        h={SHEET_H}
                        density={Math.min(density, 1.25)}
                        priority={1}
                      />
                    )
                  ) : (
                    <span className="gf-lines" aria-hidden="true">
                      <i style={{ width: "86%" }} />
                      <i style={{ width: "92%" }} />
                      <i style={{ width: "64%" }} />
                      <i style={{ width: "88%" }} />
                      <i style={{ width: "42%" }} />
                    </span>
                  )}
                  <span className="gf-sheet-head">
                    {file.icon ? <span className="gf-sheet-icon">{file.icon}</span> : null}
                    <span className="gf-sheet-name">{file.name}</span>
                    {file.meta ? <span className="gf-sheet-meta">{file.meta}</span> : null}
                  </span>
                </>
              )
              const common = {
                className: "gf-sheet" + (picture ? " gf-sheet--art" : "") + (id === dropped ? " gf-sheet--drop" : ""),
                style: {
                  "--gf-slot": slot,
                  "--gf-depth": visible.length - 1 - v,
                  "--gf-jx": ((jitter() - 0.5) * 10).toFixed(2) + "px",
                  "--gf-jr": ((jitter() - 0.5) * 3.2).toFixed(2) + "deg",
                  zIndex: v + 1,
                } as React.CSSProperties,
                onAnimationEnd: id === dropped ? () => setDropped(null) : undefined,
              }
              return (
                <div key={id} role="listitem" className="gf-sheet-slot">
                  {file.href ? (
                    <a {...common} href={file.href} onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </a>
                  ) : (
                    <button {...common} type="button" onClick={() => onFileSelect?.(file, start + v)}>
                      {inner}
                    </button>
                  )}
                </div>
              )
            })}
          </div>

          {action !== "none" ? (
            <button
              ref={keyRef}
              type="button"
              className={"gf-key gf-key--" + action}
              aria-label={action === "add" ? "Add a file to " + label : "More options for " + label}
              aria-haspopup={action === "more" ? "menu" : undefined}
              aria-expanded={action === "more" ? menuOpen : undefined}
              aria-controls={action === "more" ? "gf-menu-" + uid : undefined}
              onClick={() => (action === "add" ? addFile() : setMenuOpen((m) => !m))}
            >
              {action === "add" ? (
                <svg key={bump} className="gf-glyph gf-glyph--plus" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 4.5v15M4.5 12h15" />
                </svg>
              ) : (
                <svg className="gf-glyph gf-glyph--more" viewBox="0 0 30 12" aria-hidden="true">
                  <rect x="1" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="11" y="1.5" width="8" height="9" rx="3.4" />
                  <rect x="21" y="1.5" width="8" height="9" rx="3.4" />
                </svg>
              )}
            </button>
          ) : null}

          {action === "more" ? (
            <div
              ref={menuRef}
              id={"gf-menu-" + uid}
              role="menu"
              aria-label={label + " options"}
              className="gf-menu"
              data-open={menuOpen || undefined}
              onKeyDown={onMenuKey}
            >
              {menuItems.map((item, i) => (
                <button
                  key={item.label + i}
                  type="button"
                  role="menuitem"
                  tabIndex={menuOpen ? -1 : undefined}
                  disabled={!menuOpen}
                  className={"gf-menu-item" + (item.danger ? " gf-menu-item--danger" : "")}
                  onClick={() => {
                    setMenuOpen(false)
                    keyRef.current?.focus()
                    item.onSelect?.()
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

const GF_CSS = `
.gf-root {
  --gf-px: 0;
  --gf-py: 0;
  --gf-ease: cubic-bezier(.2, .8, .2, 1);
  --gf-spring: cubic-bezier(.34, 1.36, .5, 1);
  --gf-hinge: 0deg;
  --gf-lift: 42px;
  --gf-spread: 0px;
  --gf-fan: 0deg;
  --gf-stack: 15px;
  --gf-ink: #141416;
  --gf-ink-soft: rgba(20, 20, 22, .55);
  position: relative;
  display: inline-block;
  flex: none;
  vertical-align: top;
  font-family: ui-sans-serif, system-ui, -apple-system, "SF Pro Text", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -webkit-tap-highlight-color: transparent;
  isolation: isolate;
}
.gf-root[data-tone="dark"] { --gf-ink: #f5f5f7; --gf-ink-soft: rgba(245, 245, 247, .58); }
.gf-root:hover, .gf-root:focus-within { --gf-hinge: -11deg; --gf-lift: -34px; --gf-spread: 8px; --gf-fan: 1.4deg; --gf-stack: 10px; }
.gf-root[data-open] { --gf-hinge: -24deg; --gf-lift: -96px; --gf-spread: 40px; --gf-fan: 5deg; --gf-stack: var(--gf-stack-open, 30px); z-index: 30; }

.gf-stage {
  position: absolute;
  left: 0;
  top: 0;
  width: 340px;
  height: 272px;
  transform-origin: 0 0;
}
.gf-tilt {
  position: absolute;
  inset: 0;
  transform: perspective(1400px) rotateX(calc(var(--gf-py) * -3deg)) rotateY(calc(var(--gf-px) * 4deg));
  transition: transform .9s var(--gf-ease);
}

.gf-shadow {
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: -6px;
  height: 60px;
  border-radius: 40px;
  background: rgba(16, 18, 24, .34);
  filter: blur(22px);
  transform: translateX(calc(var(--gf-px) * -8px));
  transition: transform .9s var(--gf-ease), opacity .9s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-shadow { background: rgba(0, 0, 0, .62); }

.gf-back {
  position: absolute;
  inset: 0;
  overflow: hidden;
  background: linear-gradient(180deg, #f3f3f4 0%, #e3e3e6 100%);
}
.gf-root[data-tone="dark"] .gf-back { background: linear-gradient(180deg, #2a2a2e 0%, #121214 100%); }
.gf-art {
  position: absolute;
  left: -12px;
  top: -12px;
  max-width: none;
  object-fit: cover;
  transform: translate(calc(var(--gf-px) * -7px), calc(var(--gf-py) * -6px)) scale(1.02);
  transition: transform 1.1s var(--gf-ease), opacity 1.2s var(--gf-ease), filter 1.2s var(--gf-ease);
}
canvas.gf-art { opacity: 0; filter: blur(14px) saturate(.6); }
canvas.gf-art[data-ready] { opacity: 1; filter: none; }
.gf-back-sheen {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .22) 0%, rgba(255, 255, 255, 0) 22%),
    radial-gradient(120% 80% at 80% 0%, rgba(255, 255, 255, .16), rgba(255, 255, 255, 0) 60%);
  pointer-events: none;
}

.gf-rim {
  position: absolute;
  left: 0;
  top: 0;
  max-width: none;
  overflow: visible;
  pointer-events: none;
  fill: none;
}
.gf-back-rim { width: 340px; height: 272px; }
.gf-back-rim path { stroke: rgba(255, 255, 255, .45); stroke-width: 1; }
.gf-root[data-tone="dark"] .gf-back-rim path { stroke: rgba(255, 255, 255, .16); }

/* ---- files ---------------------------------------------------------------- */
.gf-files {
  position: absolute;
  inset: 0;
  z-index: 5;
  pointer-events: none;
  /* nothing hangs out of the bottom of the pocket, however tall the stack */
  clip-path: inset(-400px -400px 10px -400px);
}
.gf-sheet-slot { display: contents; }
.gf-sheet {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  left: 34px;
  top: 96px;
  width: 272px;
  height: 184px;
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  pointer-events: auto;
  background: linear-gradient(180deg, #ffffff 0%, #f2f2f0 100%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .9),
    0 0 0 .5px rgba(0, 0, 0, .1),
    0 10px 26px -8px rgba(10, 12, 20, .28);
  transform-origin: 50% 100%;
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1))
    rotate(calc(var(--gf-jr) + var(--gf-slot) * var(--gf-fan)));
  transition:
    transform .75s var(--gf-spring) calc(var(--gf-depth) * 40ms),
    box-shadow .4s var(--gf-ease),
    translate .9s var(--gf-ease),
    opacity .9s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-sheet { background: linear-gradient(180deg, #2c2c30 0%, #1c1c1f 100%); box-shadow: inset 0 1px 0 rgba(255, 255, 255, .14), 0 0 0 .5px rgba(255, 255, 255, .08), 0 12px 28px -8px rgba(0, 0, 0, .7); }
.gf-sheet--art { background: #1a1a1d; }
.gf-root[data-open] .gf-sheet:hover,
.gf-root[data-open] .gf-sheet:focus-visible {
  transform:
    translate(calc(var(--gf-jx) + var(--gf-slot) * var(--gf-spread)), calc(var(--gf-lift) + var(--gf-depth) * var(--gf-stack) * -1 - 18px))
    rotate(calc(var(--gf-slot) * var(--gf-fan) * .6));
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, .9), 0 0 0 .5px rgba(0, 0, 0, .1), 0 22px 40px -12px rgba(10, 12, 20, .42);
  transition-delay: 0s;
}
.gf-sheet:focus-visible { outline: 2px solid #4c8dff; outline-offset: 2px; }
.gf-sheet-art {
  position: absolute;
  left: 0;
  top: 0;
  width: 272px;
  height: 184px;
  max-width: none;
  object-fit: cover;
  transition: opacity .9s var(--gf-ease), filter .9s var(--gf-ease);
}
canvas.gf-sheet-art { opacity: 0; filter: blur(10px); }
canvas.gf-sheet-art[data-ready] { opacity: 1; filter: none; }
.gf-sheet--art::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(180deg, rgba(0, 0, 0, .42) 0%, rgba(0, 0, 0, 0) 34%);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, .2);
  pointer-events: none;
}
.gf-sheet-head {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 11px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  white-space: nowrap;
}
.gf-sheet-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 15px;
  height: 15px;
}
.gf-sheet-icon svg, .gf-sheet-icon img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
.gf-sheet-name {
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12.5px;
  font-weight: 560;
  letter-spacing: -.005em;
  color: #18181b;
}
.gf-sheet-meta {
  margin-left: auto;
  flex: none;
  font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10px;
  letter-spacing: .02em;
  color: rgba(24, 24, 27, .5);
}
.gf-root[data-tone="dark"] .gf-sheet-name, .gf-sheet--art .gf-sheet-name { color: #fafafa; }
.gf-root[data-tone="dark"] .gf-sheet-meta, .gf-sheet--art .gf-sheet-meta { color: rgba(250, 250, 250, .66); }
.gf-lines {
  position: absolute;
  left: 14px;
  right: 14px;
  top: 40px;
  display: flex;
  flex-direction: column;
  gap: 9px;
}
.gf-lines i {
  display: block;
  height: 5px;
  border-radius: 3px;
  background: rgba(24, 24, 27, .08);
}
.gf-lines i:first-child { height: 9px; margin-bottom: 4px; background: rgba(24, 24, 27, .14); }
.gf-root[data-tone="dark"] .gf-lines i { background: rgba(255, 255, 255, .08); }
.gf-root[data-tone="dark"] .gf-lines i:first-child { background: rgba(255, 255, 255, .16); }

.gf-sheet--drop { animation: gf-drop .85s var(--gf-ease) both; }
@keyframes gf-drop {
  0% { translate: 0 -190px; rotate: -9deg; opacity: 0; }
  35% { opacity: 1; }
  72% { translate: 0 10px; rotate: 1deg; }
  100% { translate: 0 0; rotate: 0deg; opacity: 1; }
}

/* ---- front glass ----------------------------------------------------------- */
.gf-front {
  position: absolute;
  left: 0;
  top: 74px;
  width: 340px;
  height: 198px;
  z-index: 10;
  -webkit-backdrop-filter: blur(22px) saturate(1.5);
  backdrop-filter: blur(22px) saturate(1.5);
  transform-origin: 50% 100%;
  transform: perspective(760px) rotateX(var(--gf-hinge));
  transition: transform .8s var(--gf-spring), translate 1s var(--gf-ease), opacity 1s var(--gf-ease);
}
.gf-front--bump { animation: gf-bump .7s var(--gf-ease) .38s both; }
@keyframes gf-bump {
  0% { scale: 1; }
  35% { scale: 1.018 .975; }
  70% { scale: .996 1.006; }
  100% { scale: 1; }
}
.gf-tint {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, .16) 0%, rgba(255, 255, 255, .5) 42%, rgba(252, 252, 252, .93) 100%);
}
.gf-root[data-tone="dark"] .gf-tint {
  background: linear-gradient(180deg, rgba(18, 18, 20, .18) 0%, rgba(14, 14, 16, .62) 46%, rgba(8, 8, 10, .94) 100%);
}
.gf-spec {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 70% at calc(50% + var(--gf-px) * 28%) 0%, rgba(255, 255, 255, .55), rgba(255, 255, 255, 0) 65%),
    linear-gradient(180deg, rgba(255, 255, 255, .32) 0%, rgba(255, 255, 255, 0) 32%);
  pointer-events: none;
}
.gf-root[data-tone="dark"] .gf-spec {
  background:
    radial-gradient(120% 70% at calc(50% + var(--gf-px) * 28%) 0%, rgba(255, 255, 255, .22), rgba(255, 255, 255, 0) 65%),
    linear-gradient(180deg, rgba(255, 255, 255, .12) 0%, rgba(255, 255, 255, 0) 32%);
}

.gf-front-rim { width: 340px; height: 198px; }
.gf-front-rim path { stroke-width: 1; }

.gf-hit {
  all: unset;
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
  z-index: 2;
  -webkit-tap-highlight-color: transparent;
}
.gf-hit:focus-visible { outline: 2px solid #4c8dff; outline-offset: -2px; border-radius: 22px; }

/* ---- label ----------------------------------------------------------------- */
.gf-label {
  position: absolute;
  left: 20px;
  bottom: 18px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  pointer-events: none;
  z-index: 3;
}
.gf-root[data-place="top-left"] .gf-label { top: 40px; bottom: auto; }
.gf-root[data-place="top-right"] .gf-label { top: 40px; bottom: auto; left: auto; right: 20px; text-align: right; align-items: flex-end; }

.gf-title {
  font-size: 13.5px;
  font-weight: 560;
  letter-spacing: -.01em;
  color: var(--gf-ink);
}
.gf-meta {
  font-family: ui-monospace, "SF Mono", SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 10.5px;
  letter-spacing: .02em;
  color: var(--gf-ink-soft);
  animation: gf-meta-in .35s var(--gf-ease) both;
}
@keyframes gf-meta-in {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ---- action key (+ or ···) ------------------------------------------------- */
.gf-key {
  all: unset;
  box-sizing: border-box;
  position: absolute;
  right: 18px;
  bottom: 18px;
  z-index: 12;
  width: 28px;
  height: 28px;
  border-radius: 9px;
  display: grid;
  place-items: center;
  cursor: pointer;
  background: rgba(255, 255, 255, .72);
  -webkit-backdrop-filter: blur(12px);
  backdrop-filter: blur(12px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .9),
    0 0 0 .5px rgba(0, 0, 0, .08),
    0 4px 10px -2px rgba(10, 12, 20, .14);
  color: #1a1a1c;
  transform-origin: 50% 50%;
  transition: transform .25s var(--gf-spring), background .2s var(--gf-ease), box-shadow .2s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-key {
  background: rgba(36, 36, 40, .78);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .16),
    0 0 0 .5px rgba(255, 255, 255, .08),
    0 6px 14px -2px rgba(0, 0, 0, .5);
  color: #f2f2f5;
}
.gf-key:hover {
  transform: scale(1.08);
  background: rgba(255, 255, 255, .92);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    0 0 0 .5px rgba(0, 0, 0, .12),
    0 6px 16px -2px rgba(10, 12, 20, .22);
}
.gf-root[data-tone="dark"] .gf-key:hover { background: rgba(48, 48, 54, .9); }
.gf-key:active { transform: scale(.94); }
.gf-key:focus-visible { outline: 2px solid #4c8dff; outline-offset: 2px; }

.gf-glyph {
  width: 13px;
  height: 13px;
  stroke: currentColor;
  stroke-width: 2;
  stroke-linecap: round;
  stroke-linejoin: round;
  fill: none;
}
.gf-glyph--more { width: 14px; height: 6px; fill: currentColor; stroke: none; }
.gf-glyph--plus { animation: gf-plus-spin .55s var(--gf-spring) both; }
@keyframes gf-plus-spin {
  0% { transform: rotate(-90deg) scale(.6); opacity: 0; }
  100% { transform: rotate(0) scale(1); opacity: 1; }
}

/* ---- menu ------------------------------------------------------------------ */
.gf-menu {
  position: absolute;
  right: 18px;
  bottom: 54px;
  z-index: 20;
  min-width: 154px;
  padding: 6px;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  background: rgba(255, 255, 255, .82);
  -webkit-backdrop-filter: blur(28px) saturate(1.6);
  backdrop-filter: blur(28px) saturate(1.6);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .9),
    0 0 0 .5px rgba(0, 0, 0, .08),
    0 18px 36px -8px rgba(10, 12, 20, .28);
  transform-origin: 90% 100%;
  transform: scale(.86);
  opacity: 0;
  pointer-events: none;
  transition: transform .25s var(--gf-spring), opacity .18s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-menu {
  background: rgba(28, 28, 32, .86);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, .14),
    0 0 0 .5px rgba(255, 255, 255, .08),
    0 22px 40px -8px rgba(0, 0, 0, .7);
}
.gf-menu[data-open] {
  transform: scale(1);
  opacity: 1;
  pointer-events: auto;
}
.gf-menu-item {
  all: unset;
  box-sizing: border-box;
  padding: 7px 10px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 520;
  letter-spacing: -.005em;
  color: #1a1a1c;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background .12s var(--gf-ease);
}
.gf-root[data-tone="dark"] .gf-menu-item { color: #f2f2f5; }
.gf-menu-item:hover, .gf-menu-item:focus-visible { background: rgba(0, 0, 0, .06); outline: none; }
.gf-root[data-tone="dark"] .gf-menu-item:hover,
.gf-root[data-tone="dark"] .gf-menu-item:focus-visible { background: rgba(255, 255, 255, .08); }
.gf-menu-item--danger { color: #d93834 !important; }
.gf-menu-item--danger:hover, .gf-menu-item--danger:focus-visible { background: rgba(217, 56, 52, .1) !important; }

/* ---- entrance (data-entered) ---------------------------------------------- */
.gf-root[data-entered] .gf-front,
.gf-root[data-entered] .gf-sheet {
  animation-duration: .9s;
}
`
