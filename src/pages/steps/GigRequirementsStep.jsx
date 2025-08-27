import { useState, useEffect } from "react";


export default function GigRequirementsStep({formData, setFormData, onBack, onNext}) {
  const [requirements, setRequirements] = useState([]);
  const [newQuestion, setNewQuestion] = useState("");
  const [isRequired, setIsRequired] = useState(true);

 useEffect(() => {
    setFormData(prev => ({
      ...prev,
      requirements
    }));
  }, [requirements, setFormData]);
  
  const handleAddRequirement = () => {
    if (!newQuestion.trim()) return;

    const newReq = {
      question: newQuestion.trim(),
      required: isRequired
    };

    const updated = [...requirements, newReq];
    setRequirements(updated);
    setNewQuestion("");
    setIsRequired(true);
  };

  const handleDelete = (index) => {
    const updated = [...requirements];
    updated.splice(index, 1);
    setRequirements(updated);
  };

  return (
  <div className="min-h-screen bg-gray-50 flex justify-center py-12 px-6">
  <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-8 space-y-8">
    {/* Heading */}
    <div className="text-center space-y-2">
      <h2 className="text-3xl font-bold text-gray-900">Gig Requirements</h2>
      <p className="text-gray-600">
        Add the questions you need the buyer to answer before starting the order.
      </p>
    </div>

    {/* Display added questions */}
    {requirements.length > 0 && (
      <div className="space-y-4">
        {requirements.map((req, index) => (
          <div
            key={index}
            className="relative border border-gray-200 rounded-xl bg-gray-50 p-5 shadow-sm hover:shadow-md transition"
          >
            <p className="text-gray-800 font-medium">{req.question}</p>
            <p className="text-sm text-gray-500 mt-1">
              {req.required ? "⭐ Required" : "Optional"}
            </p>
            <button
              className="absolute top-3 right-3 text-red-500 text-sm hover:text-red-600"
              onClick={() => handleDelete(index)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    )}

    {/* Add a new question */}
    <div className="space-y-4">
      <div>
        <label className="block text-gray-700 font-semibold mb-2">
          Ask a new question
        </label>
        <input
          type="text"
          value={newQuestion}
          onChange={(e) => setNewQuestion(e.target.value)}
          placeholder="e.g., What information do you need from the buyer?"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
        />
      </div>

      <div className="flex items-center space-x-2">
        <input
          id="required"
          type="checkbox"
          checked={isRequired}
          onChange={() => setIsRequired(!isRequired)}
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
        />
        <label htmlFor="required" className="text-gray-600">
          This question is required
        </label>
      </div>

      <button
        onClick={handleAddRequirement}
        className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition w-full sm:w-auto"
      >
        ➕ Add Question
      </button>
    </div>

    {/* Navigation Buttons */}
    <div className="flex justify-between pt-6 border-t border-gray-200">
      <button
        onClick={onBack}
        className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
      >
        ← Previous
      </button>
      <button
        onClick={onNext}
        className="bg-gray-900 text-white px-6 py-2 rounded-lg shadow hover:bg-gray-800 transition"
      >
        Save & Continue →
      </button>
    </div>
  </div>
</div>

  );
}
