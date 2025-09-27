'use client'

import { useState, useEffect } from 'react'
import { database } from '../lib/firebase'
import { ref, set, get } from 'firebase/database'
import { Trash2, Plus, ArrowLeft, LogOut, Home, FolderOpen, Briefcase } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from "@/hooks/use-toast"

interface FormData {
  home: {
    fullText: string;
    subtitle: string;
    image: string;
    description1: string;
    description2: string;
    skills: Array<{ text: string; color: string }>;
  };
  project: Array<{
    name: string;
    path: string;
    image: string;
    description: string;
  }>;
  experience: Array<{
    position: string;
    company: string;
    duration: string;
    responsibilities: string[];
  }>;
}

interface AdminPanelProps {
  data: FormData;
  onLogout: () => void;
}

const defaultData: FormData = {
  home: { 
    fullText: '', 
    subtitle: '', 
    image: '', 
    description1: '', 
    description2: '', 
    skills: []
  },
  project: [],
  experience: []
};

const sectionConfig = {
  home: { icon: Home, label: 'Home Section', color: 'bg-blue-500' },
  project: { icon: FolderOpen, label: 'Projects', color: 'bg-green-500' },
  experience: { icon: Briefcase, label: 'Experience', color: 'bg-purple-500' },
};

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const [activeSection, setActiveSection] = useState<string>('home')
  const [formData, setFormData] = useState<FormData>(defaultData);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const snapshot = await get(ref(database, '/'));
        if (snapshot.exists()) {
          setFormData(snapshot.val());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, section: keyof FormData, index: number | null = null) => {
    const { name, value } = e.target
    setFormData(prev => {
      if (index !== null && Array.isArray(prev[section])) {
        const sectionArray = [...prev[section]];
        sectionArray[index] = { ...sectionArray[index], [name]: value };
        return { ...prev, [section]: sectionArray };
      } else if (typeof prev[section] === 'object' && prev[section] !== null) {
        return { 
          ...prev, 
          [section]: { 
            ...prev[section], 
            [name]: value 
          } 
        };
      }
      return prev;
    });
  }

  const handleArrayChange = (section: keyof FormData, index: number, key: string, value: string | string[]) => {
    setFormData(prev => {
      if (Array.isArray(prev[section])) {
        const sectionArray = [...prev[section]];
        sectionArray[index] = { ...sectionArray[index], [key]: value };
        return { ...prev, [section]: sectionArray };
      }
      return prev;
    });
  }
  
  const handleAddItem = (section: keyof FormData) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let newItem: any;
    switch (section) {
      case 'project':
        newItem = { name: '', path: '', image: '', description: '' };
        break;
      case 'experience':
        newItem = { position: '', company: '', duration: '', responsibilities: [''] };
        break;
      default:
        return;
    }
    
    setFormData(prev => {
      let currentSection = prev[section];
      let sectionArray: any[] = [];
      
      // Convert object to array if needed (Firebase sometimes returns objects)
      if (currentSection && !Array.isArray(currentSection) && typeof currentSection === 'object') {
        sectionArray = Object.values(currentSection);
      } else if (Array.isArray(currentSection)) {
        sectionArray = currentSection;
      }
      
      return {
        ...prev,
        [section]: [...sectionArray, newItem]
      };
    });
  }

  const handleDeleteItem = (section: keyof FormData, index: number) => {
    setFormData(prev => {
      // Pastikan section adalah array sebelum melakukan operasi array
      if (Array.isArray(prev[section])) {
        return {
          ...prev,
          [section]: prev[section].filter((_: any, i: number) => i !== index)
        };
      } else if (prev[section] && typeof prev[section] === 'object') {
        // Jika section adalah object (dari Firebase), convert ke array dulu
        const sectionArray = Object.values(prev[section] as object);
        return {
          ...prev,
          [section]: sectionArray.filter((_: any, i: number) => i !== index)
        };
      }
      // Jika section tidak ada atau kosong, return state yang sama
      return prev;
    });
  }

  const handleAddResponsibility = (index: number) => {
    setFormData(prev => {
      let experienceData = prev.experience;
      let experienceArray: any[] = [];
      
      // Convert object to array if needed (Firebase sometimes returns objects)
      if (experienceData && !Array.isArray(experienceData) && typeof experienceData === 'object') {
        experienceArray = Object.values(experienceData);
      } else if (Array.isArray(experienceData)) {
        experienceArray = experienceData;
      }
      
      // Create a copy of the array
      const updatedExperience = [...experienceArray];
      
      if (updatedExperience[index]) {
        const currentResponsibilities = updatedExperience[index].responsibilities || [];
        const responsibilitiesArray = Array.isArray(currentResponsibilities) ? currentResponsibilities : [];
        
        updatedExperience[index] = {
          ...updatedExperience[index],
          responsibilities: [...responsibilitiesArray, '']
        };
      }
      return { ...prev, experience: updatedExperience };
    });
  }

  const handleDeleteResponsibility = (expIndex: number, respIndex: number) => {
    setFormData(prev => {
      let experienceData = prev.experience;
      let experienceArray: any[] = [];
      
      // Convert object to array if needed (Firebase sometimes returns objects)
      if (experienceData && !Array.isArray(experienceData) && typeof experienceData === 'object') {
        experienceArray = Object.values(experienceData);
      } else if (Array.isArray(experienceData)) {
        experienceArray = experienceData;
      }
      
      // Create a copy of the array
      const updatedExperience = [...experienceArray];
      
      if (updatedExperience[expIndex]) {
        const currentResponsibilities = updatedExperience[expIndex].responsibilities || [];
        const responsibilitiesArray = Array.isArray(currentResponsibilities) ? currentResponsibilities : [];
        
        updatedExperience[expIndex] = {
          ...updatedExperience[expIndex],
          responsibilities: responsibilitiesArray.filter((_, i) => i !== respIndex)
        };
      }
      return { ...prev, experience: updatedExperience };
    });
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true);
    
    try {
      // Simpan data ke Firebase
      await set(ref(database, '/'), formData)
      
      // Show success toast
      toast({
        title: "Success!",
        description: `${sectionConfig[activeSection as keyof typeof sectionConfig]?.label} data has been saved successfully.`,
        variant: "default",
      })
      
      console.log('Data saved successfully to Firebase')
      
    } catch (error) {
      console.error('Error updating data:', error)
      
      // Show error toast
      toast({
        title: "Save Failed",
        description: "Could not save your changes. Please check your connection and try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false);
    }
  }

  const renderForm = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    const commonInputClasses = "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500";

    switch (activeSection) {
      case 'home':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="fullText"
                value={formData.home?.fullText || ''}
                onChange={(e) => handleChange(e, 'home')}
                placeholder="Full Text (for typing animation)"
                className={commonInputClasses}
              />
              <Input
                name="subtitle"
                value={formData.home?.subtitle || ''}
                onChange={(e) => handleChange(e, 'home')}
                placeholder="Subtitle"
                className={commonInputClasses}
              />
            </div>
            <Input
              name="image"
              value={formData.home?.image || ''}
              onChange={(e) => handleChange(e, 'home')}
              placeholder="Image URL"
              className={commonInputClasses}
            />
            <div className="space-y-4">
              <Textarea
                name="description1"
                value={formData.home?.description1 || ''}
                onChange={(e) => handleChange(e, 'home')}
                placeholder="First paragraph of description"
                rows={3}
                className={commonInputClasses}
              />
              <Textarea
                name="description2"
                value={formData.home?.description2 || ''}
                onChange={(e) => handleChange(e, 'home')}
                placeholder="Second paragraph of description"
                rows={3}
                className={commonInputClasses}
              />
            </div>
            
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-white">Skills</h4>
              {(formData.home?.skills || []).map((skill: {text: string, color: string}, index: number) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-700 rounded-lg">
                  <Input
                    value={skill.text || ''}
                    onChange={(e) => handleArrayChange('home', index, 'text', e.target.value)}
                    placeholder={`Skill ${index + 1} text`}
                    className={commonInputClasses}
                  />
                  <Input
                    value={skill.color || ''}
                    onChange={(e) => handleArrayChange('home', index, 'color', e.target.value)}
                    placeholder={`Skill ${index + 1} color`}
                    className={commonInputClasses}
                  />
                </div>
              ))}
            </div>
            
            <Button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        )
      case 'project':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {(() => {
                let projectData = formData.project || [];
                
                // Convert object to array if Firebase returns object format
                if (!Array.isArray(projectData) && typeof projectData === 'object') {
                  projectData = Object.values(projectData);
                }
                
                // Ensure it's an array
                if (!Array.isArray(projectData)) {
                  projectData = [];
                }
                
                return projectData.map((project: {name: string, path: string, image: string, description: string}, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 p-6 border border-gray-600 rounded-lg relative bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white">Project {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem('project', index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={project.name || ''}
                        onChange={(e) => handleArrayChange('project', index, 'name', e.target.value)}
                        placeholder="Project name"
                        className={commonInputClasses}
                      />
                      <Input
                        value={project.path || ''}
                        onChange={(e) => handleArrayChange('project', index, 'path', e.target.value)}
                        placeholder="Project URL"
                        className={commonInputClasses}
                      />
                    </div>
                    
                    <Input
                      value={project.image || ''}
                      onChange={(e) => handleArrayChange('project', index, 'image', e.target.value)}
                      placeholder="Project image URL"
                      className={commonInputClasses}
                    />
                    
                    <Textarea
                      value={project.description || ''}
                      onChange={(e) => handleArrayChange('project', index, 'description', e.target.value)}
                      placeholder="Project description"
                      rows={3}
                      className={commonInputClasses}
                    />
                  </motion.div>
                ));
              })()}
            </AnimatePresence>
            
            <Button 
              type="button" 
              onClick={() => handleAddItem('project')} 
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Project
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        )
      case 'experience':
        return (
          <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresence>
              {(() => {
                let experienceData = formData.experience || [];
                
                // Convert object to array if Firebase returns object format
                if (!Array.isArray(experienceData) && typeof experienceData === 'object') {
                  experienceData = Object.values(experienceData);
                }
                
                // Ensure it's an array
                if (!Array.isArray(experienceData)) {
                  experienceData = [];
                }
                
                return experienceData.map((exp: {position: string, company: string, duration: string, responsibilities: string[]}, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-4 p-6 border border-gray-600 rounded-lg relative bg-gray-700"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-semibold text-white">Experience {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteItem('experience', index)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        value={exp.position || ''}
                        onChange={(e) => handleArrayChange('experience', index, 'position', e.target.value)}
                        placeholder="Position"
                        className={commonInputClasses}
                      />
                      <Input
                        value={exp.company || ''}
                        onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                        placeholder="Company"
                        className={commonInputClasses}
                      />
                    </div>
                    
                    <Input
                      value={exp.duration || ''}
                      onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                      placeholder="Duration"
                      className={commonInputClasses}
                    />
                    
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h5 className="text-md font-medium text-white">Responsibilities</h5>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleAddResponsibility(index)}
                          className="border-gray-600 text-white hover:bg-gray-600"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Responsibility
                        </Button>
                      </div>
                      
                      {(() => {
                        let responsibilities = exp.responsibilities || [];
                        
                        // Ensure responsibilities is always an array
                        if (!Array.isArray(responsibilities)) {
                          responsibilities = [];
                        }
                        
                        return responsibilities.map((resp: string, respIndex: number) => (
                          <div key={respIndex} className="flex items-center space-x-2">
                            <Input
                              value={resp || ''}
                              onChange={(e) => {
                                const newResponsibilities = [...responsibilities];
                                newResponsibilities[respIndex] = e.target.value;
                                handleArrayChange('experience', index, 'responsibilities', newResponsibilities);
                              }}
                              placeholder={`Responsibility ${respIndex + 1}`}
                              className={`${commonInputClasses} flex-1`}
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeleteResponsibility(index, respIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ));
                      })()}
                    </div>
                  </motion.div>
                ));
              })()}
            </AnimatePresence>
            
            <Button 
              type="button" 
              onClick={() => handleAddItem('experience')} 
              variant="outline"
              className="w-full border-gray-600 text-white hover:bg-gray-700"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Experience
            </Button>
            
            <Button 
              type="submit" 
              disabled={isSaving}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-white/70 hover:text-white transition-colors group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </Link>
            
            <Link href="/" className="text-2xl font-bold">
              <motion.span
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
              >
                Portfolio
              </motion.span>
            </Link>
          </div>
          
          <Button 
            onClick={onLogout} 
            variant="outline"
            className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <Card className="bg-gray-800/50 border-gray-700 sticky top-6">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-white flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3 animate-pulse"></div>
                  Admin Panel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <nav className="space-y-2">
                  {Object.entries(sectionConfig).map(([section, config]) => {
                    const IconComponent = config.icon;
                    return (
                      <motion.div
                        key={section}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={activeSection === section ? "secondary" : "ghost"}
                          className={`w-full justify-start text-left p-4 h-auto ${
                            activeSection === section 
                              ? 'bg-blue-600 text-white hover:bg-blue-700' 
                              : 'text-gray-300 hover:text-white hover:bg-gray-700'
                          }`}
                          onClick={() => setActiveSection(section)}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`p-2 rounded-lg ${activeSection === section ? 'bg-blue-500' : 'bg-gray-600'}`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-medium">{config.label}</div>
                              <div className="text-xs opacity-70 capitalize">{section}</div>
                            </div>
                          </div>
                        </Button>
                      </motion.div>
                    );
                  })}
                </nav>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-white flex items-center">
                  {(() => {
                    const config = sectionConfig[activeSection as keyof typeof sectionConfig];
                    const IconComponent = config?.icon;
                    return (
                      <>
                        {IconComponent && (
                          <div className={`p-2 rounded-lg mr-3 ${config.color}`}>
                            <IconComponent className="w-5 h-5" />
                          </div>
                        )}
                        Editing: {config?.label || activeSection}
                      </>
                    );
                  })()}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {renderForm()}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}