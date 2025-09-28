"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
    <section id="experience" className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-purple-500">
            <Briefcase className="w-5 h-5" />
          </div>
          Professional Experience
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {experienceData.length > 0 ? (
          <div className="space-y-4">
            {experienceData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <CardContent className="p-6">
                    <motion.div
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => toggleExpand(index)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center flex-grow">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                          <Briefcase className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-grow">
                          <h3 className="text-lg font-semibold text-white">{item.position}</h3>
                          <p className="text-purple-300 font-medium">{item.company}</p>
                          <p className="text-purple-300/80 text-sm">{item.duration}</p>
                        </div>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors"
                      >
                        {expandedIndex === index ? (
                          <>
                            <ChevronUp className="w-4 h-4 mr-2" />
                            <span className="text-sm">Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 mr-2" />
                            <span className="text-sm">More</span>
                          </>
                        )}
                      </Button>
                    </motion.div>

                    <AnimatePresence>
                      {expandedIndex === index && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-gray-600 overflow-hidden"
                        >
                          <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-white flex items-center">
                              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                              Key Responsibilities
                            </h4>
                            <ul className="space-y-2 ml-4">
                              {item.responsibilities.map((responsibility, idx) => (
                                <motion.li
                                  key={idx}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: idx * 0.1 }}
                                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-start"
                                >
                                  <div className="w-1 h-1 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                  <span>{responsibility}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No experience data available yet.</p>
          </motion.div>
        )}
      </CardContent>
    </section>
  )
}