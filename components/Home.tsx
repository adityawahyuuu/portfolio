"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { Code, ChevronDown, Home as HomeIcon } from "lucide-react"
import { SiChromewebstore, SiZendesk, SiCloudflare, SiSqlite } from "react-icons/si"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
    return (
      <div className="p-6">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    )
  }

  const imageUrl = data.image
  const hasValidImage = imageUrl && imageUrl.trim() !== "" && !imageError

  return (
    <section id="home" className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-blue-500">
            <HomeIcon className="w-5 h-5" />
          </div>
          About Me
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Profile Section */}
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/3"
          >
            <div className="relative w-[280px] h-[280px] mx-auto">
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
                <div className="w-full h-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl shadow-2xl flex items-center justify-center border border-gray-600">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-500/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Code className="w-8 h-8 text-blue-400" />
                    </div>
                    <p className="text-gray-300 text-sm">Profile Image</p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="lg:w-2/3"
          >
            <Card className="bg-gray-700/50 border-gray-600">
              <CardContent className="p-6">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-3xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                >
                  Hello I'm Aditya Wahyu Pradhana
                </motion.h2>
                <h3 className="text-xl font-semibold mb-4 text-blue-300">{data.subtitle}</h3>
                <p className="text-gray-300 mb-4 leading-relaxed">
                  {data.description1}
                </p>
                <AnimatePresence>
                  {showMore && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-gray-300 leading-relaxed mb-4"
                    >
                      {data.description2}
                    </motion.p>
                  )}
                </AnimatePresence>
                <Button
                  variant="ghost"
                  onClick={() => setShowMore(!showMore)}
                  className="text-blue-400 hover:text-blue-300 p-0 h-auto font-normal"
                >
                  <span className="flex items-center">
                    {showMore ? "Read Less" : "Read More"}
                    <ChevronDown className={`ml-1 w-4 h-4 transform transition-transform ${showMore ? "rotate-180" : ""}`} />
                  </span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Skills Section */}
        <div>
          <h4 className="text-xl font-semibold text-white mb-6 flex items-center">
            <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
            My Skills
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: SiChromewebstore, text: "Web Development", color: "from-blue-500 to-blue-600" },
              { icon: SiZendesk, text: "Desktop App Development", color: "from-purple-500 to-purple-600" },
              { icon: SiCloudflare, text: "App Deployment", color: "from-green-500 to-green-600" },
              { icon: SiSqlite, text: "Database Solutions", color: "from-yellow-500 to-yellow-600" },
            ].map((skill, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group"
              >
                <Card className="bg-gray-700/50 border-gray-600 hover:border-blue-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20">
                  <CardContent className="p-4 text-center">
                    <div className="flex justify-center mb-3">
                      <div className={`p-3 rounded-lg bg-gradient-to-br ${skill.color}`}>
                        <skill.icon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                      {skill.text}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </CardContent>
    </section>
  )
}