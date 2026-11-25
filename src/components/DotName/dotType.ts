/* Canvas renderer behind DotName: block letters, text dots, and icon dots. */
import { ANSI_SHADOW } from './ansiShadow'

interface Dot {
  delay: number
  /* A cell with little ink. It has no square, only its piece of the text. */
  faint?: boolean
  glyph?: string
  homeX: number
  homeY: number
  velocityX: number
  velocityY: number
  x: number
  y: number
}

interface Layout {
  cell: number
  dots: Dot[]
  height: number
  radius: number
  source?: HTMLCanvasElement
  sourceStep?: number
}

interface Point {
  x: number
  y: number
}

const BLOCK_ROWS = 6
const BLOCK_SPACE = 4
const COLOR_REDRAW_MS = 400
const CORNERS: Record<string, [number, number]> = {
  '╔': [1, 1],
  '╗': [-1, 1],
  '╚': [1, -1],
  '╝': [-1, -1],
}
const DAMPING = 0.82
const FAST_DAMPING = 0.74
const FAST_REST_THRESHOLD = 0.6
const FAINT_THRESHOLD = 8
const FAST_STIFFNESS = 0.16
const DOTS_PER_EM = 24
const HOME_EPSILON = 0.5
const INK_THRESHOLD = 135
const INTRO_SWEEP_MS = 700
const MAX_CELL = 6.5
const MIN_STEP = 1
const PADDING = 96
const POINTER_FORCE = 3
const POINTER_RADIUS = 70
const REST_THRESHOLD = 0.05
const STIFFNESS = 0.08
const STILL_FRAMES = 4

const noop = (): void => undefined

/**
 * Add one block-letter cell to the current path.
 *
 * The cell is drawn as shapes, not as font glyphs, so that the full blocks
 * and the double-line "shadow" join up in every browser.
 *
 * @param {CanvasRenderingContext2D} context The canvas context.
 * @param {string} glyph One of the ANSI Shadow characters.
 * @param {number} x Left edge of the cell.
 * @param {number} y Top edge of the cell.
 * @param {number} cell Cell width. The cell height is twice the width.
 */
const traceGlyph = (
  context: CanvasRenderingContext2D,
  glyph: string,
  x: number,
  y: number,
  cell: number,
): void => {
  const height = cell * 2

  if (glyph === '█') {
    context.rect(x, y, cell, height)

    return
  }

  const centerX = x + cell / 2
  const centerY = y + height / 2
  const gap = cell * 0.24
  const line = Math.max(1, cell * 0.16)
  const half = line / 2

  if (glyph === '═') {
    context.rect(x, centerY - gap - half, cell, line)
    context.rect(x, centerY + gap - half, cell, line)

    return
  }

  if (glyph === '║') {
    context.rect(centerX - gap - half, y, line, height)
    context.rect(centerX + gap - half, y, line, height)

    return
  }

  if (!(glyph in CORNERS)) {
    return
  }

  const [horizontal, vertical] = CORNERS[glyph]
  const edgeX = horizontal > 0 ? x + cell : x
  const edgeY = vertical > 0 ? y + height : y

  /* -1 is the outer line of the corner, 1 is the inner line. */
  for (const side of [-1, 1]) {
    const lineX = centerX + side * horizontal * gap
    const lineY = centerY + side * vertical * gap
    const startX = lineX - horizontal * half
    const startY = lineY - vertical * half

    context.rect(
      lineX - half,
      Math.min(startY, edgeY),
      line,
      Math.abs(edgeY - startY),
    )
    context.rect(
      Math.min(startX, edgeX),
      lineY - half,
      Math.abs(edgeX - startX),
      line,
    )
  }
}

/**
 * Draw the text of `root` as a grid of dots on the canvas inside it.
 *
 * The real text stays in the DOM for assistive technology. The dots fly in
 * once, then move away from the pointer and spring back.
 *
 * @param {HTMLElement} root Element that holds the text span and the canvas.
 * @returns {() => void} Cleanup that stops the animation and the listeners.
 */
export const mountDotType = (root: HTMLElement): (() => void) => {
  const canvas = root.querySelector('canvas')
  const text = root.querySelector('span')

  const context =
    canvas && text && typeof ResizeObserver !== 'undefined'
      ? canvas.getContext('2d')
      : null

  if (!canvas || !text || !context) {
    /* No dots here. Mark the root, so that the CSS shows the plain text. */
    root.dataset.dots = 'rest'

    return noop
  }

  const reduceMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)',
  ).matches

  const isBlock = root.dataset.variant === 'block'
  /* Icons are click targets, so their dots do not move away from the pointer. */
  const isIcon = Boolean(text.querySelector('svg'))
  /* Text and icons settle fast, so that the real text comes back sooner. */
  const damping = isBlock ? DAMPING : FAST_DAMPING
  const restThreshold = isBlock ? REST_THRESHOLD : FAST_REST_THRESHOLD
  const stiffness = isBlock ? STIFFNESS : FAST_STIFFNESS
  const link = root.closest('a')

  let cell = 0
  let cssHeight = 0
  let cssWidth = 0
  let disposed = false
  let dots: Dot[] = []
  let frame = 0
  let hasPlayedIntro = false
  let introStart = 0
  let isIntroDone = false
  let pointer: Point | null = null
  let radius = 1
  let redrawUntil = 0
  let landed: Dot[] = []
  let pattern: CanvasPattern | null = null
  let sourceStep = 0
  let stillFrames = 0

  const draw = (now: number): boolean => {
    const ratio = window.devicePixelRatio || 1
    const elapsed = now - introStart
    const drawAll = !isIntroDone
    const hole = isIcon ? null : pointer
    let isMoving = false

    context.setTransform(ratio, 0, 0, ratio, 0, 0)
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillStyle = getComputedStyle(root).color
    context.beginPath()
    landed = []

    for (const dot of dots) {
      if (elapsed < dot.delay) {
        isMoving = true

        continue
      }

      if (!reduceMotion) {
        dot.velocityX += (dot.homeX - dot.x) * stiffness
        dot.velocityY += (dot.homeY - dot.y) * stiffness

        if (pointer && !isIcon) {
          const deltaX = dot.x - pointer.x
          const deltaY = dot.y - pointer.y
          const distance = Math.hypot(deltaX, deltaY) || 1

          if (distance < POINTER_RADIUS) {
            const force = (1 - distance / POINTER_RADIUS) * POINTER_FORCE

            dot.velocityX += (deltaX / distance) * force
            dot.velocityY += (deltaY / distance) * force
          }
        }

        dot.velocityX *= damping
        dot.velocityY *= damping
        dot.x += dot.velocityX
        dot.y += dot.velocityY

        if (
          Math.abs(dot.velocityX) + Math.abs(dot.velocityY) > restThreshold ||
          Math.abs(dot.homeX - dot.x) + Math.abs(dot.homeY - dot.y) >
            restThreshold
        ) {
          isMoving = true
        }
      }

      if (dot.glyph) {
        traceGlyph(context, dot.glyph, dot.x, dot.y, cell)

        continue
      }

      /*
       * After the intro, the real text stays visible. Draw a dot only if it
       * is away from home, or if its home is inside the hole that the pointer
       * cuts in the real text.
       */
      const isAway =
        Math.abs(dot.homeX - dot.x) + Math.abs(dot.homeY - dot.y) > HOME_EPSILON
      const isInHole =
        hole !== null &&
        Math.hypot(dot.homeX - hole.x, dot.homeY - hole.y) < POINTER_RADIUS

      /* Intro: a dot that is home shows its piece of the real text. */
      if (drawAll && !isAway && pattern) {
        landed.push(dot)
      } else if (!dot.faint && (drawAll || isAway || isInHole)) {
        context.rect(dot.x - radius, dot.y - radius, radius * 2, radius * 2)
      }
    }

    context.fill()

    /*
     * All the landed dots are one path, filled once with the picture of the
     * real text. One draw call per dot is too slow on a phone: the frame rate
     * fell to one frame per second. The path is in device pixels, so that the
     * picture is not scaled.
     */
    if (pattern && landed.length) {
      const origin = Math.round(PADDING * ratio)

      context.setTransform(1, 0, 0, 1, origin, origin)
      context.fillStyle = pattern
      context.beginPath()

      for (const dot of landed) {
        context.rect(
          Math.round((dot.homeX - PADDING - radius) * ratio),
          Math.round((dot.homeY - PADDING - radius) * ratio),
          sourceStep,
          sourceStep,
        )
      }

      context.fill()
    }

    return isMoving
  }

  const tick = (now: number): void => {
    frame = 0

    if (disposed) {
      return
    }

    const isMoving = draw(now)

    stillFrames = isMoving ? 0 : stillFrames + 1

    if (!isIntroDone && stillFrames >= STILL_FRAMES) {
      isIntroDone = true

      if (!isBlock) {
        context.setTransform(1, 0, 0, 1, 0, 0)
        context.clearRect(0, 0, canvas.width, canvas.height)
      }
    }

    /*
     * Block name: always drawn. Text and icons: all dots during the intro
     * ("on"), then the real text with a hole at the pointer ("hole"), or the
     * real text alone ("rest").
     */
    let mode = 'on'

    if (!isBlock && isIntroDone) {
      const isNear =
        pointer !== null &&
        !isIcon &&
        pointer.x > PADDING - POINTER_RADIUS &&
        pointer.x < cssWidth - PADDING + POINTER_RADIUS &&
        pointer.y > PADDING - POINTER_RADIUS &&
        pointer.y < cssHeight - PADDING + POINTER_RADIUS

      mode = isMoving || isNear ? 'hole' : 'rest'

      if (mode === 'hole') {
        root.style.setProperty(
          '--hole-x',
          `${pointer && isNear ? pointer.x - PADDING : -9999}px`,
        )
        root.style.setProperty(
          '--hole-y',
          `${pointer && isNear ? pointer.y - PADDING : -9999}px`,
        )
      }
    }

    if (root.dataset.dots !== mode) {
      root.dataset.dots = mode
    }

    const isSettling = !isBlock && !isIntroDone

    if (isMoving || isSettling || pointer || now < redrawUntil) {
      frame = requestAnimationFrame(tick)
    }
  }

  const start = (): void => {
    if (!frame && !disposed) {
      frame = requestAnimationFrame(tick)
    }
  }

  const makeDot = (
    homeX: number,
    homeY: number,
    progress: number,
    isIntro: boolean,
    glyph?: string,
  ): Dot => {
    const angle = Math.random() * Math.PI * 2
    const distance = isIntro ? 30 + Math.random() * (PADDING - 30) : 0

    return {
      delay: isIntro ? progress * INTRO_SWEEP_MS + Math.random() * 250 : 0,
      glyph,
      homeX,
      homeY,
      velocityX: 0,
      velocityY: 0,
      x: homeX + Math.cos(angle) * distance,
      y: homeY + Math.sin(angle) * distance,
    }
  }

  /* Block variant: the text as ANSI Shadow letters, one particle per cell. */
  const buildBlock = (isIntro: boolean): Layout | null => {
    const available = root.getBoundingClientRect().width
    const words = (text.textContent ?? '')
      .toUpperCase()
      .split(/\s+/)
      .map((word) => {
        const rows = Array.from({ length: BLOCK_ROWS }, () => '')

        for (const character of word) {
          if (character in ANSI_SHADOW) {
            ANSI_SHADOW[character].forEach((row, index) => {
              rows[index] += row
            })
          }
        }

        return rows
      })
      .filter((rows) => rows[0].length)

    if (!available || !words.length) {
      return null
    }

    const widest = Math.max(...words.map((rows) => rows[0].length))
    const size = Math.min(MAX_CELL, available / widest)
    const columns = Math.floor(available / size + 0.001)
    const lines: string[][] = []

    for (const word of words) {
      const last = lines.at(-1)

      if (last && last[0].length + BLOCK_SPACE + word[0].length <= columns) {
        lines[lines.length - 1] = last.map(
          (row, index) => row + ' '.repeat(BLOCK_SPACE) + word[index],
        )
      } else {
        lines.push(word)
      }
    }

    const rowHeight = size * 2
    const lineAdvance = rowHeight * (BLOCK_ROWS + 0.5)
    const nextDots: Dot[] = []

    lines.forEach((rows, lineIndex) => {
      rows.forEach((row, rowIndex) => {
        Array.from(row).forEach((glyph, column) => {
          if (glyph !== ' ') {
            nextDots.push(
              makeDot(
                column * size + PADDING,
                lineIndex * lineAdvance + rowIndex * rowHeight + PADDING,
                column / columns,
                isIntro,
                glyph,
              ),
            )
          }
        })
      })
    })

    const height = lineAdvance * (lines.length - 1) + rowHeight * BLOCK_ROWS

    root.style.height = `${Math.ceil(height)}px`

    return { cell: size, dots: nextDots, height, radius: 1 }
  }

  /* Dot variant: sample the rendered text on a grid, one dot per hit. */
  const buildDots = (isIntro: boolean): Layout | null => {
    const node = text.firstChild
    const rootRect = root.getBoundingClientRect()

    if (!node || !rootRect.width || !rootRect.height) {
      return null
    }

    const style = getComputedStyle(text)
    const ratio = window.devicePixelRatio || 1

    /* Whole device pixels for the grid and the squares keep the edges sharp. */
    const stepDevice = Math.max(
      1,
      Math.round(
        Math.max(MIN_STEP, parseFloat(style.fontSize) / DOTS_PER_EM) * ratio,
      ),
    )
    const step = stepDevice / ratio
    const half = step / 2
    const buffer = document.createElement('canvas')

    /*
     * A canvas draws text with the font smoothing that it inherits, and only
     * while it is in the document. Outside the document, the text comes out
     * heavier than the real text. So the buffer sits in the root, not shown,
     * while it is drawn.
     */
    buffer.style.cssText = 'position:absolute;visibility:hidden'
    root.append(buffer)

    const bufferContext = buffer.getContext('2d', { willReadFrequently: true })

    if (!bufferContext) {
      buffer.remove()

      return null
    }

    buffer.width = Math.ceil(rootRect.width * ratio)
    buffer.height = Math.ceil(rootRect.height * ratio)
    bufferContext.scale(ratio, ratio)
    bufferContext.fillStyle = style.color
    bufferContext.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`
    bufferContext.textBaseline = 'alphabetic'

    const svg = text.querySelector('svg')

    if (svg) {
      /* Icon: fill the SVG paths, scaled from the viewBox to the element. */
      const box = svg.viewBox.baseVal
      const svgRect = svg.getBoundingClientRect()

      bufferContext.translate(
        svgRect.left - rootRect.left,
        svgRect.top - rootRect.top,
      )
      bufferContext.scale(
        svgRect.width / box.width,
        svgRect.height / box.height,
      )
      bufferContext.translate(-box.x, -box.y)
      svg.querySelectorAll('path').forEach((path) => {
        bufferContext.fill(new Path2D(path.getAttribute('d') ?? ''))
      })
    } else {
      const ascent = bufferContext.measureText('H').fontBoundingBoxAscent
      const content = node.textContent ?? ''
      const range = document.createRange()
      const probe = document.createElement('span')

      /*
       * An empty inline block sits on the baseline of the first line. That
       * gives the distance from the top of a glyph rectangle to the baseline
       * as the browser paints it. Font metrics alone can be half a pixel off.
       */
      probe.style.cssText =
        'display:inline-block;height:0;vertical-align:baseline;width:0'
      text.insertBefore(probe, node)

      const baseline = probe.getBoundingClientRect().top

      probe.remove()

      /*
       * A full line in one call puts every glyph where the browser puts it,
       * with its own kerning and sub-pixel steps. That needs the canvas to
       * apply the letter spacing. If it cannot, draw one glyph at a time at
       * the position from the DOM, which can be a device pixel off.
       */
      const canSpace = 'letterSpacing' in bufferContext
      const byLine = canSpace || style.letterSpacing === 'normal'

      if (canSpace && style.letterSpacing !== 'normal') {
        bufferContext.letterSpacing = style.letterSpacing
      }

      let line = ''
      let lineLeft = 0
      let lineTop: number | undefined
      let rise: number | undefined

      const flush = (): void => {
        if (line && lineTop !== undefined && rise !== undefined) {
          /* The browser paints a baseline on a whole device pixel. */
          bufferContext.fillText(
            line,
            lineLeft,
            Math.round((lineTop + rise) * ratio) / ratio,
          )
        }

        line = ''
      }

      for (let index = 0; index < content.length; index += 1) {
        range.setStart(node, index)
        range.setEnd(node, index + 1)

        const [glyphRect] = range.getClientRects()

        if (glyphRect) {
          const top = glyphRect.top - rootRect.top

          rise ??= baseline > glyphRect.top ? baseline - glyphRect.top : ascent

          /* A new line, or one glyph for each call. */
          if (!byLine || lineTop === undefined || Math.abs(top - lineTop) > 1) {
            flush()
            lineLeft = glyphRect.left - rootRect.left
            lineTop = top
          }

          line += content[index]
        }
      }

      flush()
    }

    const { data } = bufferContext.getImageData(
      0,
      0,
      buffer.width,
      buffer.height,
    )
    const nextDots: Dot[] = []

    buffer.remove()

    const columns = Math.floor(buffer.width / stepDevice)
    const rows = Math.floor(buffer.height / stepDevice)

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        let total = 0

        /* Average the ink over the whole cell, not one sample point. */
        for (let offsetY = 0; offsetY < stepDevice; offsetY += 1) {
          for (let offsetX = 0; offsetX < stepDevice; offsetX += 1) {
            total +=
              data[
                ((row * stepDevice + offsetY) * buffer.width +
                  column * stepDevice +
                  offsetX) *
                  4 +
                  3
              ]
          }
        }

        const ink = total / (stepDevice * stepDevice)

        if (ink > FAINT_THRESHOLD) {
          const dot = makeDot(
            column * step + half + PADDING,
            row * step + half + PADDING,
            column / columns,
            isIntro,
          )

          dot.faint = ink <= INK_THRESHOLD
          nextDots.push(dot)
        }
      }
    }

    return {
      cell: 0,
      dots: nextDots,
      height: rootRect.height,
      radius: half,
      source: buffer,
      sourceStep: stepDevice,
    }
  }

  const build = (): void => {
    const isIntro = !hasPlayedIntro && !reduceMotion
    const layout = isBlock ? buildBlock(isIntro) : buildDots(isIntro)

    if (!layout) {
      return
    }

    const ratio = window.devicePixelRatio || 1
    const width = root.getBoundingClientRect().width + PADDING * 2
    const height = layout.height + PADDING * 2

    ;({ cell, dots, radius, sourceStep = 0 } = layout)
    pattern = layout.source
      ? context.createPattern(layout.source, 'no-repeat')
      : null
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    cssHeight = height
    cssWidth = width
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.style.inset = `${-PADDING}px auto auto ${-PADDING}px`

    if (!hasPlayedIntro) {
      hasPlayedIntro = true
      introStart = performance.now()
    }

    root.dataset.dots ??= 'on'
    start()
  }

  const handlePointerMove = (event: PointerEvent): void => {
    if (reduceMotion) {
      return
    }

    const rect = canvas.getBoundingClientRect()

    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top }
    start()
  }

  /* Focus and light or dark mode change the text color. Redraw to match. */
  const handleColorChange = (): void => {
    redrawUntil = performance.now() + COLOR_REDRAW_MS
    start()
  }

  const handlePointerLeave = (): void => {
    pointer = null
  }

  /* A finger has no hover. When it lifts, the pointer is gone. */
  const handlePointerEnd = (event: PointerEvent): void => {
    if (event.pointerType !== 'mouse') {
      pointer = null
    }
  }

  const colorScheme = window.matchMedia('(prefers-color-scheme: dark)')
  const observer = new ResizeObserver(() => build())

  void document.fonts.ready.then(() => {
    if (!disposed) {
      observer.observe(root)
    }
  })

  colorScheme.addEventListener('change', handleColorChange)
  link?.addEventListener('focus', handleColorChange)
  link?.addEventListener('blur', handleColorChange)
  window.addEventListener('pointermove', handlePointerMove, { passive: true })
  window.addEventListener('pointerdown', handlePointerMove, { passive: true })
  window.addEventListener('pointerup', handlePointerEnd)
  window.addEventListener('pointercancel', handlePointerEnd)
  document.documentElement.addEventListener('pointerleave', handlePointerLeave)

  return () => {
    disposed = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    colorScheme.removeEventListener('change', handleColorChange)
    link?.removeEventListener('focus', handleColorChange)
    link?.removeEventListener('blur', handleColorChange)
    window.removeEventListener('pointermove', handlePointerMove)
    window.removeEventListener('pointerdown', handlePointerMove)
    window.removeEventListener('pointerup', handlePointerEnd)
    window.removeEventListener('pointercancel', handlePointerEnd)
    document.documentElement.removeEventListener(
      'pointerleave',
      handlePointerLeave,
    )
    delete root.dataset.dots
    root.style.removeProperty('--hole-x')
    root.style.removeProperty('--hole-y')
    root.style.removeProperty('height')
  }
}
