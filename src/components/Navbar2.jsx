import { Link, useNavigate } from "react-router-dom";
import ConnectButton from "../ConnectButton";
import { auth, googleProvider } from "../lib/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { useEffect, useState, useRef } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useUserNotifications } from "./UserNotifications";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const user = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsWithNames, setNotificationsWithNames] = useState([]);
  const [profileType, setProfileType] = useState(null);
  const [profile, setProfile] = useState({});
  const [activeRole, setActiveRole] = useState(
    localStorage.getItem("activeRole") || "Buyer"
  );
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const dropdownRef = useRef();
  const notificationsRef = useRef();

  const notifications = useUserNotifications(user?.uid);
  const unreadNotifications = notifications.filter((n) => !n.read);

  useEffect(() => {
    const fetchNames = async () => {
      if (!notifications.length) return;
      const enriched = await Promise.all(
        notifications.map(async (n) => {
          try {
            const userRef = doc(db, "users", n.fromUserId);
            const userSnap = await getDoc(userRef);
            const senderName = userSnap.exists()
              ? userSnap.data().firstName || "Unknown"
              : "Unknown";
            return { ...n, senderName };
          } catch {
            return { ...n, senderName: "Unknown" };
          }
        })
      );
      setNotificationsWithNames(enriched);
    };
    fetchNames();
  }, [notifications]);

  useEffect(() => {
  if (!user) return;
  const fetchProfileType = async () => {
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      const data = userSnap.data();
      setProfileType(data.profileType || "Buyer");
      setProfile(data);
      if (!localStorage.getItem("activeRole")) {
        const defaultRole =
          data.profileType === "Seller" ? "Seller" : "Buyer";
        setActiveRole(defaultRole);
        localStorage.setItem("activeRole", defaultRole);
      }
    } else {
      navigate("/complete-profile",{state:{userid:user.uid,email:user.email}});
    }
  };
  fetchProfileType();
}, [user]);


  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Login error:", err.response || err);
      toast.error("Login failed");
    }
  };

  const handleLogout = async () => {
    setShowDropdown(false);
    await signOut(auth);
    navigate("/");
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const toggleNotifications = async () => {
    setShowNotifications((prev) => !prev);
    if (!showNotifications && unreadNotifications.length > 0) {
      await Promise.all(
        unreadNotifications.map(async (n) => {
          const notifRef = doc(db, "notifications", n.id);
          await updateDoc(notifRef, { read: true });
        })
      );
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target))
        setShowDropdown(false);
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      )
        setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDashboardClick = () => {
    const role =
      profileType === "Seller"
        ? "Seller"
        : profileType === "Both"
        ? activeRole
        : "Buyer";
    navigate(`/${role.toLowerCase()}-dashboard/${user.uid}`);
  };

  const getBadgeClass = (type) => {
    if (type === "Seller")
      return "bg-green-100 text-green-800 border-green-300";
    if (type === "Both")
      return "bg-purple-100 text-purple-800 border-purple-300";
    return "bg-blue-100 text-blue-800 border-blue-300";
  };

  return (
    <nav className="w-full bg-white shadow px-6 py-3">
      {/* MOBILE LAYOUT */}
      <div className="md:hidden flex flex-col space-y-3">
        {/* Top: Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <img className="w-24" src={`/bgremoved.png`} alt="Logo" />
          </Link>
        </div>

        {/* Below: Profile + Bell + Burger */}
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            {!user ? (
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Login
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-green-600">
                  <img
                    src={profile.profilePictureUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    {profile.firstName || "User"}
                  </p>
                  <p
                    className={`inline-block px-2 py-0.5 text-xs rounded-full border mt-1 cursor-default ${getBadgeClass(
                      profileType
                    )}`}
                  >
                    {profileType || "Buyer"}
                  </p>
                </div>
              </div>
            )}
            {user && (
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={toggleNotifications}
                  className="relative p-2 rounded-full hover:bg-gray-100"
                >
                  🔔
                  {unreadNotifications.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                      {unreadNotifications.length}
                    </span>
                  )}
                </button>
                {showNotifications && notificationsWithNames.length > 0 && (
                  <div className="absolute left-0 mt-2 w-64 bg-white border rounded shadow-md z-10">
                    <ul>
                      {notificationsWithNames.map((n) => (
                        <li
                          key={n.id}
                          className="p-2 hover:bg-gray-100 text-sm"
                        >
                          <Link to={`/chat/${n.orderId}`}>
                            📩 New message from {n.senderName} in order{" "}
                            {n.orderId}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowMobileMenu(true)}
            className="p-3 rounded hover:bg-gray-100 text-4xl"
          >
            ☰
          </button>
        </div>
      </div>

      {/* DESKTOP LAYOUT */}
      <div className="hidden md:flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-green-600">
          <img className="w-24" src={`/bgremoved.png`} alt="Logo" />
        </Link>

        <div className="flex space-x-8 border-b border-gray-300 pb-2 px-[10%]">
          <Link
            to="/explore"
            className="text-lg font-semibold text-gray-800 hover:text-green-600 hover:underline"
          >
            Explore Gigs
          </Link>
          {profileType === "Seller" && (
            <Link
              to="/post"
              className="text-lg font-semibold text-gray-800 hover:text-green-600 hover:underline"
            >
              Post a Gig
            </Link>
          )}
          {user && (
            <span
              onClick={handleDashboardClick}
              className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-green-600 hover:underline"
            >
              Dashboard
            </span>
          )}
        </div>

        <div className="flex items-center space-x-6">
          <ConnectButton />
          {!user ? (
            <button
              onClick={handleLogin}
              className="cursor-pointer px-4 py-2 bg-green-600 text-white hover:bg-green-700"
            >
              Login
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleDropdown}
                className="cursor-pointer w-14 h-14 rounded-full bg-green-600 overflow-hidden"
              >
                <img
                  src={profile.profilePictureUrl}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                  <button
                    onClick={() => {
                      navigate("/profile", { state: { userId: user.uid } });
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
          {user && (
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-gray-100 cursor-pointer"
              >
                🔔
                {unreadNotifications.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>
              {showNotifications && notificationsWithNames.length > 0 && (
                <div className="absolute right-0 mt-2 w-64 bg-white border rounded shadow-md z-10">
                  <ul>
                    {notificationsWithNames.map((n) => (
                      <li key={n.id} className="p-2 hover:bg-gray-100 text-sm">
                        <Link to={`/chat/${n.orderId}`}>
                          📩 New message from {n.senderName} in order{" "}
                          {n.orderId}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* MOBILE SIDE PANEL */}
      <AnimatePresence>
        {showMobileMenu && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div
              className="fixed top-0 right-0 w-80 h-full bg-white shadow-lg p-6"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <button
                onClick={() => setShowMobileMenu(false)}
                className="mb-4 p-2 text-gray-600 hover:text-black"
              >
                ✕
              </button>
              <nav className="flex flex-col space-y-4">
                <Link
                  to="/explore"
                  className="text-lg font-semibold text-gray-800 hover:text-green-600"
                  onClick={() => setShowMobileMenu(false)}
                >
                  Explore Gigs
                </Link>
                {profileType === "Seller" && (
                  <Link
                    to="/post"
                    className="text-lg font-semibold text-gray-800 hover:text-green-600"
                    onClick={() => setShowMobileMenu(false)}
                  >
                    Post a Gig
                  </Link>
                )}
                {user && (
                  <>
                    <span
                      onClick={() => {
                        handleDashboardClick();
                        setShowMobileMenu(false);
                      }}
                      className="cursor-pointer text-lg font-semibold text-gray-800 hover:text-green-600"
                    >
                      Dashboard
                    </span>
                    <button
                      onClick={() => {
                        navigate("/profile", { state: { userId: user.uid } });
                        setShowMobileMenu(false);
                      }}
                      className="text-lg font-semibold text-gray-800 hover:text-green-600 text-left"
                    >
                      View Profile
                    </button>
                    <button
                      onClick={() => {
                        handleLogout();
                        setShowMobileMenu(false);
                      }}
                      className="text-lg font-semibold text-red-600 hover:text-red-800 text-left"
                    >
                      Logout
                    </button>
                  </>
                )}
                <div className="mt-6">
                  <ConnectButton />
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
