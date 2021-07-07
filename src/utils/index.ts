export const siteData = {
  name: 'Charles X. Morrissey',
  title: 'Senior Front End Engineer',
  description:
    'I build accessible web applications using technologies like Vue, React, Node, ES6, Webpack, and more.',
}

export const setBackground = (element: HTMLElement) => {
  const random = (min: number, max: number) => Math.random() * (max - min) + min
  const randomColor = () => {
    const h = Math.floor(random(0, 360))
    const s = Math.floor(random(50, 100))
    const l = Math.floor(random(50, 100))

    return `hsl(${h}, ${s}%, ${l}%)`
  }

  element.style.setProperty('--color-1', randomColor())
  element.style.setProperty('--color-2', randomColor())
  element.style.setProperty('--color-3', randomColor())
  element.style.setProperty('--color-4', randomColor())
}
