import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase"; // adjust this path to your config
import toast from 'react-hot-toast';

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CompleteProfileForm = ({  }) => {
  const location = useLocation()
  const navigate = useNavigate()
  const {userid,email} = location.state || {}
  const [formData, setFormData] = useState({
    userid,
    email,
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    gender: '',
    profilePicture: null,
    level:"newbie"
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const userId = formData.userid || localStorage.getItem("userUid");

    if (!userId) {
      alert("User ID not found.");
      return;
    }

    let imageUrl = "";
    if (formData.profilePicture) {
      const imageData = new FormData();
      imageData.append("file", formData.profilePicture);
      imageData.append("upload_preset", uploadPreset);

      ;

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: imageData
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || "Upload failed");

      imageUrl = data.secure_url;
    }

    // Prepare Firestore data
    const { profilePicture, ...userData } = formData;
    userData.profilePictureUrl = imageUrl;
    userData.isProfileComplete = true;

    const userRef = doc(db, "users", userId);
    await setDoc(userRef, userData, { merge: true });

    toast.success("Profile updated successfully!");
    navigate(`/dashboard/${userId}`)

  } catch (error) {
    console.error("Error saving profile:", error);
    toast.error("There was an error updating your profile.");
  }
};



 return (
    <div className="max-w-4xl mx-auto mt-10 p-10 bg-white shadow-xl rounded-lg border border-gray-200">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-700">Complete Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-6 text-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={formData.firstName}
            onChange={handleChange}
            className="p-4 border rounded w-full"
            required
          />
          <input
            type="text"
            name="middleName"
            placeholder="Middle Name"
            value={formData.middleName}
            onChange={handleChange}
            className="p-4 border rounded w-full"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={formData.lastName}
            onChange={handleChange}
            className="p-4 border rounded w-full"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="p-4 border rounded w-full"
            required
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            className="p-4 border rounded w-full"
            required
          />
        </div>

        <input
          type="text"
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="p-4 border rounded w-full"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            className="p-4 border rounded w-full"
            required
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={formData.country}
            onChange={handleChange}
            className="p-4 border rounded w-full"
            required
          />
        </div>

        <div className="flex flex-col gap-3 mt-6">
          <label className="font-medium text-gray-700">Gender:</label>
          <div className="flex gap-8 text-lg">
            {["Male", "Female", "Other"].map((g) => (
              <label key={g} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="gender"
                  value={g}
                  checked={formData.gender === g}
                  onChange={handleChange}
                  required
                />
                {g}
              </label>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-gray-700 font-medium mb-2">Upload Profile Picture</label>
          <input
            type="file"
            name="profilePicture"
            accept="image/*"
            onChange={handleChange}
            className="p-2 border w-full rounded"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-10 bg-blue-600 text-white py-4 rounded text-xl font-semibold hover:bg-blue-700 transition"
        >
          Save Profile
        </button>
      </form>
    </div>
  );
};

export default CompleteProfileForm;
