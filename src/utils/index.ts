/**
 * Seed the background gradient with a random base hue for this visit.
 *
 * Sets the `--hue-seed` custom property to a random angle; the gradient's
 * six stops are derived from it in CSS, and the `hue-cycle` animation rotates
 * the palette continuously from that seed.
 *
 * @param {HTMLElement} element The element to apply the seed to.
 */
export const setBackgroundHue = (element: HTMLElement): void => {
  element.style.setProperty('--hue-seed', `${Math.random() * 360}deg`)
}
