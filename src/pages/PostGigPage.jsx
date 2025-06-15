// src/pages/PostGigPage.jsx
import { useState } from "react";
import { db } from '../lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';


export default function PostGigPage() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    budget: "",
    deadline: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const gig = {
    ...form,
    created_at: Timestamp.now(),
    status: "open"
  };

  try {
    await addDoc(collection(db, "gigs"), gig);
    alert("Gig submitted successfully!");
    setForm({ title: "", description: "", budget: "", deadline: "" });
  } catch (err) {
    console.error("Error posting gig:", err);
    alert("Something went wrong");
  }
};

  return (
    <div className="min-h-screen px-6 py-10 bg-gray-100 flex justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-white p-8 rounded-xl shadow space-y-6"
      >
        <h1 className="text-3xl font-bold text-green-600 text-center">
          Post a Gig
        </h1>

        <div>
          <label className="block font-semibold text-gray-700">Gig Title</label>
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className="w-full mt-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div>
          <label className="block font-semibold text-gray-700">Description</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full mt-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-gray-700">Budget (e.g. BNB)</label>
            <input
              type="text"
              name="budget"
              value={form.budget}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-green-300"
            />
          </div>

          <div>
            <label className="block font-semibold text-gray-700">Deadline</label>
            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
              required
              className="w-full mt-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-green-300"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700 transition"
        >
          Submit Gig
        </button>
      </form>
    </div>
  );
}
