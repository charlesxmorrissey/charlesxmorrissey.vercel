/**
 * Sets a style tag containing random color variables.
 *
 * @param {HTMLElement} element The element to set inline styles on.
 */
export const setBackground = (element: HTMLElement | null) => {
  const total = 4
  const random = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min) + min)

  const randomColor = (): string => {
    const h = random(0, 360)
    const s = random(50, 100)
    const l = random(50, 100)

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  for (let i = 0; i < total; i++) {
    element?.style.setProperty(`--color-${i + 1}`, randomColor())
  }
}
