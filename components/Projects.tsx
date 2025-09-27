'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {ChevronLeft, ChevronRight, Github, Eye } from 'lucide-react'

interface Project {
  name?: string;
  path?: string;
  image?: string;
  description?: string;
  technologies?: { name: string; color: string }[];
  github?: string;
}

export default function Projects({ data }: { data?: Project[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const projectsPerPage = 6

  const nextProjects = () => {
    if (!data?.length) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex + projectsPerPage) % data.length
    )
  }

  const prevProjects = () => {
    if (!data?.length) return;
    setCurrentIndex((prevIndex) => 
      (prevIndex - projectsPerPage + data.length) % data.length
    )
  }

  const projectsData = Object.values(data || {});
  const visibleProjects = projectsData.slice(currentIndex, currentIndex + projectsPerPage);

  return (
    <section id="projects" className="py-20 bg-[#0a0a0a] relative overflow-hidden">
      {/* Grid Background */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: 'linear-gradient(#1a1a1a 1px, transparent 1px), linear-gradient(to right, #1a1a1a 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl font-bold mb-16 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400"
        >
          Featured Projects
        </motion.h2>
        
        <div className="relative">
          <AnimatePresence mode="popLayout">
            {projectsData.length > 0 ? (
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {visibleProjects.map((project, index) => (
                  <motion.div
                    key={`${project.name}-${index}`}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="group relative bg-[#0c1616]/50 border-[#1a2e2e] hover:border-[#00ff9580] transition-all duration-500 backdrop-blur-sm overflow-hidden">
                      {/* Glow Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500 bg-[#00ff95] blur-xl" />
                      
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={project.image || '/placeholder.svg?height=200&width=250'}
                          alt={project.name || 'Untitled Project'}
                          fill
                          className="object-cover transition-transform duration-500 transform group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0c1616] via-[#0c1616]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                      </div>
                      <CardContent className="p-6 relative z-10">
                        <div className="text-center mb-6">
                          <h3 className="text-2xl font-semibold mb-2 text-white group-hover:text-[#00ff95] transition-colors duration-300">
                            {project.name || 'Untitled Project'}
                          </h3>
                          <Badge 
                            variant="outline" 
                            className="bg-[#00ff9520] text-[#00ff95] border-[#00ff9540]"
                          >
                            Public
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-center mb-6 line-clamp-3">
                          {project.description || 'No description available'}
                        </p>
                        <div className="flex justify-center gap-4 mb-6">
                          <Button 
                            variant="outline" 
                            size="icon"
                            className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50 hover:text-blue-300 transition-all duration-300 rounded-full" 
                            asChild
                          >
                            <a 
                              href={project.path || '#'} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              <Eye className="h-4 w-4" />
                            </a>
                          </Button>
                          {project.github && (
                            <Button 
                              variant="outline" 
                              size="icon"
                              className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/50 hover:text-purple-300 transition-all duration-300 rounded-full" 
                              asChild
                            >
                              <a 
                                href={project.github} 
                                target="_blank" 
                                rel="noopener noreferrer"
                              >
                                <Github className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                        {/* <div className="flex flex-wrap gap-2 justify-center">
                          {
                            project.technologies?.map((tech, techIndex) => (
                              <Badge 
                                key={`${tech.name}-${techIndex}`}
                                variant="outline" 
                                className={`bg-opacity-20 border-opacity-40 ${tech.color}`}
                              >
                                {tech.name}
                              </Badge>
                            )) || null
                          }
                        </div> */}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-gray-400 py-20"
              >
                No projects available yet.
              </motion.div>
            )}
          </AnimatePresence>
          
          {projectsData.length > projectsPerPage && (
            <div className="flex justify-center mt-8 space-x-4">
              <Button
                variant="outline"
                size="icon"
                onClick={prevProjects}
                className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50 hover:text-blue-300 rounded-full"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={nextProjects}
                className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50 hover:text-blue-300 rounded-full"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}



