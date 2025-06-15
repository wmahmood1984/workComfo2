// src/pages/ExploreGigsPage.jsx
import { useEffect, useState } from "react";
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';


export default function ExploreGig() {

    const [gigs, setGigs] = useState([]);

     useEffect(() => {
    const fetchGigs = async () => {
      const snapshot = await getDocs(collection(db, "gigs"));
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGigs(data);
    };
    fetchGigs();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-6">Explore Gigs</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gigs.map((gig, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800">{gig.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{gig.shortDesc}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-600 font-bold">{gig.budget}</span>
              <span className={`text-sm font-medium ${gig.status === "Open" ? "text-green-500" : "text-gray-500"}`}>
                {gig.status}
              </span>
            </div>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
