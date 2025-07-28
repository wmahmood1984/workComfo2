import { useEffect, useState } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../lib/firebase";

export function useUserNotifications(userId) {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const q = query(
      collection(db, "notifications"),
      where("userId", "==", userId),
      where("isRead", "==", false)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setNotifications(notes);
    });

    return () => unsubscribe();
  }, [userId]);

  return notifications;
}
