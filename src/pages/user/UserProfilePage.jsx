import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import toast from "react-hot-toast";

const UserProfilePage = () => {
  const location = useLocation();
  const { userId } = location.state || {};

  const [profile, setProfile] = useState(null);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) return;
      try {
        const ref = doc(db, "users", userId);
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
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await setDoc(doc(db, "users", userId), profile, { merge: true });
      setEditable(false);
      toast.success("Profile updated!");
    } catch (err) {
      console.error(err);
      toast.error("Error updating profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center mt-20 text-xl">Loading profile...</div>;
  if (!profile) return <div className="text-center mt-20 text-red-600">User not found.</div>;

  const renderField = (label, name) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">{label}</label>
      {editable ? (
        <input
          type="text"
          name={name}
          className="w-full p-3 border rounded bg-gray-50 text-base"
          value={profile[name] || ""}
          onChange={handleChange}
        />
      ) : (
        <p className="p-3 bg-gray-50 border rounded text-base">{profile[name] || "-"}</p>
      )}
    </div>
  );

  return (
    <div 
    className="mx-[130px] p-10 mt-10 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {/* Profile Picture and Name */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={profile.profilePictureUrl}
          alt="Profile"
          className="w-44 h-44 object-cover border border-gray-300 rounded"
        />
        <h2 className="text-3xl font-bold mt-4">{profile.firstName} {profile.lastName}</h2>
        <p className="text-gray-600 text-lg">{profile.email}</p>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-lg">
        {renderField("First Name", "firstName")}
        {renderField("Middle Name", "middleName")}
        {renderField("Last Name", "lastName")}
        {renderField("Date of Birth", "dateOfBirth")}
        {renderField("Phone Number", "phoneNumber")}
        {renderField("Gender", "gender")}
        {renderField("City", "city")}
        {renderField("Country", "country")}
        <div className="md:col-span-2">{renderField("Address", "address")}</div>
      </div>

      {/* Buttons */}
      <div className="flex justify-between mt-12">
        <button
          onClick={() => setEditable(!editable)}
          className={`px-6 py-3 text-white font-semibold rounded ${
            editable ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          } transition`}
        >
          {editable ? "Cancel" : "Edit Profile"}
        </button>

        {editable && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded transition text-lg"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
