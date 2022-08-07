/**
 * Returns a random number based on the minimum and maximum values provided.
 *
 * @param {number} min The minimum number.
 * @param {number} max The maximum number.
 * @returns {number} The random number range.
 */
const randomMinMax = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min) + min)

/**
 * Sets a style tag containing random color variables.
 *
 * @param {HTMLElement} element The element to set the inline styles on.
 */
export const setBackgroundStyles = (element: HTMLElement | null) => {
  const total = 4

  const randomColor = (): string => {
    const h = randomMinMax(0, 360)
    const s = randomMinMax(50, 100)
    const l = randomMinMax(50, 100)

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  for (let i = 0; i < total; i++) {
    element?.style.setProperty(`--color-${i + 1}`, randomColor())
  }
}
