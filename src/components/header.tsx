'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Menu, X, Calendar } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky flex justify-center top-0 z-50 w-full border-b border-primary/10 bg-background/80 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white">
            <Calendar className="h-4 w-4" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            AgendaFácil
          </span>
        </Link>
        <nav className="hidden md:flex gap-6">
          <Link
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Recursos
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Preços
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Clientes
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Blog
          </Link>
          <Link
            href="#"
            className="text-sm font-medium hover:text-primary transition-colors"
          >
            Contato
          </Link>
        </nav>
        <div className="hidden md:flex gap-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="border-primary/20 hover:bg-primary/10"
          >
            <Link href="#">Entrar</Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="bg-primary hover:bg-primary/90 text-white"
          >
            <Link href="#">Começar grátis</Link>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-primary/10 bg-background/95 backdrop-blur-lg"
          >
            <div className="container py-4 px-4 md:px-6 flex flex-col gap-4">
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary py-2 transition-colors"
              >
                Recursos
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary py-2 transition-colors"
              >
                Preços
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary py-2 transition-colors"
              >
                Clientes
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary py-2 transition-colors"
              >
                Blog
              </Link>
              <Link
                href="#"
                className="text-sm font-medium hover:text-primary py-2 transition-colors"
              >
                Contato
              </Link>
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  variant="outline"
                  asChild
                  className="border-primary/20 hover:bg-primary/10"
                >
                  <Link href="#">Entrar</Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white"
                >
                  <Link href="#">Começar grátis</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
