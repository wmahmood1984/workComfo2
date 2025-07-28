// components/ContactSellerButton.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs, addDoc, Timestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";

const ContactSellerButton = ({ sellerId }) => {
  const user = useAuth();
  const navigate = useNavigate();

  const handleContact = async () => {

//    if (!user || user.uid === sellerId) return;

 
    const userPair = [user.uid, sellerId].sort();
    const threadsRef = collection(db, "threads");

    // Check if thread already exists
    const q = query(threadsRef, where("users", "==", userPair));
    const existing = await getDocs(q);

    let threadId;

    if (!existing.empty) {
      threadId = existing.docs[0].id;
    } else {
      const newThread = await addDoc(threadsRef, {
        users: userPair,
        lastMessage: "",
        lastTimestamp: Timestamp.now(),
      });
      threadId = newThread.id;
    }

    navigate(`/messages/${threadId}`);
  };

  return (
    <button
      onClick={handleContact}
      className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded"
    >
      Contact Seller
    </button>
  );
};

export default ContactSellerButton;
