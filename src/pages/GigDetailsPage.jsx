import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { auth } from "../lib/firebase";
import {
  addDoc,
  collection,
  serverTimestamp,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import toast from "react-hot-toast";

export default function GigDetailsPage() {
  const user = auth.currentUser;
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gigRef = doc(db, "gigs", id);
        const gigSnap = await getDoc(gigRef);

        if (gigSnap.exists()) {
          setGig(gigSnap.data());
        } else {
          setGig(null);
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [id]);

  const handleApply = async () => {
    if (!user) return toast.error("Please log in to apply.");

    const applicationsRef = collection(db, "applications");

    // Prevent duplicate applications
    const q = query(
      applicationsRef,
      where("gigId", "==", id),
      where("applicantId", "==", user.uid)
    );
    const querySnapshot = await getDocs(q);

    try {
      await addDoc(applicationsRef, {
        gigId: id,
        applicantId: user.uid,
        applicantName: user.displayName || "Anonymous",
        message: "I'd like to work on this gig!",
        timestamp: serverTimestamp(),
      });
     toast.success("Application submitted!");
    } catch (err) {
      console.error("Apply failed:", err);
       toast.error("Something went wrong.");
    }
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!gig) return <p className="p-10 text-center">Gig not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-10">
      <h1 className="text-3xl font-bold text-green-700 mb-4">{gig.title}</h1>
      <p className="text-gray-800 text-lg mb-4">{gig.description}</p>

      <div className="text-sm text-gray-600 mb-2">
        <strong>Budget:</strong> ${gig.budget}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Deadline:</strong> {gig.deadline}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <strong>Status:</strong> {gig.status || "Open"}
      </div>
      {user && (
        <button
          onClick={handleApply}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded cursor-pointer"
        >
          Apply to This Gig
        </button>
      )}
    </div>
  );
}
