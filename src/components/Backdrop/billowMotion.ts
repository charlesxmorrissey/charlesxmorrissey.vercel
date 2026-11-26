/*
 * Timing of one billow, and the pose it has when its animation starts.
 *
 * Chrome can draw a billow for a frame or two without its animation while the
 * page loads. The billow then shows its plain transform. That transform is the
 * starting pose, so those frames look the same as the animated ones.
 */

type Pose = [
  translateX: number,
  translateY: number,
  scaleX: number,
  scaleY: number,
  rotate: number,
]

/* Must match the billow-drift keyframes (0%, 50%, 100%) in the CSS file. */
const KEYFRAMES: Pose[] = [
  [-5, 5, 0.94, 1, -2],
  [1.5, -2, 1.05, 0.95, 1.5],
  [5, -6, 1.08, 1.04, -1],
]

/* ease-in-out is cubic-bezier(0.42, 0, 0.58, 1). */
const bezier = (first: number, second: number, time: number) =>
  3 * (1 - time) ** 2 * time * first +
  3 * (1 - time) * time ** 2 * second +
  time ** 3

const easeInOut = (progress: number) => {
  let low = 0
  let high = 1

  for (let step = 0; step < 40; step += 1) {
    const middle = (low + high) / 2

    if (bezier(0.42, 0.58, middle) < progress) {
      low = middle
    } else {
      high = middle
    }
  }

  return bezier(0, 1, (low + high) / 2)
}

const round = (value: number) => Math.round(value * 1000) / 1000

export const billowMotion = (index: number) => {
  const delay = index * -3.1
  const duration = 9 + (index % 4) * 2.5
  const startsReversed = index % 2 === 1

  const cycles = -delay / duration
  const cycle = Math.floor(cycles)
  const isReversed = (cycle % 2 === 1) !== startsReversed
  const progress = isReversed ? 1 - (cycles - cycle) : cycles - cycle

  const segment = progress < 0.5 ? 0 : 1
  const eased = easeInOut(progress * 2 - segment)

  const [translateX, translateY, scaleX, scaleY, rotate] = KEYFRAMES[
    segment
  ].map((from, part) =>
    round(from + (KEYFRAMES[segment + 1][part] - from) * eased),
  )

  return {
    animationDelay: `${delay}s`,
    animationDirection: startsReversed ? 'alternate-reverse' : 'alternate',
    animationDuration: `${duration}s`,
    transform: `translate(${translateX}%, ${translateY}%) scale(${scaleX}, ${scaleY}) rotate(${rotate}deg)`,
  }
}
