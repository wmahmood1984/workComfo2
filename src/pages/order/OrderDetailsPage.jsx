import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Link, useParams } from "react-router-dom";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import { waitForTransactionReceipt, writeContract } from "@wagmi/core";
import { useConfig } from "wagmi";
import { subscriptionContract } from "../../config";
import toast from "react-hot-toast";
import ChatWindow from "../../components/ChatWindow";

export default function OrderDetailsPage() {
  const config = useConfig();
  const { orderId } = useParams();
  const user = useAuth();
  const [order, setOrder] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [buyerProfile, setBuyerProfile] = useState(null);
  const [sellerProfile, setSellerProfile] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      const ref = doc(db, "orders", orderId);
      const snap = await getDoc(ref);

      if (snap.exists()) {
        const orderData = { id: snap.id, ...snap.data() };
        setOrder(orderData);

        const buyerRef = doc(db, "users", orderData.buyerId);
        const sellerRef = doc(db, "users", orderData.sellerId);

        const [buyerSnap, sellerSnap] = await Promise.all([getDoc(buyerRef), getDoc(sellerRef)]);
        if (buyerSnap.exists()) setBuyerProfile(buyerSnap.data());
        if (sellerSnap.exists()) setSellerProfile(sellerSnap.data());
      }
    };

    fetchOrder();
  }, [orderId, submitting]);

  const handleSubmitWork = async () => {
    setSubmitting(true);
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "submitted" });
      setOrder((prev) => ({ ...prev, status: "submitted" }));
      setSubmitting(false);
    } catch (error) {
      console.error("Error submitting work:", error);
      setSubmitting(false);
    }
  };

  const handleAcceptWork = async () => {
    setSubmitting(true);
    try {
      const acceptedDate = new Date();
      const clearanceDate = new Date(acceptedDate);
      clearanceDate.setDate(clearanceDate.getDate() + 7); // 7 days after acceptance

      const price = Number(order.packageDetails?.price || 0);
      const adminFee = price * 0.05;
      const sellerEarnings = price - adminFee;

      // Blockchain logic (if crypto-enabled)
      if (order.cryptoEnabled) {
        let subscribeHash = await writeContract(config, {
          ...subscriptionContract,
          functionName: "orderAcceptance",
          args: [orderId],
        });
        await waitForTransactionReceipt(config, { hash: subscribeHash });
      }

      // Update order status
      await updateDoc(doc(db, "orders", order.id), { status: "Accepted but not paid" });

      // Add seller earnings record
      await addDoc(collection(db, "earnings"), {
        sellerId: order.sellerId,
        orderId: order.id,
        amount: sellerEarnings,
        withdrawn: false,
        acceptedDate: acceptedDate,
        clearanceDate: clearanceDate,
        createdAt: serverTimestamp(),
      });

      // Add admin fee record
      await addDoc(collection(db, "adminFees"), {
        orderId: order.id,
        feeAmount: adminFee,
        acceptedDate: acceptedDate,
        createdAt: serverTimestamp(),
      });

      toast.success("Order accepted successfully");
      setSubmitting(false);
    } catch (error) {
      console.error("Error accepting order:", error);
      toast.error("Failed to accept order. See console.");
      setSubmitting(false);
    }
  };

  if (!order) return <p className="p-10">Loading order...</p>;

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 p-10">
        <h1 className="text-2xl font-bold text-center mb-6">Order ID: {order.id}</h1>
        {/* Order Details */}
        {/* ... (rest of your UI unchanged) ... */}

        {/* Chat Section */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Chat</h2>
          <ChatWindow orderId={order.id} buyerId={order.buyerId} sellerId={order.sellerId} currentUserId={user.uid} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-80 bg-white p-6 shadow-lg border-l">
        <div className="mb-6">
          <h3 className="text-lg font-bold mb-2">Order Status</h3>
          <p className="text-green-600 font-semibold text-xl">{order.status}</p>
        </div>

        {user.uid === order.sellerId && (
          <button
            onClick={handleSubmitWork}
            disabled={order.status === "submitted"}
            className={`w-full py-2 px-4 rounded mb-4 transition ${
              order.status === "submitted"
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            }`}
          >
            {submitting ? "Submitting..." : order.status === "submitted" ? "Work Submitted" : "Submit Work"}
          </button>
        )}

        {user.uid === order.buyerId && order.status !== "Accepted but not paid" && (
          <button
            onClick={handleAcceptWork}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded mb-4 cursor-pointer"
          >
            {submitting ? "Accepting..." : "Accept Work"}
          </button>
        )}

        <button className="w-full bg-red-500 text-white py-2 px-4 rounded cursor-pointer">Raise Conflict</button>
      </div>
    </div>
  );
}
