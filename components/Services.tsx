"use client"

import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Code, Layout, Database, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Service {
  title: string
  icon: string
  description: string
}

const iconMap = {
  code: Code,
  layout: Layout,
  database: Database,
}

export default function Services({ data }: { data?: Service[] }) {
  // Fallback data when Firebase data is not available
  const defaultServices: Service[] = [
    {
      title: "Web Development",
      description: "Creating modern, responsive websites and web applications using cutting-edge technologies.",
      icon: "code",
    },
    {
      title: "UI/UX Design",
      description: "Designing beautiful and intuitive user interfaces that provide exceptional user experiences.",
      icon: "layout",
    },
    {
      title: "Database Solutions",
      description: "Building robust and scalable database architectures for your applications.",
      icon: "database",
    },
  ]

  // Use provided data or fallback to default services
  const services = data && Array.isArray(data) ? data : defaultServices

  return (
    <section
      id="services"
      className="py-24 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 backdrop-blur-sm"></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-7xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            Our Services
          </h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Empowering your digital journey with cutting-edge solutions tailored to your needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon as keyof typeof iconMap] || Code
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full bg-gray-800/70 border-gray-700 backdrop-blur-md hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-blue-500/30 group">
                  <CardContent className="p-8 flex flex-col items-center text-center">
                    <motion.div
                      className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Icon className="text-5xl text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-300 group-hover:text-white transition-colors mb-6">{service.description}</p>
                    <Button
                      variant="outline"
                      className="mt-auto group relative overflow-hidden border-2 border-purple-500 text-purple-500 hover:text-white font-semibold py-2 px-6 rounded-lg transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-500 hover:via-pink-500 hover:to-red-500 shadow-md hover:shadow-lg bg-transparent"
                    >
                      <span className="relative z-10">Learn More</span>
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-20 text-center"
        >
          <Button
            size="lg"
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold py-3 px-8 rounded-full transition-all duration-300 transform hover:scale-105"
          >
            Explore All Services
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
