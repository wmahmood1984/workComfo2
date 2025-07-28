import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { writeContract, waitForTransactionReceipt } from "@wagmi/core";
import { useConfig } from "wagmi";
import { subscriptionContract } from "../../config";
import { useAppKitAccount } from "@reown/appkit/react";
import { parseEther } from "ethers/lib/utils";
import PaymentModal from "../../components/PaymentModal";

const OrderConfirmation = () => {
  const { address } = useAppKitAccount();
  const config = useConfig();

  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [bnbPrice, setBNBPrice] = useState(0);
  const [openModal,setOpenModal] = useState(false)

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder(docSnap.data());
        }

        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd"
        );
        const data = await res.json();
        const price = data.binancecoin.usd;

        setBNBPrice(price);
      } catch (err) {
        console.error("Error loading order", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  

  const handleMockPayment = async () => {
    setPaying(true);
  
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        status: "active",
        paymentStatus: "paid",
        paidAt: new Date().toISOString(),
        paymentMethod: selectedMethod,
      });
      setPaid(true);
      setPaying(false);
      // navigate(`/orders/${id}`);
      setOpenModal(false)
  
  };

  const handleCryptoPayment2 = async () => {
    setPaying(true);
    // Integrate actual wallet connection here
    setTimeout(async () => {
      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        status: "active",
        paymentStatus: "paid",
        paidAt: new Date().toISOString(),
        paymentMethod: selectedMethod,
      });
      setPaid(true);
      setPaying(false);
      navigate(`/orders/${id}`);
    }, 2000);
  };

  const handleCryptoPayment = async (e) => {
    setPaying(true);

    const now = Math.floor(new Date().getTime() / 1000);
    try {
      let value = parseEther(Number(order.packageDetails.price/bnbPrice).toFixed(8));
      let _args = [
        [
          address,
          state.sellerAddress,
          id,
          value,
          now + 60 * 60 * 24 * 30,
          false,
          now,
          value,
          false,
          0,
        ],
      ];
      console.log("args", _args,value);
      let subscribeHash = await writeContract(config, {
        ...subscriptionContract,
        functionName: "orderBooking",
        args: _args,
        value,
      });
      await waitForTransactionReceipt(config, { hash: subscribeHash });

      const orderRef = doc(db, "orders", id);
      await updateDoc(orderRef, {
        status: "active",
        paymentStatus: "paid",
        paidAt: new Date().toISOString(),
        paymentMethod: selectedMethod,
      });
      setPaid(true);
      setPaying(false);
    } catch (error) {
      console.log("error in submitting", error);
      setPaying(false);
    }
  };

  const handlePay = () => {
    if (selectedMethod === "crypto") {
      handleCryptoPayment();
    } else {
      setOpenModal(true);
    }
  };

  if (loading) return <p className="p-10 text-center">Loading order...</p>;
  if (!order) return <p className="p-10 text-center">Order not found.</p>;

  const total = order.packageDetails?.price || 0;
        console.log("order", bnbPrice);
  return (
    <div className="max-w-4xl w-[80%] mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Order Confirmation</h1>

      <div className="bg-gray-100 p-6 rounded shadow mb-6">
        <p>
          <strong>Gig:</strong> {order.gigTitle}
        </p>
        <p>
          <strong>Package:</strong> {order.packageType}
        </p>
        <p>
          <strong>Price:</strong> ${total}
        </p>
        <p>
          <strong>Delivery Time:</strong> {order.packageDetails?.days} days
        </p>
        <p>
          <strong>Status:</strong> {order.status}
        </p>
      </div>

      {!paid && (
        <>
          {state.gigCryptoEnabled && (
            <h2 className="text-xl font-semibold mb-4">
              Choose Payment Method
            </h2>
          )}
                      {state.gigCryptoEnabled && (
          <div className="flex gap-4 mb-6">

              <button
                onClick={() => setSelectedMethod("crypto")}
                className={`flex-1 border p-4 rounded text-center font-semibold transition-all duration-200 cursor-pointer ${
                  selectedMethod === "crypto"
                    ? "bg-green-100 border-green-500 text-green-700"
                    : "hover:border-green-300"
                }`}
              >
                Pay in Smart Contract Escrow
              </button>

            <button
              onClick={() => setSelectedMethod("conventional")}
              className={`flex-1 border p-4 rounded text-center font-semibold transition-all duration-200 cursor-pointer ${
                selectedMethod === "conventional"
                  ? "bg-blue-100 border-blue-500 text-blue-700"
                  : "hover:border-blue-300"
              }`}
            >
              Pay with Card / Bank
            </button>
          </div>
            )}
          {(selectedMethod || !state.gigCryptoEnabled) && (
            <button
              onClick={handlePay}
              disabled={paying}
              className="w-full bg-green-600 text-white py-3 rounded text-lg hover:bg-green-700 cursor-pointer"
            >
              {paying ? "Processing Payment..." : state.gigCryptoEnabled ? `Pay $${total} / BNB${Number(total/bnbPrice).toFixed(4)} Now`:`Pay $${total} Now`}
            </button>
          )}
        </>
      )}

      {paid && (
        <p className="text-green-600 font-semibold text-xl mt-6">
          ✅ Payment Successful via {selectedMethod}!
        </p>
      )}
      <PaymentModal open={openModal} onClose={handleMockPayment} paying={paying}/>
    </div>
  );
};

export default OrderConfirmation;
