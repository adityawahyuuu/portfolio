"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Code, ChevronDown } from "lucide-react"
import { SiHtml5, SiFigma, SiAdobephotoshop, SiWebflow, SiFramer, SiRumahweb, SiChromewebstore, SiZendesk, SiCloudera, SiCloudflare, SiSqlite } from "react-icons/si"

interface HomeData {
  fullText: string
  subtitle: string
  image: string
  description1: string
  description2: string
  skills: { text: string; icon: string }[]
}

export default function Home({ data }: { data: HomeData }) {
  const [, setTypedText] = useState("")
  const [showMore, setShowMore] = useState(false)
  const [imageError, setImageError] = useState(false)

  useEffect(() => {
    if (data && data.fullText) {
      let i = 0
      const typingInterval = setInterval(() => {
        if (i < data.fullText.length) {
          setTypedText(data.fullText.slice(0, i + 1))
          i++
        } else {
          clearInterval(typingInterval)
        }
      }, 150)

      return () => clearInterval(typingInterval)
    }
  }, [data])

  if (!data) {
    return <div>Loading...</div>
  }

  const imageUrl = data.image
  const hasValidImage = imageUrl && imageUrl.trim() !== "" && !imageError

  return (
    <section id="home" className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12 mb-20">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3"
          >
            <div className="relative w-[300px] h-[300px]">
              {hasValidImage ? (
                <Image
                  src={imageUrl || "/placeholder.svg"}
                  alt="Profile"
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-2xl shadow-2xl"
                  onError={() => setImageError(true)}
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-2xl shadow-2xl flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-pink-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-pink-400" />
                    </div>
                    <p className="text-pink-300 text-sm">Profile Image</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-pink-500/20 to-transparent rounded-2xl" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-2/3"
          >
            <div className="bg-[#2A2A2A] rounded-2xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-pink-500 to-pink-600 rounded-bl-[100px] opacity-90" />

              <div className="relative z-10">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-pink-400"
                >
                  Hello I'm Aditya Wahyu Pradhana
                </motion.h2>
                <h3 className="text-2xl font-semibold mb-4 text-pink-400">{data.subtitle}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {data.description1}
                </p>
                <AnimatePresence>
                  {showMore && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-300 leading-relaxed"
                    >
                      {data.description2}
                    </motion.p>
                  )}
                </AnimatePresence>
                <button
                  onClick={() => setShowMore(!showMore)}
                  className="text-pink-400 hover:text-pink-300 transition-colors flex items-center mt-4"
                >
                  {showMore ? "Read Less" : "Read More"}
                  <ChevronDown className={`ml-1 transform transition-transform ${showMore ? "rotate-180" : ""}`} />
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {[
            { icon: SiChromewebstore, text: "Web Development", color: "from-pink-500 to-pink-600" },
            { icon: SiZendesk, text: "Desktop App Development", color: "from-[#E44D26] to-[#F16529]" },
            { icon: SiCloudflare, text: "App Deployment", color: "from-[#E44D26] to-[#F16529]" },
            { icon: SiSqlite, text: "Database Solutions", color: "from-[#E44D26] to-[#F16529]" },
          ].map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group"
            >
              <div
                className={`bg-[#2A2A2A] rounded-xl p-6 relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:shadow-pink-500/20`}
              >
                <div
                  className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 bg-gradient-to-br ${skill.color}`}
                />
                <div className="relative z-10">
                  <div className="flex justify-center mb-4">
                    <skill.icon className="w-12 h-12 text-pink-500 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <p className="text-center text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                    {skill.text}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
