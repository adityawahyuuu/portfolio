'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Home, Code, Briefcase, BookOpen, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const router = useRouter()

  useEffect(() => {
    const sections = ['home', 'projects', 'experience', 'contact']
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)

      // pakai tinggi header sebagai ambang
      const headerH = document.querySelector('header')?.clientHeight ?? 0;
      const y = headerH + 1; // garis cek sedikit di bawah header

      const currentSection = sections.find(section => {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          return rect.top <= y && rect.bottom >= y
        }
        return false
      })

      if (currentSection) {
        setActiveSection(currentSection)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveSection(id); // update segera, kalau scroll minim tidak terdeteksi
  };

  const handleAdminClick = () => {
    router.push('/login');
  };

  const navItems = [
    { href: '#home', label: 'Home', icon: Home },
    { href: '#projects', label: 'Projects', icon: Briefcase },
    { href: '#experience', label: 'Experience', icon: BookOpen },
    { href: '#contact', label: 'Contact', icon: Mail },
  ]

  return (
    <header className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-background/70 backdrop-blur-xl shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold transition-colors duration-300 hover:text-primary/80">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-pink-500"
            >
              Portfolio
            </motion.span>
          </Link>
          
          <nav className="hidden md:flex space-x-1">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link 
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();                 // hindari jump hash
                    const id = item.href.slice(1);
                    scrollToSection(id);
                  }}
                  className={`px-3 py-2 rounded-full flex items-center space-x-1 transition-all duration-300 ${
                    activeSection === item.href.slice(1) 
                      ? 'text-primary bg-primary/10 shadow-primary/20' 
                      : 'text-muted-foreground '
                  }`}
                >
                  <motion.span
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.span>
                  <span className="relative">
                    {item.label}
                    {activeSection === item.href.slice(1) && (
                      <motion.span
                        layoutId="activeSection"
                        className="absolute inset-0"
                        initial={false}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </span>
                </Link>
              </motion.div>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleAdminClick}
                className="transition-colors duration-300 hover:text-primary"
              >
                <User className="h-[1.2rem] w-[1.2rem]" />
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                className="transition-colors duration-300 hover:text-primary"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="h-[1.2rem] w-[1.2rem]" /> : <Menu className="h-[1.2rem] w-[1.2rem]" />}
                  </motion.div>
                </AnimatePresence>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background/80 backdrop-blur-xl border-t border-border"
          >
            <nav className="flex flex-col items-center py-4">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="w-full"
                >
                  <Link 
                    href={item.href} 
                    className={`py-2 px-4 w-full flex items-center space-x-2 transition-all duration-300 ${
                      activeSection === item.href.slice(1) 
                        ? 'text-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <motion.span
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      <item.icon className="w-4 h-4" />
                    </motion.span>
                    <span>{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}