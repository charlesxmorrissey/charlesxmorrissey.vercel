/**
 * Return a random integer within the specified range [min, max).
 *
 * @param {number} min The minimum value (inclusive).
 * @param {number} max The maximum value (exclusive).
 * @returns {number} A random integer between min and max.
 * @throws {Error} If min is not less than max.
 */
const randomMinMax = (min: number, max: number): number => {
  if (min >= max) {
    throw new Error('min must be less than max')
  }

  return Math.floor(Math.random() * (max - min) + min)
}

interface HSLColorOptions {
  lightness?: { max?: number; min?: number }
  opacity?: number
  saturation?: { max?: number; min?: number }
}

/**
 * Generate a random HSL color string.
 *
 * @param {HSLColorOptions} [options] Configuration for saturation,
 * lightness, and opacity ranges.
 * @returns {string} HSL color string in the format "hsl(h s% l% / a%)".
 */
export const randomHSLColor = ({
  lightness: { max: lMax = 100, min: lMin = 50 } = {},
  opacity = 25,
  saturation: { max: sMax = 100, min: sMin = 50 } = {},
}: HSLColorOptions = {}): string => {
  const h = randomMinMax(0, 360)
  const s = randomMinMax(sMin, sMax)
  const l = randomMinMax(lMin, lMax)

  return `hsl(${h} ${s}% ${l}% / ${opacity}%)`
}

/**
 * Set CSS custom properties with random HSL colors on an element.
 *
 * @param {HTMLElement} element The element to apply styles to.
 * @param {number} [colorCount=4] The number of random colors to generate.
 */
export const setBackgroundStyles = (
  element: HTMLElement,
  colorCount: number = 6,
): void => {
  for (let i = 0; i < colorCount; i++) {
    element.style.setProperty(`--color-bg-${i + 1}`, randomHSLColor())
  }
}
