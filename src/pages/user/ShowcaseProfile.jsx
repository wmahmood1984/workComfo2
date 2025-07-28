import React, { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import OrderSummaryPage from "../order/OrderSummaryPage";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const Showcaseprofile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [gigs, setGigs] = useState([]);
  const [orders, setOrders] = useState({ current: [], completed: [] });
  const [earnings, setEarnings] = useState({ total: 0, thisMonth: 0, available: 0, pending: 0, withdrawn: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
        
      try {
        // Fetch user details
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        

        // Fetch gigs for the user
        const gigsRef = collection(db, "gigs");
        const gigsQuery = query(gigsRef, where("userId", "==", userId));
        const gigsSnapshot = await getDocs(gigsQuery);
        const gigsList = gigsSnapshot.docs.map(doc => doc.data());
        setGigs(gigsList);

        // Placeholder data for orders and earnings
        setOrders({ current: [], completed: [] });
        setEarnings({ total: 0, thisMonth: 0, available: 0, pending: 0, withdrawn: 0 });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-80 bg-white border-r p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePictureUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-gray-600">Level {user.level || 1}</p>
        </div>

        <div className="mt-8 text-sm text-gray-700 space-y-2">
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Country:</strong> {user.country}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Experience:</strong> {user.experience || "N/A"}</p>
          <p><strong>Gigs Hired:</strong> {user.hiredCount || 0}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10">
        {/* Gigs Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Your Gigs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <div key={gig.id} className="bg-white p-4 rounded shadow">
                <img
                  src={gig.gallery.images[0]}
                  alt={gig.title}
                  className="w-full h-40 object-cover rounded mb-4"
                />
                <h3 className="text-lg font-semibold">{gig.title}</h3>
                <p className="text-sm text-gray-600">Category: {gig.category}</p>
                <p className="text-sm text-gray-600">Budget: ${gig.budget}</p>
              </div>
            ))}
          </div>
        </section>

   

    

        {/* Geo Map */}
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Order Geography</h2>
          <div className="bg-white p-6 rounded shadow">
            <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
              <p className="text-gray-500">[Map Placeholder]</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Showcaseprofile;