'use client';

import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { onAuthStateChanged } from 'firebase/auth';
import { auth, database } from "../../lib/firebase";
import AdminPanel from "@/components/AdminPanel";
import { useRouter } from 'next/navigation';
import Loading from "@/components/Loading";

export default function AdminDashboard() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        
        // Load data setelah authentication confirmed
        const dataRef = ref(database, "/");
        onValue(dataRef, (snapshot) => {
          const fetchedData = snapshot.val();
          setData(fetchedData);
          setLoading(false);
        }, (error) => {
          console.error("Firebase error:", error);
          setLoading(false);
        });
      } else {
        // Jika tidak login, redirect ke login page
        router.push('/admin/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = () => {
    auth.signOut().then(() => {
      router.push('/');
    });
  };

  if (loading || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen">
      <AdminPanel data={data} onLogout={handleLogout} />
    </div>
  );
}