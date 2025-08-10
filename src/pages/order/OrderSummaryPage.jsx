import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDocs, query, where, or } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import { Link } from "react-router-dom";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "submitted", label: "Submitted" },
  { key: "Accepted but not paid", label: "Accepted but Not Paid" },
  { key: "paid", label: "Paid" },
];

export default function OrderSummaryPage() {
  const user = useAuth();
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, "orders"),
        or(where("buyerId", "==", user.uid), where("sellerId", "==", user.uid))
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };
    fetchOrders();
  }, [user]);

  const filteredOrders =
    activeTab === "all"
      ? orders.filter((o) => o.paymentStatus === "paid")
      : orders
          .filter((o) => o.paymentStatus === "paid")
          .filter((o) => o.status === activeTab);

          console.log("order",orders)

  return (
    <div className="bg-gray-100 p-4 md:p-10">
      {/* Tabs */}
      <div className="mb-6">
        {/* Desktop: Vertical tabs */}
        <div className="hidden md:flex w-48 flex-col gap-3">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-4 rounded-lg text-left font-medium transition cursor-pointer ${
                activeTab === tab.key
                  ? "bg-green-600 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Mobile: Horizontal tabs */}
        <div className="flex md:hidden justify-between border-b">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2 text-xs sm:text-sm text-center font-medium ${
                activeTab === tab.key
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="mt-6">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-green-700">
          {TABS.find((t) => t.key === activeTab).label} Orders
        </h2>
        {filteredOrders.length === 0 ? (
          <p className="text-gray-500">No orders found.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Link
                to={`/orderdetails/${order.id}`}
                key={order.id}
                className="bg-white rounded-lg shadow p-4 border flex justify-between items-center"
              >
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {order.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Status:{" "}
                    <span className="capitalize font-medium text-green-700">
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500">Budget: ${order.budget}</p>
                </div>
                <p className="text-sm text-gray-500">
                  {new Date(order.createdAt?.seconds * 1000).toLocaleDateString()}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
