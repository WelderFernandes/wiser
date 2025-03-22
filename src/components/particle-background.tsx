'use client'

import type React from 'react'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
}

interface ParticleBackgroundProps {
  isDarkMode: boolean
}

const ParticleBackground: React.FC<ParticleBackgroundProps> = ({
  isDarkMode,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const particlesRef = useRef<Particle[]>([])
  const animationFrameRef = useRef<number>(0)

  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const canvas = canvasRef.current
        const width = window.innerWidth
        const height = window.innerHeight

        canvas.width = width
        canvas.height = height
        setDimensions({ width, height })

        const particleCount = Math.floor((width * height) / 15000)
        const particles: Particle[] = []

        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.3,
            speedY: (Math.random() - 0.5) * 0.3,
            opacity: Math.random() * 0.5 + 0.1,
          })
        }

        particlesRef.current = particles
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [])

  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const animate = () => {
      ctx.clearRect(0, 0, dimensions.width, dimensions.height)

      particlesRef.current.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY

        if (particle.x < 0) particle.x = dimensions.width
        if (particle.x > dimensions.width) particle.x = 0
        if (particle.y < 0) particle.y = dimensions.height
        if (particle.y > dimensions.height) particle.y = 0

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = isDarkMode
          ? `rgba(255, 255, 255, ${particle.opacity})`
          : `rgba(0, 0, 0, ${particle.opacity})`
        ctx.fill()
      })

      ctx.strokeStyle = isDarkMode
        ? 'rgba(255, 255, 255, 0.03)'
        : 'rgba(0, 0, 0, 0.03)'
      ctx.lineWidth = 0.5

      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const p1 = particlesRef.current[i]
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameRef.current)
    }
  }, [dimensions, isDarkMode])

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}

export default ParticleBackground
