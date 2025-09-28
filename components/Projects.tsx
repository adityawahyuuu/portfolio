'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Github, Eye, FolderOpen } from 'lucide-react'

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
    <section id="projects" className="p-6">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-white flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-green-500">
            <FolderOpen className="w-5 h-5" />
          </div>
          Featured Projects
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <AnimatePresence mode="popLayout">
          {projectsData.length > 0 ? (
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {visibleProjects.map((project, index) => (
                <motion.div
                  key={`${project.name}-${index}`}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="group bg-gray-700/50 border-gray-600 hover:border-green-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <Image
                        src={project.image || '/placeholder.svg?height=200&width=250'}
                        alt={project.name || 'Untitled Project'}
                        fill
                        className="object-cover transition-transform duration-500 transform group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-300"></div>
                    </div>

                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-green-400 transition-colors duration-300">
                          {project.name || 'Untitled Project'}
                        </h3>
                        <Badge 
                          variant="outline" 
                          className="bg-green-500/20 text-green-400 border-green-500/40"
                        >
                          Public
                        </Badge>
                      </div>

                      <p className="text-gray-400 text-center mb-4 text-sm line-clamp-3">
                        {project.description || 'No description available'}
                      </p>

                      <div className="flex justify-center gap-3">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50 hover:text-blue-300 transition-all duration-300" 
                          asChild
                        >
                          <a 
                            href={project.path || '#'} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2"
                          >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                          </a>
                        </Button>
                        
                        {project.github && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/50 hover:text-purple-300 transition-all duration-300" 
                            asChild
                          >
                            <a 
                              href={project.github} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2"
                            >
                              <Github className="h-4 w-4" />
                              <span>Code</span>
                            </a>
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FolderOpen className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No projects available yet.</p>
            </motion.div>
          )}
        </AnimatePresence>
        
        {projectsData.length > projectsPerPage && (
          <div className="flex justify-center mt-8 space-x-4">
            <Button
              variant="outline"
              size="icon"
              onClick={prevProjects}
              className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50 hover:text-blue-300"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextProjects}
              className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50 hover:text-blue-300"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </section>
  )
}