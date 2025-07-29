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
    <div className="p-6 bg-white rounded shadow-md space-y-4">
      <h2 className="text-xl font-semibold text-green-600">Upload Gig Media</h2>

      <div>
        <label className="block font-medium mb-1">Upload Images (max 3)</label>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />
        <div className="flex gap-4 mt-2">
          {images.map((img, idx) => (
            <div key={idx} className="relative">
              <img
                src={URL.createObjectURL(img)}
                alt={`preview-${idx}`}
                className="w-24 h-24 object-cover rounded"
              />
              <button
                onClick={() => removeImage(idx)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block font-medium mb-1">Upload Video (MP4 only)</label>
        <input type="file" accept="video/mp4" onChange={handleVideoUpload} />
        {video && (
          <div className="mt-2 relative">
            <video src={URL.createObjectURL(video)} controls className="w-full max-w-sm" />
            <button
              onClick={removeVideo}
              className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5"
            >
              ×
            </button>
          </div>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
        >
          Back
        </button>
        <button
          onClick={async () => {
            await handleUploadToStorage();
          }}
          disabled={uploading}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
