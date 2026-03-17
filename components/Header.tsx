'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Home, Briefcase, BookOpen, Mail } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const router = useRouter()

  useEffect(() => {
    const sections = ['home', 'projects', 'experience', 'contact']
    
    const handleScroll = () => {
      const headerH = document.querySelector('header')?.clientHeight ?? 0;
      const y = headerH + 1;

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
    setActiveSection(id);
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
    <header className="sticky top-0 z-50 bg-gray-800/50 backdrop-blur-xl border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <motion.span
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
            >
              Portfolio
            </motion.span>
          </Link>
          
          <nav className="hidden md:flex space-x-2">
            {navItems.map((item, index) => (
              <motion.div
                key={item.href}
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Button
                  variant={activeSection === item.href.slice(1) ? "secondary" : "ghost"}
                  onClick={(e) => {
                    e.preventDefault();
                    const id = item.href.slice(1);
                    scrollToSection(id);
                  }}
                  className={`flex items-center space-x-2 transition-all duration-300 ${
                    activeSection === item.href.slice(1) 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <motion.span
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.3 }}
                  >
                    <item.icon className="w-4 h-4" />
                  </motion.span>
                  <span>{item.label}</span>
                </Button>
              </motion.div>
            ))}
          </nav>
          
          <div className="flex items-center space-x-2">
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                size="icon"
                onClick={handleAdminClick}
                className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 border-0 shadow-md shadow-purple-500/30"
              >
                <User className="h-4 w-4" />
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
                className="text-gray-300 hover:text-white"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={isOpen ? 'close' : 'open'}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
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
            className="md:hidden bg-gray-800/80 backdrop-blur-xl border-t border-gray-700"
          >
            <nav className="max-w-7xl mx-auto px-6 py-4 space-y-2">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Button
                    variant={activeSection === item.href.slice(1) ? "secondary" : "ghost"}
                    onClick={(e) => {
                      e.preventDefault();
                      const id = item.href.slice(1);
                      scrollToSection(id);
                      setIsOpen(false);
                    }}
                    className={`w-full justify-start flex items-center space-x-2 ${
                      activeSection === item.href.slice(1) 
                        ? 'bg-blue-600 text-white hover:bg-blue-700' 
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}