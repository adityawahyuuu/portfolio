'use client';

import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../lib/firebase";
import Home from "@/components/Home";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Starting Firebase connection...");

    const dataRef = ref(database, "/");
    onValue(dataRef, (snapshot) => {
      const fetchedData = snapshot.val();
      setData(fetchedData);
      setLoading(false);
    }, (error) => {
      console.error("Firebase error:", error);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header with consistent AdminPanel styling */}
      <Header />
      
      {/* Main content with AdminPanel-style layout */}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Home Section - AdminPanel Card Style */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Home data={data ? data.home : data} />
        </div>
        
        {/* Projects Section - AdminPanel Card Style */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Projects data={data ? data.project : data} />
        </div>
        
        {/* Experience Section - AdminPanel Card Style */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Experience data={data ? data.experience : data} />
        </div>
        
        {/* Contact Section - AdminPanel Card Style */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Contact data={data ? data.contact : data} />
        </div>
      </div>
      
      {/* Footer with AdminPanel styling */}
      <div className="bg-gray-800/50 backdrop-blur-xl border-t border-gray-700">
        <Footer />
      </div>
    </div>
  )
}