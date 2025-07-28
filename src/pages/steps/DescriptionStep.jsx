import { useState } from "react";

export default function GigDescriptionStep({setFormData,formData, onBack, onNext}) {
  const [description, setDescription] = useState("");

  const handleChange = (e) => {
    setFormData(f => ({ ...f, description: e.target.value.slice(0,1200) })); // Limit to 1200 characters
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Description</h2>
        <hr className="mb-6" />

        <label className="block text-gray-600 font-medium mb-2">
          Briefly Describe Your Gig
        </label>

        {/* Toolbar */}
        <div className="border border-gray-300 rounded-t px-3 py-2 bg-gray-100 flex gap-3 text-gray-600">
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
          rows="10"
          className="w-full border-t-0 border-l border-r border-b border-gray-300 px-4 py-3 rounded-b resize-none focus:outline-none"
          placeholder="Describe what you offer..."
        />

        <div className="text-right text-sm text-gray-500 mt-1">
          {formData.description.length}/1200 Characters
        </div>
        
      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
        <button
          onClick={onNext}
          className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Next: Requirements
        </button>
      </div>
      </div>
      
    </div>
  );
}
