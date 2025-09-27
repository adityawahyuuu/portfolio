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
    return <Loading />
  }

  return (
    <div>
      <Header />
      <Home data={data ? data.home : data} />
      <Projects data={data ? data.project : data} />
      <Experience data={data ? data.experience : data} />
      <Contact data={data ? data.contact : data} />
      <Footer />
    </div>
  )
}