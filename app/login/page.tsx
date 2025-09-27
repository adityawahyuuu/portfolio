'use client';

import { useState, useEffect } from "react";
import { onAuthStateChanged } from 'firebase/auth';
import { motion } from "framer-motion"
import Link from 'next/link'
import { auth } from "../../lib/firebase";
import Login from "@/components/Login";
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";

export default function LoginPage() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Jika sudah login, redirect ke admin panel
        router.push('/panel');
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLoginSuccess = () => {
    router.push('/panel');
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <Login onLoginSuccess={handleLoginSuccess} />
  );
}