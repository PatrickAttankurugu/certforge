'use client'

import { useEffect, type ReactNode } from 'react'

export function LandingAnimations({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Scroll-triggered reveal animations using IntersectionObserver
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '-50px' }
    )

    // Observe all elements with data-animate
    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return <div className="landing-page">{children}</div>
}
