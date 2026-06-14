"use client"

import { useState } from "react"
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
    <section id="experience" className="p-4 sm:p-6">
      <CardHeader className="px-0 sm:px-6">
        <CardTitle className="text-xl sm:text-2xl font-semibold text-white flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-purple-500">
            <Briefcase className="w-5 h-5" />
          </div>
          Professional Experience
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 px-0 sm:px-6">
        {experienceData.length > 0 ? (
          <div className="space-y-4">
            {experienceData.map((item, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Card className="bg-gray-700/50 border-gray-600 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20">
                  <CardContent className="p-4 sm:p-6">
                    <div
                      className="flex items-center justify-between cursor-pointer hover:scale-[1.01] active:scale-[0.99] transition-transform duration-200"
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="flex items-center flex-grow">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mr-3 sm:mr-4 shadow-lg flex-shrink-0">
                          <Briefcase className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h3 className="text-base sm:text-lg font-semibold text-white truncate">{item.position}</h3>
                          <p className="text-purple-300 font-medium text-sm sm:text-base truncate">{item.company}</p>
                          <p className="text-purple-300/80 text-sm">{item.duration}</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 transition-colors flex-shrink-0"
                      >
                        {expandedIndex === index ? (
                          <>
                            <ChevronUp className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline text-sm">Less</span>
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4 sm:mr-2" />
                            <span className="hidden sm:inline text-sm">More</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Expand/collapse via CSS grid trick */}
                    <div className={`grid transition-all duration-300 ${expandedIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="mt-4 pt-4 border-t border-gray-600 space-y-3">
                          <h4 className="text-sm font-semibold text-white flex items-center">
                            <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                            Key Responsibilities
                          </h4>
                          <ul className="space-y-2 ml-2 sm:ml-4">
                            {item.responsibilities.map((responsibility, idx) => (
                              <li
                                key={idx}
                                className="text-gray-300 hover:text-white transition-colors text-sm flex items-start"
                              >
                                <div className="w-1 h-1 bg-purple-400 rounded-full mr-2 mt-2 flex-shrink-0"></div>
                                <span>{responsibility}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 animate-in fade-in duration-500">
            <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-400">No experience data available yet.</p>
          </div>
        )}
      </CardContent>
    </section>
  )
}
