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

export default function Navbar() {
  const user = useAuth();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsWithNames, setNotificationsWithNames] = useState([]);
  const [profileType, setProfileType] = useState(null);
  const [activeRole, setActiveRole] = useState(
    localStorage.getItem("activeRole") || "Buyer"
  );
  const dropdownRef = useRef();
  const notificationsRef = useRef();

  const notifications = useUserNotifications(user?.uid);
  const unreadNotifications = notifications.filter((n) => !n.read);

  // Fetch sender names for notifications
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

  // Fetch user profileType
  useEffect(() => {
    if (!user) return;
    const fetchProfileType = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const data = userSnap.data();
        setProfileType(data.profileType || "Buyer");
        // Ensure active role defaults correctly
        if (!localStorage.getItem("activeRole")) {
          const defaultRole =
            data.profileType === "Seller" ? "Seller" : "Buyer";
          setActiveRole(defaultRole);
          localStorage.setItem("activeRole", defaultRole);
        }
      }
    };
    fetchProfileType();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const checkProfile = async () => {
      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);
      if (!userSnap.exists() || !userSnap.data().isProfileComplete) {
        navigate("/complete-profile", {
          state: { userid: user.uid, email: user.email },
        });
      }
    };
    checkProfile();
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
    navigate("/")
  };

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  // Mark notifications as read when opening
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

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(e.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle role switch
  const handleRoleSwitch = () => {
    const newRole = activeRole === "Buyer" ? "Seller" : "Buyer";
    setActiveRole(newRole);
    localStorage.setItem("activeRole", newRole);
    toast.success(`Switched to ${newRole} view`);
    navigate(`/${newRole.toLowerCase()}-dashboard/${user.uid}`); // Redirect immediately
  };

  // Navigate to dashboard based on role
  const handleDashboardClick = () => {
    const role =
      profileType === "Seller"
        ? "Seller"
        : profileType === "Both"
        ? activeRole
        : "Buyer";
    navigate(`/${role.toLowerCase()}-dashboard/${user.uid}`);
  };

  console.log("profile",profileType)

  return (
    <nav className="w-full flex justify-between items-center py-4 px-6 bg-white shadow relative">
      <Link to="/" className="text-xl font-bold text-green-600">
        <img className="w-24" src={`/bgremoved.png`} alt="Logo" />
      </Link>

      <div className="space-x-4 flex items-center relative">
        <Link to="/explore" className="text-gray-700 hover:text-green-600">
          Explore Gigs
        </Link>
        {profileType === "Seller" && (
        <Link to="/post" className="text-gray-700 hover:text-green-600">
          Post a Gig
        </Link>)}

        {user && (
          <button
            onClick={handleDashboardClick}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Dashboard
          </button>
        )}

        {/* Role Switcher (only for Both) */}
        {profileType === "Both" && (
          <button
            onClick={handleRoleSwitch}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Switch to {activeRole === "Buyer" ? "Seller" : "Buyer"}
          </button>
        )}

        <ConnectButton />

        {/* Notification Bell */}
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
                        📩 New message from {n.senderName} in order {n.orderId}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Profile/Login */}
        {!user ? (
          <button
            onClick={handleLogin}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
          >
            Login
          </button>
        ) : (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={toggleDropdown}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer"
            >
              {user.displayName}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate("/profile", { state: { userId: user.uid } });
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  View Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
