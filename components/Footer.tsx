"use client"

import { FaLinkedinIn, FaGithub, FaEnvelope } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function Footer() {
    return (
        <motion.footer 
            className="p-6 border-t border-gray-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <motion.div 
                        className="text-center md:text-left"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h2 className="text-xl font-bold text-white">Aditya Wahyu Pradhana</h2>
                        <p className="text-sm text-gray-400">Software Developer</p>
                    </motion.div>
                    
                    <motion.div 
                        className="flex space-x-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        {[
                            { 
                                icon: FaLinkedinIn, 
                                href: "https://www.linkedin.com/in/aditya-wahyu-pradhana-51a6b3282/", 
                                color: "hover:text-blue-400",
                                label: "LinkedIn"
                            },
                            { 
                                icon: FaGithub, 
                                href: "https://github.com/adityawahyuuu", 
                                color: "hover:text-gray-300",
                                label: "GitHub"
                            },
                            { 
                                icon: FaEnvelope, 
                                href: "mailto:pradhanaaditya30@gmail.com", 
                                color: "hover:text-pink-400",
                                label: "Email"
                            },
                        ].map((item, index) => (
                            <motion.a 
                                key={index}
                                href={item.href} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className={`p-2 bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded-full text-gray-400 ${item.color} transition-all duration-300`}
                                whileHover={{ scale: 1.1, y: -2 }}
                                whileTap={{ scale: 0.95 }}
                                title={item.label}
                            >
                                <item.icon size={18} />
                            </motion.a>
                        ))}
                    </motion.div>
                </div>
                
                <motion.div 
                    className="border-t border-gray-700 mt-6 pt-4 text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                >
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Aditya Wahyu Pradhana. All Rights Reserved.
                    </p>
                </motion.div>
            </div>
        </motion.footer>
    )
}