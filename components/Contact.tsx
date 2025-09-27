'use client'

import { motion } from "framer-motion";
import { ContactData, FormData } from "@/types/contact";
import { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Phone, Loader2, CheckCircle, Paperclip, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface ExtendedFormData extends FormData {
  attachments?: File[];
}

export default function Contact({ data }: { data?: ContactData }) {
  const [formData, setFormData] = useState<ExtendedFormData>({
    name: '',
    email: '',
    message: '',
    attachments: [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const { toast } = useToast();
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const socialIcons: { [key: string]: React.ComponentType<any> } = {
    github: Github,
    linkedin: Linkedin,
    twitter: Twitter,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      const currentFiles = formData.attachments || [];
      
      // Check file size (max 5MB per file)
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File Too Large",
          description: "Each file must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
      // Check total files (max 3 files)
      if (currentFiles.length + newFiles.length > 3) {
        toast({
          title: "Too Many Files",
          description: "You can only attach up to 3 files",
          variant: "destructive",
        });
        return;
      }
      
      setFormData(prev => ({ 
        ...prev, 
        attachments: [...currentFiles, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments?.filter((_, i) => i !== index) || []
    }));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Convert files to base64 for email attachment
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  // Using API Route with actual file attachments
  const sendEmailWithAPI = async (formData: ExtendedFormData) => {
    try {
      const attachments = [];
      
      // Convert files to base64 for sending
      if (formData.attachments && formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          const base64Content = await fileToBase64(file);
          attachments.push({
            filename: file.name,
            content: base64Content.split(',')[1], // Remove data:type;base64, prefix
            contentType: file.type,
            size: file.size
          });
        }
      }

      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          attachments: attachments, // Now sending actual file data
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send email');
      }

      const result = await response.json();
      return { success: true, data: result };
    } catch (error) {
      console.error('API error:', error);
      return { success: false, error };
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form data
      if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      // Check if files are still being processed
      const totalSize = (formData.attachments || []).reduce((sum, file) => sum + file.size, 0);
      if (totalSize > 25 * 1024 * 1024) { // 25MB total limit
        toast({
          title: "Attachments Too Large",
          description: "Total attachment size cannot exceed 25MB",
          variant: "destructive",
        });
        return;
      }

      const result = await sendEmailWithAPI(formData);

      if (result.success) {
        toast({
          title: "Message Sent!",
          description: `Your message${formData.attachments?.length ? ' with attachment info' : ''} has been sent successfully. I'll get back to you soon!`,
        });
        
        setShowThankYou(true);
        setFormData({ name: '', email: '', message: '', attachments: [] }); // Reset form
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      
      toast({
        title: "Failed to Send",
        description: "There was an error sending your message. Please try again or contact me directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <section id="contact" className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-black">
        <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>
        
        <div className="container relative z-10 mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Get in Touch
            </h2>
            <p className="text-indigo-200 text-xl max-w-2xl mx-auto">
              Let`s connect and bring your ideas to life!
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-0 overflow-hidden shadow-xl shadow-purple-500/20">
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-indigo-200 mb-2">
                        Name *
                      </label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full border-indigo-300 bg-white/5 text-white placeholder-indigo-300 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
                        placeholder="Your Name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-indigo-200 mb-2">
                        Email *
                      </label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full border-indigo-300 bg-white/5 text-white placeholder-indigo-300 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <label htmlFor="message" className="block text-sm font-medium text-indigo-200 mb-2">
                      Message *
                    </label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full border-indigo-300 bg-white/5 text-white placeholder-indigo-300 focus:border-pink-500 focus:ring-pink-500 transition-all duration-300"
                      placeholder="Your message here..."
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                  >
                    <label htmlFor="attachments" className="block text-sm font-medium text-indigo-200 mb-2">
                      Attachments (optional)
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-center w-full">
                        <label 
                          htmlFor="attachments" 
                          className="flex flex-col items-center justify-center w-full h-32 border-2 border-indigo-300 border-dashed rounded-lg cursor-pointer bg-white/5 hover:bg-white/10 transition-all duration-300"
                        >
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Paperclip className="w-8 h-8 mb-2 text-indigo-300" />
                            <p className="mb-2 text-sm text-indigo-200">
                              <span className="font-semibold">Click to upload</span> or drag and drop
                            </p>
                            <p className="text-xs text-indigo-300">
                              Max 3 files, 5MB each (PDF, DOC, IMG files)
                            </p>
                          </div>
                          <Input
                            id="attachments"
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.gif"
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Display selected files */}
                      {formData.attachments && formData.attachments.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm text-indigo-200 font-medium">Selected files:</p>
                          {formData.attachments.map((file, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-indigo-300/30"
                            >
                              <div className="flex items-center space-x-3">
                                <Paperclip className="w-4 h-4 text-indigo-300" />
                                <div>
                                  <p className="text-sm text-white font-medium">{file.name}</p>
                                  <p className="text-xs text-indigo-300">{formatFileSize(file.size)}</p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => removeFile(index)}
                                className="text-indigo-300 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full group relative overflow-hidden bg-gradient-to-r from-pink-500 to-indigo-500 text-white transition-all duration-300 ease-out hover:shadow-lg hover:shadow-pink-500/50"
                    >
                      <span className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out"></span>
                      <span className="relative flex items-center justify-center text-lg font-semibold py-3">
                        {isSubmitting ? (
                          <>
                            <Loader2 className="animate-spin mr-2" />
                            Sending...
                          </>
                        ) : (
                          <>
                            <Mail className="mr-2" />
                            Send Message
                            {formData.attachments && formData.attachments.length > 0 && (
                              <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                                +{formData.attachments.length} files
                              </span>
                            )}
                          </>
                        )}
                      </span>
                    </Button>
                  </motion.div>
                </form>
              </CardContent>
            </Card>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-12 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8"
          >
            <a href="mailto:pradhanaaditya30@gmail.com" className="flex items-center text-indigo-200 hover:text-pink-300 transition-colors">
              <Mail className="w-6 h-6 mr-2" />
              pradhanaaditya30@gmail.com
            </a>
            <a href="tel:+6281315227951" className="flex items-center text-indigo-200 hover:text-pink-300 transition-colors">
              <Phone className="w-6 h-6 mr-2" />
              +62 81315227951
            </a>
          </motion.div>

          {data?.socialLinks && data.socialLinks.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 flex justify-center space-x-6"
            >
              {data.socialLinks.map((link, index) => {
                const Icon = socialIcons[link.icon] || (() => null);
                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-200 hover:text-pink-300 transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-8 h-8" />
                    <span className="sr-only">{link.name}</span>
                  </motion.a>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="bg-gradient-to-br from-indigo-900/95 via-purple-900/95 to-pink-900/95 border-indigo-500/20 backdrop-blur-xl">
          <DialogHeader>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
              className="mx-auto rounded-full bg-green-500/20 p-3 mb-4"
            >
              <CheckCircle className="w-12 h-12 text-green-500" />
            </motion.div>
            <DialogTitle className="text-2xl text-center text-white mb-2">
              Thank You for Reaching Out!
            </DialogTitle>
            <DialogDescription className="text-center text-indigo-200">
              I have received your message{formData.attachments?.length ? ' with attachment info' : ''} and will get back to you as soon as possible. Have a great day!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowThankYou(false)}
              className="bg-gradient-to-r from-pink-500 to-indigo-500 text-white hover:shadow-lg hover:shadow-pink-500/50 transition-all duration-300"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}