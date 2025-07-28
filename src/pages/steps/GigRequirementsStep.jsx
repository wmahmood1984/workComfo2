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
    <div className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Gig Requirements</h2>
        <p className="text-gray-600">
          Add all the questions you need the buyer to answer before starting the order.
        </p>

        {/* Display added questions */}
        {requirements.length > 0 && (
          <div className="space-y-4">
            {requirements.map((req, index) => (
              <div
                key={index}
                className="border border-gray-300 rounded p-4 bg-gray-50 relative"
              >
                <p className="text-gray-800 font-medium">{req.question}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {req.required ? "* Required" : "Optional"}
                </p>
                <button
                  className="absolute top-2 right-2 text-red-500 text-sm hover:underline"
                  onClick={() => handleDelete(index)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add a new question */}
        <div className="space-y-2 pt-6">
          <label className="block text-gray-700 font-medium">
            Ask a new question
          </label>
          <input
            type="text"
            value={newQuestion}
            onChange={(e) => setNewQuestion(e.target.value)}
            placeholder="e.g., What information do you need from the buyer?"
            className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring focus:ring-green-300"
          />
          <div className="flex items-center mt-2">
            <input
              id="required"
              type="checkbox"
              checked={isRequired}
              onChange={() => setIsRequired(!isRequired)}
              className="mr-2"
            />
            <label htmlFor="required" className="text-gray-600">
              This question is required
            </label>
          </div>
          <button
            onClick={handleAddRequirement}
            className="mt-3 bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          >
            Add Question
          </button>
        </div>

        <div className="text-right pt-4">
             <button
          onClick={onBack}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Previous
        </button>
          <button 
          onClick={onNext}
          className="bg-gray-800 text-white px-6 py-3 rounded hover:bg-gray-900 transition">
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}
