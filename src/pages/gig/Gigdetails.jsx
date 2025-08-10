import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../lib/firebase";
import ContactSellerButton from "../../components/ContactSellerButton";

const GigDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [gig, setGig] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGig = async () => {
      try {
        const gigRef = doc(db, "gigs", id);
        const gigSnap = await getDoc(gigRef);
        if (gigSnap.exists()) {
          setGig(gigSnap.data());
        } else {
          setGig(null);
        }
      } catch (error) {
        console.error("Error fetching gig:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchGig();
  }, [id]);

  const handleSelectPackage = (type, pkg) => {
    navigate("/checkout", {
      state: {
        gigId: id,
        packageType: type,
        packageDetails: pkg,
        sellerId: gig.userId,
        gigTitle: gig.title,
        gigCryptoEnabled: gig.cryptoEnabled,
        sellerAddress: gig.sellerAddress,
      },
    });
  };

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (!gig) return <p className="p-10 text-center">Gig not found.</p>;

  return (
    <div className="w-full">
      {/* Banner Carousel */}
      <div className="w-full h-[300px] md:h-[500px] overflow-hidden">
        <Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false}>
          {gig.gallery.images?.map((url, idx) => (
            <div key={idx} className="w-full h-[300px] md:h-[500px]">
              <img src={url} alt={`Gig Image ${idx}`} className="w-full h-full object-cover" />
            </div>
          ))}
        </Carousel>
      </div>

      {/* Gig Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-6 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold mb-4">{gig.title}</h1>
        <p className="text-sm text-gray-600 mb-4">
          {gig.cryptoEnabled ? "Crypto acceptable" : "Crypto not acceptable"}
        </p>

        {/* Creator Info */}
        <div className="bg-white shadow-md rounded-lg p-4 flex items-center gap-4 mb-6 md:mb-8">
          <img src={gig.userImage} alt="User" className="w-16 h-16 rounded-full object-cover" />
          <div>
            <h3 className="text-lg font-semibold">{gig.userName}</h3>
            <p className="text-sm text-gray-500">
              Level {gig.level || 1} • {gig.experience || "New"}
            </p>
            <p className="text-sm text-gray-500">
              Gig Hired {gig.hiredCount || 0} times
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white shadow-md rounded-lg p-4 mb-6 md:mb-10">
          <h2 className="text-xl font-semibold mb-2">Description</h2>
          <p className="text-base leading-relaxed text-gray-800 whitespace-pre-wrap">
            {gig.description}
          </p>
        </div>

        <ContactSellerButton sellerId={gig.userId} />

        {/* Packages Section */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Packages</h2>
          {/* Mobile: Stacked cards */}
          <div className="block md:hidden space-y-4">
            {Object.entries(gig.packages || {}).map(([key, pkg]) => (
              <div key={key} className="border rounded-lg p-4 shadow-sm">
                <h3 className="text-lg font-semibold capitalize mb-2">{key} Package</h3>
                <p className="text-gray-700">Price: <strong>${pkg.price}</strong></p>
                <p className="text-gray-700">Delivery: {pkg.days} days</p>
                <p className="text-gray-700">Revisions: {pkg.revisions}</p>
                <button
                  onClick={() => handleSelectPackage(key, pkg)}
                  className="mt-3 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                >
                  Order
                </button>
              </div>
            ))}
          </div>
          {/* Desktop: Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-3">Package</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Days</th>
                  <th className="p-3">Revisions</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(gig.packages || {}).map(([key, pkg]) => (
                  <tr key={key} className="border-t">
                    <td className="p-3 capitalize">{key}</td>
                    <td className="p-3">${pkg.price}</td>
                    <td className="p-3">{pkg.days} days</td>
                    <td className="p-3">{pkg.revisions}</td>
                    <td className="p-3">
                      <button
                        onClick={() => handleSelectPackage(key, pkg)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                      >
                        Order
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Deadline & Tags */}
        <div className="mb-8 md:mb-10">
          <p className="text-base md:text-lg">
            <strong>Deadline:</strong> {gig.deadline} days
          </p>
          <div className="flex gap-2 mt-2 flex-wrap">
            {gig.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-10">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Customer Reviews</h2>
          {gig.reviews?.length > 0 ? (
            <div className="space-y-4">
              {gig.reviews.map((review, i) => (
                <div key={i} className="border rounded-lg p-4 shadow-sm">
                  <p className="font-medium text-gray-800">{review.customerName}</p>
                  <p className="text-sm text-yellow-600">Rating: {review.rating} / 5</p>
                  <p className="mt-1 text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GigDetailsPage;
