'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ChevronLeft, ChevronRight, Github, ExternalLink, FolderOpen } from 'lucide-react'

interface Project {
  name?: string;
  path?: string;
  images?: string[];
  description?: string;
  technologies?: { name: string; color: string }[];
  github?: string;
}

function ImageSlider({ images, projectName, tall }: { images: string[]; projectName?: string; tall?: boolean }) {
  const [idx, setIdx] = useState(0)
  const imgs = images.length ? images : ['/asset/WIP-banner.png']

  return (
    <div className={`relative w-full rounded-lg overflow-hidden bg-gray-900 flex-shrink-0 ${tall ? 'aspect-video' : 'h-48'}`}>
      <Image
        src={imgs[idx]}
        alt={`${projectName || 'Project'} image ${idx + 1}`}
        fill
        className="object-cover transition-opacity duration-300"
      />
      {imgs.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => (i - 1 + imgs.length) % imgs.length) }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setIdx(i => (i + 1) % imgs.length) }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {imgs.map((_, i) => (
              <button
                key={i}
                onClick={e => { e.stopPropagation(); setIdx(i) }}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${i === idx ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function Projects({ data }: { data?: Project[] }) {
  const [detailProject, setDetailProject] = useState<Project | null>(null)

  const projectsData = Object.values(data || {})

  return (
    <section id="projects" className="p-6 sm:p-8">
      <CardHeader className="px-0 pb-6">
        <CardTitle className="text-2xl font-semibold text-white flex items-center">
          <div className="p-2 rounded-lg mr-3 bg-green-500">
            <FolderOpen className="w-5 h-5" />
          </div>
          Selected Works
        </CardTitle>
      </CardHeader>

      <CardContent className="px-0">
        {projectsData.length > 0 ? (
          /* Horizontal scroll container */
          <div className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth
                          [scrollbar-width:thin] [scrollbar-color:theme(colors.gray.600)_transparent]
                          [-webkit-overflow-scrolling:touch]">
            {projectsData.map((project, index) => (
              <div
                key={`${project.name}-${index}`}
                className="flex-shrink-0 w-72 sm:w-80 snap-start flex flex-col gap-3
                           bg-gray-700/40 border border-gray-600 rounded-xl p-4
                           hover:border-green-500/50 hover:shadow-lg hover:shadow-green-500/10
                           transition-all duration-300 cursor-pointer
                           animate-in fade-in slide-in-from-right-4"
                style={{ animationDelay: `${index * 80}ms`, animationDuration: '500ms' }}
                onClick={() => setDetailProject(project)}
              >
                <ImageSlider images={project.images || []} projectName={project.name} />

                <div className="flex-1 flex flex-col gap-2 min-w-0">
                  <h2 className="text-sm font-bold text-white uppercase tracking-wide leading-snug line-clamp-2">
                    {project.name || 'Untitled Project'}
                  </h2>

                  {project.description && (
                    <p className="text-xs text-gray-400 leading-relaxed line-clamp-3">
                      {project.description}
                    </p>
                  )}

                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-auto pt-1">
                      {project.technologies.slice(0, 4).map((tech, i) => (
                        <Badge
                          key={i}
                          variant="outline"
                          className="text-[10px] px-1.5 py-0"
                          style={{
                            backgroundColor: `${tech.color}18`,
                            borderColor: `${tech.color}40`,
                            color: tech.color,
                          }}
                        >
                          {tech.name}
                        </Badge>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="text-[10px] text-gray-500 self-center">+{project.technologies.length - 4}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex gap-3 border-t border-gray-600/50 pt-3">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      <Github className="w-3 h-3" /> Repo
                    </a>
                  )}
                  {project.path && (
                    <a
                      href={project.path}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> Live
                    </a>
                  )}
                  <span className="text-[11px] text-gray-500 ml-auto">tap for details →</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 animate-in fade-in duration-500">
            <div className="w-14 h-14 bg-gray-700/50 rounded-full flex items-center justify-center mx-auto mb-3">
              <FolderOpen className="w-7 h-7 text-gray-400" />
            </div>
            <p className="text-gray-400 text-sm">No projects available yet.</p>
          </div>
        )}
      </CardContent>

      {/* Detail Modal */}
      <Dialog open={!!detailProject} onOpenChange={(open) => !open && setDetailProject(null)}>
        <DialogContent className="bg-gray-800 border-gray-700 text-white w-[92vw] max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-green-400 flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              {detailProject?.name || 'Project Details'}
            </DialogTitle>
          </DialogHeader>

          {detailProject && (
            <div className="space-y-4 pt-2">
              <ImageSlider images={detailProject.images || []} projectName={detailProject.name} tall />

              {detailProject.description && (
                <p className="text-gray-300 text-sm leading-relaxed">{detailProject.description}</p>
              )}

              {detailProject.path && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">URL</h4>
                  <a href={detailProject.path} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" />{detailProject.path}
                  </a>
                </div>
              )}

              {detailProject.github && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1">Repository</h4>
                  <a href={detailProject.github} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:text-purple-300 text-sm flex items-center gap-1 transition-colors">
                    <Github className="w-3.5 h-3.5" />{detailProject.github}
                  </a>
                </div>
              )}

              {detailProject.technologies && detailProject.technologies.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-2">
                    {detailProject.technologies.map((tech, i) => (
                      <Badge key={i} variant="outline" className="text-xs" style={{ backgroundColor: `${tech.color}18`, borderColor: `${tech.color}40`, color: tech.color }}>
                        {tech.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-2">
                {detailProject.github && (
                  <Button size="sm" variant="outline" className="bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/50" asChild>
                    <a href={detailProject.github} target="_blank" rel="noopener noreferrer"><Github className="w-4 h-4 mr-2" />Repository</a>
                  </Button>
                )}
                {detailProject.path && (
                  <Button size="sm" variant="outline" className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/50" asChild>
                    <a href={detailProject.path} target="_blank" rel="noopener noreferrer"><ExternalLink className="w-4 h-4 mr-2" />Live Site</a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
