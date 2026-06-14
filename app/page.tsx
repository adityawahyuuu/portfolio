'use client';

import { useState, useEffect } from "react";
import { onValue, ref } from "firebase/database";
import { database } from "../lib/firebase";
import Home from "@/components/Home";
import Header from "@/components/Header";
import Loading from "@/components/Loading";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Page() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const dataRef = ref(database, "/");
    onValue(dataRef, (snapshot) => {
      setData(snapshot.val());
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
      <Header />

      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 space-y-0">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Home data={data ? data.home : data} contact={data ? data.contact : null} />
        </div>

        <div className="py-2" />

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Projects data={data ? data.project : data} />
        </div>

        <div className="py-2" />

        <div className="bg-gray-800/50 border border-gray-700 rounded-lg backdrop-blur-xl">
          <Contact data={data ? data.contact : data} />
        </div>
      </div>

      <div className="bg-gray-800/50 backdrop-blur-xl border-t border-gray-700 mt-8">
        <Footer />
      </div>
    </div>
  )
}
