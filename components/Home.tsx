"use client"

import { useState } from "react"
import Image from "next/image"
import { Code, Mail, Phone } from "lucide-react"
import { FaLinkedinIn, FaGithub } from "react-icons/fa"
import { ContactData } from "@/types/contact"

interface HomeData {
  fullText: string
  subtitle: string
  image: string
  description1: string
  description2: string
  skills: Array<{ text: string; icon: string; techStack?: Array<{ name: string }>; workflow?: string[] }>
}

const SOCIAL_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  linkedin: FaLinkedinIn,
  github: FaGithub,
}

export default function Home({ data, contact }: { data: HomeData; contact?: ContactData | null }) {
  const [imageError, setImageError] = useState(false)

  if (!data) {
    return (
      <div className="p-8 flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
      </div>
    )
  }

  const hasValidImage = data.image && data.image.trim() !== "" && !imageError

  return (
    <section id="home" className="p-6 sm:p-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row items-start gap-6 sm:gap-10">

        {/* Left: bio */}
        <div className="flex-1 min-w-0">
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight animate-in fade-in slide-in-from-left-6 duration-600">
            Aditya Wahyu Pradhana
          </h1>
          <p className="mt-1 text-lg font-semibold text-blue-400 uppercase tracking-widest animate-in fade-in slide-in-from-left-6 duration-600" style={{ animationDelay: '80ms' }}>
            {data.subtitle || "Software Developer"}
          </p>

          <div className="mt-4 h-px bg-gray-700" />

          {/* Contact links */}
          <div className="mt-4 space-y-2 animate-in fade-in slide-in-from-left-6 duration-600" style={{ animationDelay: '160ms' }}>
            {contact?.email && (
              <a href={`mailto:${contact.email}`} className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 group">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="group-hover:text-blue-300 transition-colors">{contact.email}</span>
              </a>
            )}
            {contact?.phone && (
              <a
                href={`https://wa.me/${String(contact.phone).replace(/\D/g, '')}?text=${encodeURIComponent('Halo, saya ingin menghubungi Anda.')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 group"
              >
                <Phone className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="group-hover:text-green-300 transition-colors">{contact.phone}</span>
              </a>
            )}
            {contact?.socialLinks?.map((link) => {
              const Icon = SOCIAL_ICONS[link.icon]
              if (!Icon) return null
              return (
                <a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors duration-200 group"
                >
                  <Icon className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  <span className="group-hover:text-blue-300 transition-colors">{link.name}</span>
                </a>
              )
            })}
          </div>

          {/* Description */}
          <p className="mt-5 text-gray-300 text-sm leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-600" style={{ animationDelay: '240ms' }}>
            {data.description1}
          </p>
        </div>

        {/* Right: photo */}
        <div className="flex-shrink-0 animate-in fade-in slide-in-from-right-6 duration-600">
          {hasValidImage ? (
            <div className="relative w-28 h-28 sm:w-36 sm:h-36">
              <Image
                src={data.image}
                alt="Profile"
                fill
                style={{ objectFit: "cover" }}
                className="rounded-xl shadow-lg"
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="w-28 h-28 sm:w-36 sm:h-36 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl flex items-center justify-center border border-gray-600">
              <Code className="w-10 h-10 text-blue-400" />
            </div>
          )}
        </div>

      </div>
    </section>
  )
}
