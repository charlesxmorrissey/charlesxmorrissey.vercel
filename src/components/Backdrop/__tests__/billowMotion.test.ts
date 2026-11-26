import { billowMotion } from '../billowMotion'

const INDEXES = Array.from({ length: 9 }, (_, index) => index)

const parts = (transform: string) =>
  (transform.match(/-?\d+(\.\d+)?/g) ?? []).map(Number)

describe('billowMotion', () => {
  it('starts the first billow on the first keyframe', () => {
    expect(billowMotion(0)).toEqual({
      animationDelay: '0s',
      animationDirection: 'alternate',
      animationDuration: '9s',
      transform: 'translate(-5%, 5%) scale(0.94, 1) rotate(-2deg)',
    })
  })

  it('runs every second billow in the opposite direction', () => {
    expect(
      INDEXES.map((index) => billowMotion(index).animationDirection),
    ).toEqual(
      INDEXES.map((index) => (index % 2 ? 'alternate-reverse' : 'alternate')),
    )
  })

  /*
   * 3.1s into an 11.5s reversed run is 73% along the keyframes, so the pose
   * sits between the 50% and the 100% keyframe.
   */
  it('puts a billow with a negative delay part of the way along', () => {
    const [translateX, translateY, scaleX, scaleY, rotate] = parts(
      billowMotion(1).transform,
    )

    expect(billowMotion(1).animationDelay).toBe('-3.1s')
    expect(translateX).toBeGreaterThan(1.5)
    expect(translateX).toBeLessThan(5)
    expect(translateY).toBeLessThan(-2)
    expect(translateY).toBeGreaterThan(-6)
    expect(scaleX).toBeGreaterThan(1.05)
    expect(scaleY).toBeGreaterThan(0.95)
    expect(rotate).toBeLessThan(1.5)
  })

  it.each(INDEXES)('keeps billow %i inside the keyframe range', (index) => {
    const [translateX, translateY, scaleX, scaleY, rotate] = parts(
      billowMotion(index).transform,
    )

    expect(translateX).toBeGreaterThanOrEqual(-5)
    expect(translateX).toBeLessThanOrEqual(5)
    expect(translateY).toBeGreaterThanOrEqual(-6)
    expect(translateY).toBeLessThanOrEqual(5)
    expect(scaleX).toBeGreaterThanOrEqual(0.94)
    expect(scaleX).toBeLessThanOrEqual(1.08)
    expect(scaleY).toBeGreaterThanOrEqual(0.95)
    expect(scaleY).toBeLessThanOrEqual(1.04)
    expect(rotate).toBeGreaterThanOrEqual(-2)
    expect(rotate).toBeLessThanOrEqual(1.5)
  })
})
