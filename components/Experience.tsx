"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, ChevronDown, ChevronUp } from "lucide-react"

interface ExperienceItem {
  position: string
  company: string
  duration: string
  responsibilities: string[]
}

export default function Experience({ data }: { data?: ExperienceItem[] }) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index)
  }

  const experienceData = Object.values(data || {});

  return (
    <section
      id="experience"
      className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold mb-12 sm:mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        >
          Professional Experience
        </motion.h2>

        <div className="relative max-w-4xl mx-auto">
          {/* Timeline */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-purple-400 to-pink-400 rounded-full hidden sm:block"></div>

          {experienceData.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`mb-12 flex flex-col sm:flex-row ${
                index % 2 === 0 ? "sm:justify-start" : "sm:justify-end"
              } items-center sm:items-stretch`}
            >
              <Card className="w-full sm:w-[calc(50%-20px)] bg-gray-800/70 border-gray-700 backdrop-blur-md hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-lg hover:shadow-blue-500/20">
                <CardContent className="p-6">
                  <motion.div
                    className="flex items-center mb-4 cursor-pointer"
                    onClick={() => toggleExpand(index)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                      <Briefcase className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-lg sm:text-xl font-semibold text-white">{item.position}</h3>
                      <p className="text-purple-300">{item.company}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-300 transition-colors">
                      {expandedIndex === index ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </Button>
                  </motion.div>
                  <p className="text-blue-300 mb-4 text-sm sm:text-base">{item.duration}</p>
                  <AnimatePresence>
                    {expandedIndex === index && (
                      <motion.ul
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="list-disc list-inside space-y-2 overflow-hidden"
                      >
                        {item.responsibilities.map((responsibility, idx) => (
                          <motion.li
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: idx * 0.1 }}
                            className="text-gray-300 hover:text-white transition-colors text-sm sm:text-base"
                          >
                            {responsibility}
                          </motion.li>
                        ))}
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
