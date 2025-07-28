import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import Carousel from "../components/Carousel";
import AnimatedSection from "../components/AnimatedSection";
import Footer from "../components/Footer";
import heroImage from "/assets/hero-image.png";

export default function Home() {
  const [allGigs, setAllGigs] = useState([]);
  const [shuffledGigs, setShuffledGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      const snapshot = await getDocs(collection(db, "gigs"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      const shuffled = data.sort(() => 0.5 - Math.random());
      setAllGigs(data);
      setShuffledGigs(shuffled.slice(0, 20));
    };
    fetchGigs();
  }, []);

  return (
    <main className="flex flex-col">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 gap-10 bg-gradient-to-r from-white to-gray-50">
        <div className="w-full md:w-1/2 bg-white  animate-fade-in">
          <h1 className="text-green-600 text-4xl font-extrabold mb-4">
            Decentralized Freelance Platform
          </h1>
          <p className="text-lg text-gray-700 mb-6">
            Hire professionals and get paid — all without middlemen. Built on blockchain. Fast, secure, and global.
          </p>
          <div className="space-x-4">
            <a
              href="/post"
              className="bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700"
            >
              Post a Job
            </a>
            <a
              href="/explore"
              className="bg-white text-green-600 border border-green-600 px-6 py-3 rounded-lg hover:bg-green-50"
            >
              Browse Gigs
            </a>
          </div>
        </div>

        <div className="w-full md:w-1/2 animate-slide-in">
          <img src={heroImage} alt="Hero" className="rounded-lg shadow-xl w-full h-auto" />
        </div>
      </section>

      {/* All Gigs */}
    <AnimatedSection animation="slideUp" duration={1.2}>
        <section className="px-10 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">All Gigs</h2>
          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {shuffledGigs.map((gig) => (
              <Card key={gig.id} gig={gig} />
            ))}
          </div>
        </section>
      </AnimatedSection>

      {/* You May Like - Carousel */}
   <AnimatedSection animation="slideRight" duration={1.5}>
        <section className="px-10 py-12 bg-gray-50">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">You May Like</h2>
          <Carousel items={shuffledGigs.slice(0, 12)} />
        </section>
      </AnimatedSection>

      {/* Most Favourite - Card Flip Section */}
     <AnimatedSection animation="zoomIn" duration={1.3}>
        <section className="px-10 py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Most Favourite</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {shuffledGigs.slice(0, 8).map((gig, idx) => (
              //<div
             //   key={gig.id}
             //   className="relative w-full h-60 animate-pulse hover:scale-105 transition-transform duration-300"
             // >
                <Card gig={gig} />
            //  </div>
            ))}
          </div>
        </section>
      </AnimatedSection>

      
    </main>
  );
}
