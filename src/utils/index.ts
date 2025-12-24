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

/**
 * Generate a random HSL color string.
 *
 * @param {number} [saturationMin=50] Minimum saturation percentage.
 * @param {number} [saturationMax=100] Maximum saturation percentage.
 * @param {number} [lightnessMin=50] Minimum lightness percentage.
 * @param {number} [lightnessMax=100] Maximum lightness percentage.
 * @param {number} [opacity=25] Opacity as a percentage.
 * @returns {string} HSL color string in the format "hsl(h s% l% / a%)".
 */
export const randomHSLColor = (
  saturationMin: number = 50,
  saturationMax: number = 100,
  lightnessMin: number = 50,
  lightnessMax: number = 100,
  opacity: number = 25,
): string => {
  const h = randomMinMax(0, 360)
  const s = randomMinMax(saturationMin, saturationMax)
  const l = randomMinMax(lightnessMin, lightnessMax)

  return `hsl(${h} ${s}% ${l}% / ${opacity}%)`
}

/**
 * Set CSS custom properties with random HSL colors on an element.
 *
 * @param {HTMLElement | null} element The element to apply styles to.
 * @param {number} [colorCount=4] The number of random colors to generate.
 * @throws {Error} If element is null or not a valid HTMLElement.
 */
export const setBackgroundStyles = (
  element: HTMLElement | null,
  colorCount: number = 4,
): void => {
  if (!element) {
    throw new Error('A valid HTMLElement must be provided.')
  }

  for (let i = 0; i < colorCount; i++) {
    element.style.setProperty(`--color-bg-${i + 1}`, randomHSLColor())
  }
}
