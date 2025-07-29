import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db } from "../../lib/firebase";
import OrderSummaryPage from "../order/OrderSummaryPage";

const BuyerDashboard = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState({ active: [], completed: [], cancelled: [] });
  const [wallet, setWallet] = useState({ balance: 0, totalSpent: 0, activeOrders: 0 });
  const [recentSellers, setRecentSellers] = useState([]);
  const [loading, setLoading] = useState(true);

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
        const ordersList = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const activeOrders = ordersList.filter(order => order.status === "active");
        const completedOrders = ordersList.filter(order => order.status === "completed");
        const cancelledOrders = ordersList.filter(order => order.status === "cancelled");

        setOrders({ active: activeOrders, completed: completedOrders, cancelled: cancelledOrders });

        // Calculate wallet and spending
        const totalSpent = completedOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
        const activeOrderAmount = activeOrders.reduce((sum, order) => sum + (order.amount || 0), 0);

        setWallet({
          balance: userSnap.data().walletBalance || 0,
          totalSpent: totalSpent,
          activeOrders: activeOrders.length,
        });

        // Fetch recent sellers interacted with
        const sellersSet = new Set(ordersList.map(order => order.sellerId));
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

  if (loading) return <div className="p-10 text-center">Loading...</div>;
  if (!user) return <div className="p-10 text-center">User not found.</div>;

  return (
    <div className="flex h-full min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <aside className="w-80 bg-white border-r p-6">
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
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>City:</strong> {user.city}</p>
          <p><strong>Country:</strong> {user.country}</p>
          <p><strong>Phone:</strong> {user.phoneNumber}</p>
          <p><strong>Total Orders:</strong> {orders.active.length + orders.completed.length + orders.cancelled.length}</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 space-y-10">
        {/* Orders Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Orders</h2>
          <OrderSummaryPage orders={orders} />
        </section>

        {/* Wallet Section */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Your Wallet</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Current Balance</p>
              <h3 className="text-xl font-bold">${wallet.balance}</h3>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Total Spent</p>
              <h3 className="text-xl font-bold">${wallet.totalSpent}</h3>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <p className="text-gray-600">Active Orders</p>
              <h3 className="text-xl font-bold">{wallet.activeOrders}</h3>
            </div>
          </div>
        </section>

        {/* Recently Engaged Sellers */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Recently Engaged Sellers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSellers.length > 0 ? (
              recentSellers.map((seller) => (
                <div key={seller.id} className="bg-white p-4 rounded shadow">
                  <img
                    src={seller.profilePictureUrl}
                    alt={seller.firstName}
                    className="w-24 h-24 object-cover rounded-full mb-4"
                  />
                  <h3 className="text-lg font-semibold">{`${seller.firstName} ${seller.lastName}`}</h3>
                  <p className="text-gray-600">{seller.email}</p>
                  <p className="text-sm text-gray-500">Level: {seller.level || "Newbie"}</p>
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
