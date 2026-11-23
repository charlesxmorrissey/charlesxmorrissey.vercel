'use client'

import styles from './Backdrop.module.css'

/*
 * Runs while the HTML is parsed, before the first paint. It picks the default
 * gradient or one of the three studies at random. "?bg=name" forces one, for
 * testing. Without JavaScript, the default gradient stays.
 *
 * It also marks the backdrop with data-js. DotName uses that mark to hide the
 * plain text until its dots are ready, so the text does not flash first.
 */
const PICK_SCRIPT = `(function () {
  var options = ['current', 'smoke', 'max', 'cosmic']
  var forced = new URLSearchParams(location.search).get('bg')
  var backdrop = document.currentScript.previousElementSibling

  backdrop.dataset.js = 'on'

  backdrop.dataset.bg =
    options.indexOf(forced) > -1
      ? forced
      : options[Math.floor(Math.random() * options.length)]
})()`

/* Smoke billows, top to bottom. Units are 1/1000 of the plume square. */
const LAYERS = [
  { height: 74, width: 400, x: 520, y: 150 },
  { height: 86, width: 520, x: 470, y: 235 },
  { height: 78, width: 380, x: 560, y: 325 },
  { height: 84, width: 460, x: 480, y: 410 },
  { height: 72, width: 310, x: 540, y: 500 },
  { height: 64, width: 230, x: 490, y: 580 },
  { height: 54, width: 160, x: 520, y: 655 },
  { height: 44, width: 100, x: 500, y: 722 },
  { height: 38, width: 130, x: 505, y: 830 },
]

const BUMPS = [-0.6, -0.2, 0.25, 0.62]

export const Backdrop = () => (
  <>
    <div
      aria-hidden='true'
      className={styles.backdrop}
      data-bg='current'
      suppressHydrationWarning
    >
      <div className={`${styles.scene} ${styles.maxScene}`}>
        <div className={styles.stars} />
        <div className={styles.raysWindow}>
          <div className={styles.rays} />
        </div>
        <div className={styles.sun} />
        <svg
          className={styles.hills}
          preserveAspectRatio='none'
          viewBox='0 0 1000 300'
        >
          <path
            className={styles.hillBack}
            d='M0 140 C150 60 300 60 450 130 S750 200 1000 90 V300 H0Z'
          />
          <path
            className={styles.hillMid}
            d='M0 200 C200 110 350 230 550 170 S850 110 1000 190 V300 H0Z'
          />
          <path
            className={styles.hillFront}
            d='M0 250 C180 200 320 290 520 240 S820 200 1000 260 V300 H0Z'
          />
        </svg>
      </div>

      <div className={`${styles.scene} ${styles.plumeScene}`}>
        <div className={styles.stars} />
        <div className={styles.plume}>
          {LAYERS.map(({ height, width, x, y }, index) => {
            const boxHeight = height * 2.8
            const boxWidth = width * 2
            const side = index % 2 ? 1 : -1

            return (
              <svg
                className={styles.billow}
                key={`billow-${index}`}
                style={{
                  animationDelay: `${index * -3.1}s`,
                  animationDuration: `${17 + (index % 4) * 5}s`,
                  height: `${boxHeight / 10}%`,
                  left: `${(x - width) / 10}%`,
                  top: `${(y - height * 1.4) / 10}%`,
                  width: `${boxWidth / 10}%`,
                }}
                viewBox={`${-width} ${-height * 1.4} ${boxWidth} ${boxHeight}`}
              >
                <defs>
                  <linearGradient
                    gradientUnits='userSpaceOnUse'
                    id={`airbrush-${index}`}
                    x1='0'
                    x2='0'
                    y1={-height}
                    y2={height}
                  >
                    {[
                      ['0%', '92% 90%'],
                      ['42%', '88% 70%'],
                      ['78%', '82% 52%'],
                      ['100%', '76% 36%'],
                    ].map(([offset, tone]) => (
                      <stop
                        key={offset}
                        offset={offset}
                        style={{
                          stopColor: `hsl(calc(var(--plume-hue) + ${index} * var(--plume-step)) ${tone})`,
                        }}
                      />
                    ))}
                  </linearGradient>
                  <filter
                    filterUnits='userSpaceOnUse'
                    height={boxHeight}
                    id={`goo-${index}`}
                    width={boxWidth}
                    x={-width}
                    y={-height * 1.4}
                  >
                    <feGaussianBlur
                      in='SourceGraphic'
                      result='blur'
                      stdDeviation={height * 0.14}
                    />
                    <feColorMatrix
                      in='blur'
                      result='goo'
                      values='1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9'
                    />
                    <feMorphology
                      in='goo'
                      operator='dilate'
                      radius={height * 0.04}
                      result='fat'
                    />
                    <feFlood
                      result='ink'
                      style={{ floodColor: 'var(--plume-outline)' }}
                    />
                    <feComposite
                      in='ink'
                      in2='fat'
                      operator='in'
                      result='outline'
                    />
                    <feMerge>
                      <feMergeNode in='outline' />
                      <feMergeNode in='goo' />
                    </feMerge>
                  </filter>
                </defs>
                <g
                  fill={`url(#airbrush-${index})`}
                  filter={`url(#goo-${index})`}
                >
                  <ellipse rx={width * 0.5} ry={height * 0.5} />
                  {BUMPS.map((position, bump) => (
                    <ellipse
                      cx={position * width * 0.5}
                      cy={(bump % 2 ? 0.3 : -0.35) * height * side}
                      key={`bump-${bump}`}
                      rx={width * (0.16 + 0.04 * ((index + bump) % 3))}
                      ry={height * (0.5 + 0.1 * ((index * 2 + bump) % 3))}
                    />
                  ))}
                  {index % 3 === 1 && (
                    <ellipse
                      cx={side * width * 0.78}
                      cy={-height * 0.2}
                      rx={width * 0.13}
                      ry={height * 0.3}
                    />
                  )}
                </g>
              </svg>
            )
          })}
        </div>
      </div>
    </div>

    <script dangerouslySetInnerHTML={{ __html: PICK_SCRIPT }} />
  </>
)
