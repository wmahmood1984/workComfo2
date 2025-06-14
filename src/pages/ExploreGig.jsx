// src/pages/ExploreGigsPage.jsx

export default function ExploreGig() {
  const gigs = [
    {
      title: "Build a Web3 Landing Page",
      budget: "0.5 BNB",
      shortDesc: "I need a React landing page with wallet connect and IPFS hosting.",
      status: "Open",
    },
    {
      title: "Create NFT Minting DApp",
      budget: "1.2 BNB",
      shortDesc: "A simple NFT drop site with whitelist support.",
      status: "Open",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-10">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-6">Explore Gigs</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {gigs.map((gig, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow">
            <h2 className="text-xl font-semibold text-gray-800">{gig.title}</h2>
            <p className="text-sm text-gray-600 mt-2">{gig.shortDesc}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-green-600 font-bold">{gig.budget}</span>
              <span className={`text-sm font-medium ${gig.status === "Open" ? "text-green-500" : "text-gray-500"}`}>
                {gig.status}
              </span>
            </div>
            <button className="mt-4 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Apply
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
