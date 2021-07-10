/**
 * Sets a style tag containing random color variables.
 *
 * @param {HTMLElement} element The element to set inline styles on.
 */
export const setBackground = (element: HTMLElement) => {
  const random = (min: number, max: number) =>
    Math.floor(Math.random() * (max - min) + min)
  const randomColor = () => {
    const h = random(0, 360)
    const s = random(50, 100)
    const l = random(50, 100)

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  element.style.setProperty('--color-1', randomColor())
  element.style.setProperty('--color-2', randomColor())
  element.style.setProperty('--color-3', randomColor())
  element.style.setProperty('--color-4', randomColor())
}
