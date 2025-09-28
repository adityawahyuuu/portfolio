'use client'

import { motion } from "framer-motion";
import { ContactData, FormData } from "@/types/contact";
import { useState } from 'react';
import { Github, Linkedin, Twitter, Mail, Phone, Loader2, CheckCircle, Paperclip, X } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
      
      const oversizedFiles = newFiles.filter(file => file.size > 5 * 1024 * 1024);
      if (oversizedFiles.length > 0) {
        toast({
          title: "File Too Large",
          description: "Each file must be less than 5MB",
          variant: "destructive",
        });
        return;
      }
      
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

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const sendEmailWithAPI = async (formData: ExtendedFormData) => {
    try {
      const attachments = [];
      
      if (formData.attachments && formData.attachments.length > 0) {
        for (const file of formData.attachments) {
          const base64Content = await fileToBase64(file);
          attachments.push({
            filename: file.name,
            content: base64Content.split(',')[1],
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
          attachments: attachments,
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
      <section id="contact" className="p-6">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-white flex items-center">
            <div className="p-2 rounded-lg mr-3 bg-pink-500">
              <Mail className="w-5 h-5" />
            </div>
            Get in Touch
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-gray-300 text-center mb-8">
            Let's connect and bring your ideas to life!
          </p>

          <Card className="bg-gray-700/50 border-gray-600">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                      Name *
                    </label>
                    <Input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="Your Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                      Email *
                    </label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                      placeholder="your.email@example.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="bg-gray-600 border-gray-500 text-white placeholder-gray-400 focus:border-pink-500 focus:ring-pink-500"
                    placeholder="Your message here..."
                  />
                </div>

                <div>
                  <label htmlFor="attachments" className="block text-sm font-medium text-gray-200 mb-2">
                    Attachments (optional)
                  </label>
                  <div className="space-y-4">
                    <div className="flex items-center justify-center w-full">
                      <label 
                        htmlFor="attachments" 
                        className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-600/50 hover:bg-gray-600/70 transition-all duration-300"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Paperclip className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-300">
                            <span className="font-semibold">Click to upload</span> or drag and drop
                          </p>
                          <p className="text-xs text-gray-400">
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

                    {formData.attachments && formData.attachments.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-300 font-medium">Selected files:</p>
                        {formData.attachments.map((file, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center justify-between p-3 bg-gray-600/50 rounded-lg border border-gray-500/30"
                          >
                            <div className="flex items-center space-x-3">
                              <Paperclip className="w-4 h-4 text-gray-400" />
                              <div>
                                <p className="text-sm text-white font-medium">{file.name}</p>
                                <p className="text-xs text-gray-400">{formatFileSize(file.size)}</p>
                              </div>
                            </div>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeFile(index)}
                              className="text-gray-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600 transition-all duration-300"
                >
                  <span className="flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin mr-2 w-4 h-4" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="mr-2 w-4 h-4" />
                        Send Message
                        {formData.attachments && formData.attachments.length > 0 && (
                          <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded-full">
                            +{formData.attachments.length}
                          </span>
                        )}
                      </>
                    )}
                  </span>
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <Card className="bg-gray-700/50 border-gray-600 hover:border-pink-500/50 transition-colors">
              <CardContent className="p-4 text-center">
                <Mail className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm">Email</p>
                <a 
                  href="mailto:pradhanaaditya30@gmail.com" 
                  className="text-white hover:text-pink-300 transition-colors text-sm"
                >
                  pradhanaaditya30@gmail.com
                </a>
              </CardContent>
            </Card>

            <Card className="bg-gray-700/50 border-gray-600 hover:border-pink-500/50 transition-colors">
              <CardContent className="p-4 text-center">
                <Phone className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                <p className="text-gray-300 text-sm">Phone</p>
                <a 
                  href="tel:+6281315227951" 
                  className="text-white hover:text-pink-300 transition-colors text-sm"
                >
                  +62 81315227951
                </a>
              </CardContent>
            </Card>
          </div>

          {/* Social Links */}
          {data?.socialLinks && data.socialLinks.length > 0 && (
            <div className="flex justify-center space-x-4 mt-6">
              {data.socialLinks.map((link, index) => {
                const Icon = socialIcons[link.icon] || (() => null);
                return (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-3 bg-gray-700/50 border border-gray-600 hover:border-pink-500/50 rounded-full text-gray-400 hover:text-pink-300 transition-all duration-300"
                  >
                    <Icon className="w-6 h-6" />
                    <span className="sr-only">{link.name}</span>
                  </motion.a>
                );
              })}
            </div>
          )}
        </CardContent>
      </section>

      <Dialog open={showThankYou} onOpenChange={setShowThankYou}>
        <DialogContent className="bg-gray-800 border-gray-600">
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
            <DialogDescription className="text-center text-gray-300">
              I have received your message{formData.attachments?.length ? ' with attachments' : ''} and will get back to you as soon as possible. Have a great day!
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center mt-4">
            <Button
              onClick={() => setShowThankYou(false)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}