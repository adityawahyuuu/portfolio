"use client"

import { FaLinkedinIn, FaGithub } from 'react-icons/fa';

export default function Footer() {
    return (
        <footer className="p-6 border-t border-gray-700 animate-in fade-in duration-500">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="text-center md:text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <h2 className="text-xl font-bold text-white">Aditya Wahyu Pradhana</h2>
                        <p className="text-sm text-gray-400">Software Developer</p>
                    </div>

                    <div className="flex space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: '150ms' }}>
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
                        ].map((item, index) => (
                            <a
                                key={index}
                                href={item.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`p-2 bg-gray-700/50 border border-gray-600 hover:border-gray-500 rounded-full text-gray-400 ${item.color} hover:scale-110 hover:-translate-y-0.5 active:scale-95 transition-all duration-200`}
                                title={item.label}
                            >
                                <item.icon size={18} />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-6 pt-4 text-center animate-in fade-in duration-500" style={{ animationDelay: '300ms' }}>
                    <p className="text-xs text-gray-400">
                        © {new Date().getFullYear()} Aditya Wahyu Pradhana. All Rights Reserved.
                    </p>
                </div>
            </div>
        </footer>
    )
}
