// src/components/ChatWindow.jsx
import { useEffect, useRef, useState } from "react";
import { collection, addDoc, query, where, onSnapshot, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import emailjs from "@emailjs/browser";

export default function ChatWindow({ orderId, currentUserId, buyerId, sellerId }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("orderId", "==", orderId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs.sort((a, b) => a.timestamp?.seconds - b.timestamp?.seconds));
    });

    return () => unsubscribe();
  }, [orderId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
  if (!newMessage.trim()) return;

  const trimmedMessage = newMessage.trim();
  const receiverId = currentUserId === buyerId ? sellerId : buyerId;

  // Save the chat message
  await addDoc(collection(db, "chats"), {
    orderId,
    senderId: currentUserId,
    receiverId,
    message: trimmedMessage,
    timestamp: serverTimestamp(),
  });

  // Save in-app notification
  await addDoc(collection(db, "notifications"), {
    userId: receiverId,
    type: `You have a new message in you order # ${orderId}`,
    orderId,
    fromUserId: currentUserId,
    message: trimmedMessage,
    isRead: false,
    timestamp: serverTimestamp(),
  });

  // Send email using EmailJS
  emailjs.send(
    import.meta.env.VITE_SERVICE_ID,
    import.meta.env.VITE_TEMPLATE_ID,
    {
      email: "waqas.mahmood@pakistancables.com",           // You need to fetch email of receiver from Firestore
      message: trimmedMessage,
      order_id: orderId,
      sender_id: currentUserId,
    },
    import.meta.env.VITE_PUBLIC_KEY
  ).then(
    (result) => {
      console.log("Email sent:", result.text);
    },
    (error) => {
      console.error("Email error:", error.text);
    }
  );

  setNewMessage("");
};

  return (
    <div className="flex flex-col border rounded h-80 overflow-hidden">
      <div className="flex-1 overflow-y-auto p-2 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 p-2 rounded max-w-xs text-sm ${
              msg.senderId === currentUserId
                ? "bg-green-100 self-end ml-auto text-right"
                : "bg-white self-start mr-auto text-left"
            }`}
          >
            <p>{msg.message}</p>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>
      <div className="flex border-t">
        <input
          className="flex-1 p-2 text-sm outline-none"
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button
          onClick={handleSend}
          className="bg-green-600 text-white px-4 py-2 text-sm hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
