import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { Link } from "react-router-dom";

const Card = ({ gig }) => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const ref = doc(db, "users", gig.userId);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setProfile(snap.data());
        } else {
          toast.error("Profile not found.");
        }
      } catch (err) {
        console.error(err);
        toast.error("Failed to load profile.");
      } finally {
      }
    };
    fetchProfile();
  }, []);

  console.log("gig", gig);

  return (
    profile && (
      <Link
        to={`/gig-details/${gig.id}`}
        className="w-full rounded-xl overflow-hidden shadow-lg bg-white border"
      >
        <div className="relative">
          <img
            src={gig.gallery.images[0]} // Replace with actual image path
            alt="ERC20 to BEP2 Migration"
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-2 right-2 bg-white rounded-full p-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-5 h-5 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0 5.25-9 13.5-9 13.5S3 13.5 3 8.25a5.25 5.25 0 0110.5 0A5.25 5.25 0 0121 8.25z"
              />
            </svg>
          </div>
        </div>
        <div className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <img
              src={gig.userImage}
              alt="Profile"
              className="rounded-full w-6 h-6"
            />
            <span className="font-semibold text-sm text-gray-800">
              {gig.userName}
            </span>
            <span className="text-sm text-gray-500">{profile.level}</span>
            <span className="text-gray-400 text-xs">◆◆</span>
          </div>
          <h3 className="text-gray-800 font-semibold mb-2 text-xl">
            {gig.title}
          </h3>
          <p>
            {gig.cryptoEnabled ? "Cypro acceptable" : "Crypto not acceptable"}
          </p>
          <div className="flex items-center text-sm text-yellow-500 mb-1">
            <span className="font-bold">★ 5.0</span>
            <span className="text-gray-500 ml-1">(11)</span>
          </div>
          <p className="text-sm text-gray-800 font-semibold">
            From <span className="text-black">$ {gig.budget}</span>
          </p>
        </div>
      </Link>
    )
  );
};

export default Card;
