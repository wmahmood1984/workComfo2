import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

const BuyerDashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wallet, setWallet] = useState({
    balance: 0,
    totalSpent: 0,
    activeOrders: 0,
  });
  const [recentSellers, setRecentSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [showProfile, setShowProfile] = useState(false);

  const tabs = [
    { key: "all", label: "All" },
    { key: "active", label: "Active" },
    { key: "submitted", label: "Submitted" },
    { key: "accepted_unpaid", label: "Accepted (Unpaid)" },
    { key: "paid", label: "Paid" },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch buyer details
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          setUser(userSnap.data());
        }

        // Fetch orders placed by this buyer
        const ordersRef = collection(db, "orders");
        const ordersQuery = query(ordersRef, where("buyerId", "==", userId));
        const ordersSnapshot = await getDocs(ordersQuery);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(ordersList);

        // Wallet stats
        const completedOrders = ordersList.filter(
          (order) => order.status === "completed"
        );
        const activeOrders = ordersList.filter(
          (order) => order.status === "active"
        );
        const totalSpent = completedOrders.reduce(
          (sum, order) => sum + (order.amount || 0),
          0
        );

        setWallet({
          balance: userSnap.data().walletBalance || 0,
          totalSpent: totalSpent,
          activeOrders: activeOrders.length,
        });

        // Recent sellers
        const sellersSet = new Set(ordersList.map((order) => order.sellerId));
        const sellersData = [];
        for (let sellerId of sellersSet) {
          const sellerRef = doc(db, "users", sellerId);
          const sellerSnap = await getDoc(sellerRef);
          if (sellerSnap.exists()) {
            sellersData.push({ id: sellerId, ...sellerSnap.data() });
          }
        }
        setRecentSellers(sellersData);
      } catch (error) {
        console.error("Error fetching buyer dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchData();
  }, [userId]);

  const filteredOrders = orders.filter((order) => {
    if (activeTab === "all") return true;
    if (activeTab === "accepted_unpaid")
      return order.status === "accepted" && !order.paid;
    if (activeTab === "paid") return order.paid;
    return order.status === activeTab;
  });

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="flex flex-col md:flex-row h-full min-h-screen bg-gray-50">
      {/* Sidebar (hidden on mobile) */}
      <aside className="hidden md:block w-80 bg-white border-r p-6">
        <div className="flex flex-col items-center">
          <img
            src={user.profilePictureUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover mb-4"
          />
          <h2 className="text-xl font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
          <p className="text-gray-600">Buyer Level: {user.level || "Newbie"}</p>
        </div>
        <div className="mt-8 text-sm text-gray-700 space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>City:</strong> {user.city}
          </p>
          <p>
            <strong>Country:</strong> {user.country}
          </p>
          <p>
            <strong>Phone:</strong> {user.phoneNumber}
          </p>
          <p>
            <strong>Total Orders:</strong> {orders.length}
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-10 space-y-10">
        {/* Profile Card (Mobile Only) */}
        {/* <div className="block md:hidden bg-white rounded-lg shadow p-4">
          <div className="flex items-center gap-4">
            <img
              src={user.profilePictureUrl}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover"
            />
            <div>
              <h2 className="text-lg font-semibold">{`${user.firstName} ${user.lastName}`}</h2>
              <p className="text-gray-600 text-sm">Buyer Level: {user.level || "Newbie"}</p>
              <button
                className="text-blue-600 text-sm underline mt-1"
                onClick={() => setShowProfile(!showProfile)}
              >
                {showProfile ? "Hide Details" : "Show Details"}
              </button>
            </div>
          </div>
          {showProfile && (
            <div className="mt-4 text-sm text-gray-700 space-y-1">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>City:</strong> {user.city}</p>
              <p><strong>Country:</strong> {user.country}</p>
              <p><strong>Phone:</strong> {user.phoneNumber}</p>
              <p><strong>Total Orders:</strong> {orders.length}</p>
            </div>
          )}
        </div> */}

        {/* Orders Section with Tabs */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
          {/* Horizontal Tabs (scrollable on mobile) */}
          {/* Horizontal Tabs (spread evenly) */}
          <div className="grid grid-cols-5 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-1 py-2 text-center truncate text-xs sm:text-sm font-medium ${
                  activeTab === tab.key
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filtered Orders List */}
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <Link
                  to={`/orderdetails/${order.id}`}
                  key={order.id}
                  className="bg-white rounded-lg shadow p-4 border flex justify-between items-center"
                >
                  <h3 className="font-semibold text-lg">{order.title}</h3>
                  <p className="text-sm text-gray-600">
                    Status: {order.status}
                  </p>
                  <p className="text-sm text-gray-600">
                    Amount: ${order.amount}
                  </p>
                </Link>
              ))
            ) : (
              <p className="text-gray-500">No orders in this category.</p>
            )}
          </div>
        </section>

        {/* Wallet Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Current Balance</p>
              <h3 className="text-xl font-bold">${wallet.balance}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Total Spent</p>
              <h3 className="text-xl font-bold">${wallet.totalSpent}</h3>
            </div>
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Active Orders</p>
              <h3 className="text-xl font-bold">{wallet.activeOrders}</h3>
            </div>
          </div>
        </section>

        {/* Recently Engaged Sellers */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recently Engaged Sellers</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {recentSellers.length > 0 ? (
              recentSellers.map((seller) => (
                <div
                  key={seller.id}
                  className="bg-white p-4 rounded shadow text-center"
                >
                  <img
                    src={seller.profilePictureUrl}
                    alt={seller.firstName}
                    className="w-20 h-20 object-cover rounded-full mx-auto mb-2"
                  />
                  <h3 className="text-sm font-semibold">{`${seller.firstName} ${seller.lastName}`}</h3>
                  <p className="text-xs text-gray-600 truncate">
                    {seller.email}
                  </p>
                  <p className="text-xs text-gray-500">
                    Level: {seller.level || "Newbie"}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No sellers engaged yet.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default BuyerDashboard;
