// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";

import Home from "./pages/Home";
import PostGigPage from "./pages/PostGigPage";
import ExploreGig from "./pages/ExploreGig";

import { Toaster } from "react-hot-toast";
import CreateGigWizard from "./pages/gig/CreateGigWizard";
import CompleteProfileForm from "./pages/user/CreateProfile";
import UserProfilePage from "./pages/user/UserProfilePage";
import GigDetailsPage from "./pages/gig/Gigdetails";

import Messages from "./pages/chat/Messages";
import Checkout from "./pages/order/Checkout";
import OrderConfirmation from "./pages/order/OrderConfirmation";
import OrderDetailsPage from "./pages/order/OrderDetailsPage";
import Showcaseprofile from "./pages/user/ShowcaseProfile";
import Footer from "./components/Footer";
import Buyerdashboard from "./pages/user/BuyerDashboard";
import Sellerdashboard from "./pages/user/SellerDashboard";
function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <Toaster position="top-center" toastOptions={{ duration: 3000 }} />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<ExploreGig />} />
          {/* <Route path="/post" element={<PostGigPage />} /> */}
          {/* <Route path="/gig/:id" element={<GigDetailsPage />} /> */}
          <Route path="/post" element={<CreateGigWizard />} />
          <Route path="/complete-profile" element={<CompleteProfileForm />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/gig-details/:id" element={<GigDetailsPage />} />
          <Route path="/buyer-dashboard/:userId" element={<Buyerdashboard />} />
          <Route path="/seller-dashboard/:userId" element={<Sellerdashboard />} />
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:id" element={<Messages />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/orders/:id" element={<OrderConfirmation />} />
          <Route path="/orderdetails/:orderId" element={<OrderDetailsPage />} />
          <Route path="/profileshowcase/:id" element={<Showcaseprofile />} />
        </Routes>
        <Footer/>
      </div>
    </Router>
  );
}

export default App;
