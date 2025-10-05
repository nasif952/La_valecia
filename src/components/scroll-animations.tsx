'use client'

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger)
}

interface ScrollAnimationProps {
  children: React.ReactNode
  animation?: 'fadeIn' | 'slideUp' | 'slideLeft' | 'slideRight' | 'scale' | 'parallax'
  delay?: number
  duration?: number
  className?: string
}

export function ScrollAnimation({ 
  children, 
  animation = 'fadeIn', 
  delay = 0, 
  duration = 1,
  className = ''
}: ScrollAnimationProps) {
  const elementRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!elementRef.current) return

    const element = elementRef.current

    // Set initial state based on animation type
    switch (animation) {
      case 'fadeIn':
        gsap.set(element, { opacity: 0 })
        break
      case 'slideUp':
        gsap.set(element, { opacity: 0, y: 50 })
        break
      case 'slideLeft':
        gsap.set(element, { opacity: 0, x: 50 })
        break
      case 'slideRight':
        gsap.set(element, { opacity: 0, x: -50 })
        break
      case 'scale':
        gsap.set(element, { opacity: 0, scale: 0.8 })
        break
      case 'parallax':
        gsap.set(element, { y: 100 })
        break
    }

    // Create animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top 80%',
        end: 'bottom 20%',
        toggleActions: 'play none none reverse',
      },
      delay,
    })

    switch (animation) {
      case 'fadeIn':
        tl.to(element, { opacity: 1, duration })
        break
      case 'slideUp':
        tl.to(element, { opacity: 1, y: 0, duration, ease: 'power2.out' })
        break
      case 'slideLeft':
        tl.to(element, { opacity: 1, x: 0, duration, ease: 'power2.out' })
        break
      case 'slideRight':
        tl.to(element, { opacity: 1, x: 0, duration, ease: 'power2.out' })
        break
      case 'scale':
        tl.to(element, { opacity: 1, scale: 1, duration, ease: 'back.out(1.7)' })
        break
      case 'parallax':
        tl.to(element, { y: -100, duration: 2, ease: 'none' })
        break
    }

    return () => {
      tl.kill()
    }
  }, [animation, delay, duration])

  return (
    <div ref={elementRef} className={className}>
      {children}
    </div>
  )
}

// Hero parallax component
export function HeroParallax() {
  const heroRef = useRef<HTMLDivElement>(null)
  const textRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!heroRef.current || !textRef.current || !imageRef.current) return

    const hero = heroRef.current
    const text = textRef.current
    const image = imageRef.current

    // Create parallax effect
    gsap.to(image, {
      yPercent: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: hero,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    // Pin text section
    ScrollTrigger.create({
      trigger: text,
      start: 'top center',
      end: 'bottom center',
      pin: true,
      pinSpacing: false,
    })

    // Animate text elements
    gsap.fromTo(text.children, 
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: text,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <div ref={heroRef} className="relative h-screen overflow-hidden">
      <div 
        ref={imageRef}
        className="absolute inset-0 bg-gradient-to-br from-brand-primary/20 to-brand-primary/5"
        style={{ transform: 'translateY(0px)' }}
      />
      <div ref={textRef} className="relative z-10 flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Premium{' '}
            <span className="text-gradient">Futuristic</span>{' '}
            Apparel
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover our latest Drop Shoulder collection and Wintery essentials. 
            Designed for the modern generation who values style, comfort, and innovation.
          </p>
        </div>
      </div>
    </div>
  )
}

// Stagger animation for product grids
export function StaggerAnimation({ 
  children, 
  stagger = 0.1,
  className = ''
}: {
  children: React.ReactNode
  stagger?: number
  className?: string
}) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const container = containerRef.current
    const items = container.children

    gsap.fromTo(items,
      { opacity: 0, y: 30, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 80%',
          toggleActions: 'play none none reverse',
        },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [stagger])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
