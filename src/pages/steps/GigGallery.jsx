import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";

import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;


export default function GigGallery({ formData, setFormData, onSubmit, onBack }) {
       const user = useAuth();
       const navigate = useNavigate()
    const [images, setImages] = useState([]);
  const [video, setVideo] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      gallery: {
        images,
        video,
      },
    }));
  }, [images, video, setFormData]);



  const uploadToCloudinary = async (file, resourceType = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);

    

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    

    if (!response.ok) throw new Error("Upload failed");

    const data = await response.json();

    return data.secure_url;
  };

  const handleUploadToStorage = async () => {
  setUploading(true);
  try {
    const imageUrls = await Promise.all(
      images.map((file) => uploadToCloudinary(file, "image"))
    );

    let videoUrl = null;
    if (video) {
      videoUrl = await uploadToCloudinary(video, "video");
    }

    const fullData = {
      ...formData,
      userId: user.uid,
   //   id:uuidv4(),
      userName:user.displayName,
      userImage:user.photoURL,
      gallery: {
        images: imageUrls,
        video: videoUrl,
      },
      createdAt: new Date().toISOString(), // optional timestamp
    };

  

    // Save to Firestore (to a collection named "gigs")
    await addDoc(collection(db, "gigs"), fullData);

    toast.success("Media uploaded and data saved!");
    navigate(`/seller-dashboard/${user.uid}`)
  } catch (err) {
    console.error("Upload failed:", err);
    toast.error("Upload or Firestore save failed.");
  } finally {
    setUploading(false);
  }
};

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) =>
      ["image/jpeg", "image/png", "image/jpg"].includes(file.type)
    );

    if (images.length + validImages.length > 3) {
      alert("You can upload up to 3 images only.");
      return;
    }

    setImages((prev) => [...prev, ...validImages]);
  };

  const handleVideoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === "video/mp4") {
      setVideo(file);
    } else {
      alert("Only MP4 videos are allowed.");
    }
  };

  const removeImage = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const removeVideo = () => {
    setVideo(null);
  };

  console.log("form data",formData)

  return (
   <div className="p-6 bg-white rounded-2xl shadow-lg space-y-6">
  <h2 className="text-2xl font-bold text-green-600">Upload Gig Media</h2>

  {/* Image Upload */}
  <div>
    <label className="block font-medium text-gray-700 mb-2">
      Upload Images <span className="text-sm text-gray-500">(max 3)</span>
    </label>
    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleImageUpload}
      className="block w-full text-sm text-gray-500 
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-green-50 file:text-green-600
                 hover:file:bg-green-100"
    />

    <div className="flex flex-wrap gap-4 mt-4">
      {images.map((img, idx) => (
        <div
          key={idx}
          className="relative w-28 h-28 border rounded-lg overflow-hidden shadow-sm"
        >
          <img
            src={URL.createObjectURL(img)}
            alt={`preview-${idx}`}
            className="w-full h-full object-cover"
          />
          <button
            onClick={() => removeImage(idx)}
            className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  </div>

  {/* Video Upload */}
  <div>
    <label className="block font-medium text-gray-700 mb-2">
      Upload Video <span className="text-sm text-gray-500">(MP4 only)</span>
    </label>
    <input
      type="file"
      accept="video/mp4"
      onChange={handleVideoUpload}
      className="block w-full text-sm text-gray-500 
                 file:mr-4 file:py-2 file:px-4
                 file:rounded-lg file:border-0
                 file:text-sm file:font-semibold
                 file:bg-green-50 file:text-green-600
                 hover:file:bg-green-100"
    />

    {video && (
      <div className="mt-4 relative w-full max-w-sm border rounded-lg overflow-hidden shadow-sm">
        <video
          src={URL.createObjectURL(video)}
          controls
          className="w-full h-48 object-cover"
        />
        <button
          onClick={removeVideo}
          className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center"
        >
          ×
        </button>
      </div>
    )}
  </div>

  {/* Navigation */}
  <div className="flex justify-between pt-4">
    <button
      onClick={onBack}
      className="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200"
    >
      Back
    </button>
    <button
      onClick={async () => await handleUploadToStorage()}
      disabled={uploading}
      className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 disabled:opacity-50"
    >
      {uploading ? "Uploading..." : "Continue"}
    </button>
  </div>
</div>

  );
}
