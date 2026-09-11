import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function PageAnimations() {
  const { pathname } = useLocation()

  useEffect(() => {
    let revertAnimations = () => {}

    const frame = window.requestAnimationFrame(() => {
      const main = document.querySelector('main')

      if (!main) return

      const media = gsap.matchMedia()

      media.add('(prefers-reduced-motion: no-preference)', () => {
        const context = gsap.context(() => {
          const firstSection = main.querySelector('section')

          if (firstSection) {
            const intro = firstSection.querySelectorAll('.eyebrow, h1, h2, h1 + p, h2 + p, .button-primary, button')
            gsap.from(intro, {
              y: 24,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.09,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
            })
          }

          const revealElements = main.querySelectorAll('section:not(:first-of-type) .eyebrow, section:not(:first-of-type) h2, section:not(:first-of-type) .icon-disc, section:not(:first-of-type) img, section:not(:first-of-type) form')

          revealElements.forEach((element) => {
            gsap.from(element, {
              y: 32,
              autoAlpha: 0,
              duration: 0.75,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: {
                trigger: element,
                start: 'top 88%',
                once: true,
              },
            })
          })

          const sections = main.querySelectorAll('section:not(:first-of-type)')

          sections.forEach((section) => {
            const cards = section.querySelectorAll('article')

            if (cards.length > 0) {
              gsap.from(cards, {
                y: 38,
                autoAlpha: 0,
                duration: 0.8,
                stagger: 0.12,
                ease: 'power3.out',
                clearProps: 'transform,opacity,visibility',
                scrollTrigger: {
                  trigger: section,
                  start: 'top 82%',
                  once: true,
                },
              })
            }
          })

          const footer = document.querySelector('footer')

          if (footer) {
            gsap.from(footer.children, {
              y: 24,
              autoAlpha: 0,
              duration: 0.8,
              stagger: 0.1,
              ease: 'power3.out',
              clearProps: 'transform,opacity,visibility',
              scrollTrigger: {
                trigger: footer,
                start: 'top 92%',
                once: true,
              },
            })
          }
        }, main)

        return () => context.revert()
      })

      ScrollTrigger.refresh()

      revertAnimations = () => media.revert()
    })

    return () => {
      window.cancelAnimationFrame(frame)
      revertAnimations()
    }
  }, [pathname])

  return null
}
