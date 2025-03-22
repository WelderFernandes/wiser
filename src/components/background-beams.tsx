"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export const BackgroundBeams = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const beamRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (beamRef.current) {
        const rect = beamRef.current.getBoundingClientRect()
        setMousePosition({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div ref={beamRef} className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[100%] opacity-50"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(135, 95, 205, 0.15), transparent 40%)`,
        }}
      />
      <div className="absolute inset-0 bg-background [mask-image:radial-gradient(transparent,white)] opacity-90" />
    </div>
  )
}

