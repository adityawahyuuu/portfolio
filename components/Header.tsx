'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, User, Home, Briefcase, BookOpen, Mail } from 'lucide-react'
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
    const headerHeight = document.querySelector('header')?.clientHeight ?? 0;
    const top = el.getBoundingClientRect().top + window.scrollY - headerHeight;
    window.scrollTo({ top, behavior: 'smooth' });
    setActiveSection(id);
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
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 animate-in fade-in slide-in-from-top-4 duration-500">
              Portfolio
            </span>
          </Link>

          <nav className="hidden md:flex space-x-2">
            {navItems.map((item, index) => (
              <div
                key={item.href}
                className="animate-in fade-in slide-in-from-top-4 duration-500"
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Button
                  variant={activeSection === item.href.slice(1) ? "secondary" : "ghost"}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollToSection(item.href.slice(1));
                  }}
                  className={`flex items-center space-x-2 transition-all duration-300 ${
                    activeSection === item.href.slice(1)
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Button>
              </div>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Button
              size="icon"
              onClick={() => router.push('/login')}
              className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:opacity-90 border-0 shadow-md shadow-purple-500/30 hover:scale-110 active:scale-90 transition-transform duration-200"
            >
              <User className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-gray-300 hover:text-white hover:scale-110 active:scale-90 transition-transform duration-200"
            >
              {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu — CSS max-height transition */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-gray-800/80 backdrop-blur-xl border-t border-gray-700">
          <nav className="max-w-7xl mx-auto px-6 py-4 space-y-2">
            {navItems.map((item, index) => (
              <div
                key={item.href}
                style={{ animationDelay: `${index * 75}ms` }}
              >
                <Button
                  variant={activeSection === item.href.slice(1) ? "secondary" : "ghost"}
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    setTimeout(() => scrollToSection(item.href.slice(1)), 350);
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
              </div>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}
