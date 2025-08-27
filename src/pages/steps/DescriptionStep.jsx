import { useState } from "react";

export default function GigDescriptionStep({setFormData,formData, onBack, onNext}) {
  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    setFormData(f => ({ ...f, description: e.target.value.slice(0,1200) })); // Limit to 1200 characters
  };

  return (
 <div className="min-h-screen bg-gray-50 flex items-start justify-center py-6 px-3 md:py-10 md:px-4">
  <div className="w-full max-w-3xl bg-white rounded-lg shadow p-4 md:p-8">
    {/* Heading */}
    <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
      Description
    </h2>
    <hr className="mb-6" />

    {/* Label */}
    <label className="block text-gray-600 font-medium mb-2">
      Briefly Describe Your Gig
    </label>

    {/* Toolbar */}
    <div className="border border-gray-300 rounded-t px-2 md:px-3 py-2 bg-gray-100 flex gap-2 md:gap-3 text-gray-600 text-sm md:text-base">
      <button type="button" className="hover:text-black font-bold">B</button>
      <button type="button" className="hover:text-black italic">I</button>
      <button type="button" className="hover:text-black">💡</button>
      <button type="button" className="hover:text-black">•</button>
      <button type="button" className="hover:text-black">1.</button>
    </div>

    {/* Textarea */}
    <textarea
      value={formData.description}
      onChange={handleChange}
      rows="8"
      className="w-full border-t-0 border-l border-r border-b border-gray-300 px-3 md:px-4 py-3 rounded-b resize-none focus:outline-none text-sm md:text-base"
      placeholder="Describe what you offer..."
    />

    {/* Character Counter */}
    <div className="text-right text-xs md:text-sm text-gray-500 mt-1">
      {formData.description.length}/1200 Characters
    </div>

    {/* Navigation Buttons */}
    <div className="flex flex-col md:flex-row justify-between gap-3 mt-6">
      <button
        onClick={onBack}
        className="w-full md:w-auto px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
      >
        Previous
      </button>
      <button
        onClick={onNext}
        className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Next: Requirements
      </button>
    </div>
  </div>
</div>

  );
}
