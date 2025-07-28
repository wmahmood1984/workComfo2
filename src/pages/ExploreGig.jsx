// src/pages/ExploreGigsPage.jsx
import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import Card from "../components/Card";

export default function ExploreGig() {
  const [gigs, setGigs] = useState([]);

  useEffect(() => {
    const fetchGigs = async () => {
      const snapshot = await getDocs(collection(db, "gigs"));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setGigs(data);
    };
    fetchGigs();
  }, []);

  return (
 <div className="min-h-screen bg-gray-100 px-[50px] py-10">
  <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
    Explore Gigs
  </h1>

  <div className="grid justify-center gap-[20px]"
       style={{
         gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))"
       }}
  >
    {gigs.map((gig) => (
      <Card key={gig.id} gig={gig} />
    ))}
  </div>
</div>

  );
}
