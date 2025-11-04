"use client"

import type React from "react"

import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { Loader2, Moon, Mountain as Mountains, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import Link from 'next/link'
import { auth } from "../lib/firebase"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"

interface LoginProps {
  onLoginSuccess: () => void
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    if (!email.trim() || !password.trim()) {
      toast({
        title: "Validation Error",
        description: "Please enter both email and password",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    console.log("[v0] Attempting login with email:", email)
    console.log("[v0] Email length:", email.length)
    console.log("[v0] Password length:", password.length)
    console.log("[v0] Email trimmed:", email.trim())
    console.log("[v0] Auth object:", auth)
    console.log("[v0] Firebase app:", auth.app)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password)
      console.log("[v0] Login successful for user:", userCredential.user.email)

      toast({
        title: "Login successful",
        description: "Welcome to the admin panel!",
      })
      onLoginSuccess()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("[v0] Login error:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error message:", error.message)
      console.error("[v0] Full error object:", JSON.stringify(error, null, 2))
      console.error("[v0] Email being used:", email.trim())
      console.error("[v0] Firebase Auth instance:", auth)
      
      toast({
        title: "Login failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
      {/* Back to Home button - positioned absolutely */}
      <Link
        href="/"
        className="absolute top-8 left-8 z-10 flex items-center space-x-2 text-white/70 hover:text-white transition-all duration-300 group"
      >
        <motion.div
          whileHover={{ x: -5 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowLeft className="w-5 h-5" />
        </motion.div>
        <span className="group-hover:underline">Back to Home</span>
      </Link>

      {/* Portfolio logo - positioned absolutely */}
      <Link
        href="/"
        className="absolute top-8 right-8 z-10 text-xl font-bold transition-colors duration-300 hover:text-primary/80"
      >
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-green-500 to-white"
        >
          Portfolio
        </motion.span>
      </Link>

      {/* Animated stars background */}
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{ opacity: 0.1 + Math.random() * 0.5 }}
          animate={{
            opacity: [0.1 + Math.random() * 0.5, 0.8, 0.1 + Math.random() * 0.5],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Number.POSITIVE_INFINITY,
            delay: Math.random() * 2,
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        />
      ))}

      {/* Shooting stars */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`shooting-${i}`}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: "-100%",
            y: Math.random() * 500,
            opacity: 0,
          }}
          animate={{
            x: "200%",
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            delay: i * 4,
          }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-md p-6"
      >
        <Card className="relative overflow-hidden backdrop-blur-xl bg-gray-800/50 border-gray-700 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-b from-gray-700/10 to-gray-900/10" />

          {/* Desert illustration */}
          <div className="relative h-48 bg-gradient-to-b from-gray-700 to-gray-900 rounded-t-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Mountains className="w-24 h-24 text-gray-400/30" />
            </div>
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
              className="absolute top-8 right-8"
            >
              <Moon className="w-12 h-12 text-green-400/80" />
            </motion.div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-black/20 to-transparent" />
          </div>

          <CardContent className="relative p-6 pt-8">
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-2xl font-bold text-center mb-6 text-white"
            >
              Admin Login
            </motion.h2>

            <form onSubmit={handleLogin} className="space-y-6">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                <Input
                  placeholder="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 transition-colors"
                />
              </motion.div>

              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400 focus:border-green-500 focus:ring-green-500 transition-colors"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-2">
                  <Checkbox id="remember" className="border-gray-600 data-[state=checked]:bg-green-500" />
                  <label htmlFor="remember" className="text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <Button variant="link" className="text-sm text-green-400 hover:text-green-300">
                  Forgot password?
                </Button>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white hover:from-green-700 hover:to-blue-700 transition-all duration-300"
                >
                  {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Login"}
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
                className="text-center mt-4"
              >
                <span className="text-gray-400 text-sm">
                  Don&apos;t have an account?{" "}
                  <Button variant="link" className="text-green-400 hover:text-green-300 p-0">
                    Create Account
                  </Button>
                </span>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}