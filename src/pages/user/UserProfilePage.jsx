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

  const renderProfileTypeField = () => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-1">Profile Type</label>
      {editable ? (
        <select
          name="profileType"
          className="w-full p-3 border rounded bg-gray-50 text-base"
          value={profile.profileType || "Buyer"}
          onChange={handleChange}
        >
          <option value="Buyer">Buyer</option>
          <option value="Seller">Seller</option>
          <option value="Both">Both</option>
        </select>
      ) : (
        <p className="p-3 bg-gray-50 border rounded text-base">{profile.profileType || "Buyer"}</p>
      )}
    </div>
  );

  return (
    <div 
      className="mx-4 md:mx-[130px] p-6 md:p-10 mt-6 md:mt-10 bg-white rounded-xl shadow-lg border border-gray-200"
    >
      {/* Profile Picture and Name */}
      <div className="flex flex-col items-center mb-8">
        <img
          src={profile.profilePictureUrl}
          alt="Profile"
          className="w-28 h-28 md:w-44 md:h-44 object-cover border border-gray-300 rounded"
        />
        <h2 className="text-2xl md:text-3xl font-bold mt-4 text-center">
          {profile.firstName} {profile.lastName}
        </h2>
        <p className="text-gray-600 text-base md:text-lg text-center">{profile.email}</p>
      </div>

      {/* Profile Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-base md:text-lg">
        {renderProfileTypeField()}
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
      <div className="flex flex-col md:flex-row justify-between gap-4 mt-10">
        <button
          onClick={() => setEditable(!editable)}
          className={`px-6 py-3 text-white font-semibold rounded ${
            editable ? "bg-gray-500 hover:bg-gray-600" : "bg-blue-600 hover:bg-blue-700"
          } transition w-full md:w-auto`}
        >
          {editable ? "Cancel" : "Edit Profile"}
        </button>

        {editable && (
          <button
            onClick={handleSave}
            disabled={saving}
            className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded transition text-lg w-full md:w-auto"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        )}
      </div>
    </div>
  );
};

export default UserProfilePage;
