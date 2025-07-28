import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Timestamp, addDoc, collection, doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";

const Checkout = () => {
  const { state } = useLocation();
  const user = useAuth();
  const navigate = useNavigate();

  const [placing, setPlacing] = useState(false);
  const [requirements, setRequirements] = useState([]);
  const [answers, setAnswers] = useState({});

  const gigId = state?.gigId;
  const packageType = state?.packageType;
  const packageDetails = state?.packageDetails;
  const sellerId = state?.sellerId;
  const gigTitle = state?.gigTitle;

  useEffect(() => {
    const fetchGigRequirements = async () => {
      if (!gigId) return;
      const gigRef = doc(db, "gigs", gigId);
      const gigSnap = await getDoc(gigRef);
      if (gigSnap.exists()) {
        const reqs = gigSnap.data().requirements || [];
        setRequirements(reqs);
        const initialAnswers = {};
        reqs.forEach((_, index) => {
          initialAnswers[index] = "";
        });
        setAnswers(initialAnswers);
      }
    };

    fetchGigRequirements();
  }, [gigId]);

  if (!state || !user) {
    return <p className="p-8 text-center">Invalid request</p>;
  }

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setPlacing(true);

    const orderData = {
      buyerId: user.uid,
      sellerId,
      gigId,
      gigTitle,
      packageType,
      packageDetails,
      requirements: requirements.map((q, idx) => ({
        question: q.question,
        answer: answers[idx] || "",
      })),
      status: "pending",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    try {
      const docRef = await addDoc(collection(db, "orders"), orderData);
      navigate(`/orders/${docRef.id}`,{state});
    } catch (err) {
      console.error("Error placing order:", err);
    } finally {
      setPlacing(false);
    }
  };



  return (
  <div className="max-w-5xl w-[70%] mx-auto p-10">

      <h1 className="text-3xl font-bold mb-6">Confirm Your Order</h1>

      <div className="mb-6 bg-gray-100 p-4 rounded shadow">
        <p><strong>Gig:</strong> {gigTitle}</p>
        <p><strong>Package:</strong> {packageType}</p>
        <p><strong>Price:</strong> ${packageDetails?.price}</p>
        <p><strong>Delivery Time:</strong> {packageDetails?.days} days</p>
      </div>

      <form onSubmit={handlePlaceOrder}>
        {requirements.length > 0 ? (
          <div className="space-y-6 mb-8">
            <h2 className="text-xl font-semibold">Answer the Following Questions:</h2>
            {requirements.map((req, idx) => (
              <div key={idx}>
                <label className="block font-medium mb-1">{req.question}</label>
                <textarea
                  required={req.required}
                  className="w-full border p-2 rounded shadow-sm"
                  rows="3"
                  value={answers[idx] || ""}
                  onChange={(e) =>
                    setAnswers({ ...answers, [idx]: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 mb-6">No requirements provided by the seller.</p>
        )}

        <button
          type="submit"
          disabled={placing}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 w-full"
        >
          {placing ? "Placing Order..." : "Place Order"}
        </button>
      </form>
    </div>
  );
};

export default Checkout;
