import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { collection, getDoc, getDocs,doc, query, where, or } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth"; // assuming custom hook for auth
import { Link } from "react-router-dom";

const TABS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "submitted", label: "Submitted" },
  { key: "Accepted but not paid", label: "Accepted but not Paid" },
  { key: "paid", label: "Paid" },
];

export default function OrderSummaryPage() {
  const  user  = useAuth(); // current user (should contain uid & role)
  const [activeTab, setActiveTab] = useState("all");
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {       
        // const ref = doc(db, "users", user.uid);
        //       const snap1 = await getDoc(ref);

   
      const q = query(
  collection(db, "orders"),
  or(
    where("buyerId", "==", user.uid),
    where("sellerId", "==", user.uid)
  )
);

const snap = await getDocs(q);
const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
setOrders(data);
    };

    fetchOrders();
  }, [user]);

  const filteredOrders =
    activeTab === "all"
      ? orders.filter((o)=>o.paymentStatus==="paid")
      : orders.filter((o)=>o.paymentStatus==="paid")
      
      .filter((o) => o.status === activeTab);

    console.log("order",filteredOrders,activeTab)

  return (
<div className="bg-gray-100 flex p-10">
      {/* Side Tabs */}
      <div className="w-48 mr-6">
        <div className="flex flex-col gap-3">
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
      </div>

      {/* Order List */}
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4 text-green-700">
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
                  <p className="text-sm text-gray-500">
                    Budget: ${order.budget}
                  </p>
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
