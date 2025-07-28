// src/pages/Messages.jsx
import React, { useEffect, useState } from "react";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { useParams } from "react-router-dom";

const Messages = () => {
  const tId = useParams();
  const user = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(tId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);

  useEffect(() => {
    if (!user) return;

    const threadsRef = collection(db, "threads");
    const q = query(threadsRef, where("users", "array-contains", user.uid));

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedThreads = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setThreads(fetchedThreads);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!selectedThread) return;

    const messagesRef = collection(
      db,
      "threads",
      selectedThread.id,
      "messages"
    );
    const q = query(messagesRef, orderBy("timestamp"));

    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedMessages = snapshot.docs.map((doc) => doc.data());
      setMessages(fetchedMessages);
    });

    return () => unsub();
  }, [selectedThread]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const msg = {
      senderId: user.uid,
      text: newMessage.trim(),
      timestamp: Timestamp.now(),
      isRead: false,
    };

    await addDoc(collection(db, "threads", selectedThread.id, "messages"), msg);
    setNewMessage("");
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
    );

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        setUploadProgress(percent);
      }
    });

    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);

        await addDoc(collection(db, "threads", selectedThread.id, "messages"), {
          senderId: user.uid,
          fileUrl: data.secure_url,
          fileName: file.name,
          fileType: file.type,
          timestamp: Timestamp.now(),
          isRead: false,
        });

        setUploadProgress(null);
      }
    };

    xhr.open(
      "POST",
      `https://api.cloudinary.com/v1_1/${
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
      }/upload`
    );
    xhr.send(formData);
  };

  console.log("contact", messages);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-80 border-r overflow-y-auto">
        <h2 className="text-xl font-semibold p-4">Messages</h2>
        <ul>
          {threads.map((thread) => {
            const otherUser = thread.users.find((uid) => uid !== user.uid);

            return (
              <li
                key={thread.id}
                className={`p-4 cursor-pointer hover:bg-gray-100 ${
                  selectedThread?.id === thread.id ? "bg-gray-200" : ""
                }`}
                onClick={() => setSelectedThread(thread)}
              >
                <p className="font-medium">Chat with: {otherUser}</p>
                <p className="text-sm text-gray-600 truncate">
                  {thread.lastMessage}
                </p>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Chat Window */}
      <main className="flex-1 flex flex-col">
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`mb-2 ${
                msg.senderId === user.uid ? "text-right" : "text-left"
              }`}
            >
              {msg.imageUrl ? (
                <a
                  href={msg.imageUrl}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={msg.imageUrl}
                    alt="attachment"
                    className="max-w-xs rounded-lg shadow"
                  />
                </a>
              ) : msg.fileUrl ? (
                <div className="inline-block p-3 border rounded bg-gray-100">
                  <p className="text-gray-700 mb-1 font-medium">
                    {msg.fileName}
                  </p>
                  <a
                    href={msg.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Download File
                  </a>
                </div>
              ) : (
                <p className="inline-block px-4 py-2 rounded bg-green-100 text-gray-800">
                  {msg.text}
                </p>
              )}
            </div>
          ))}
        </div>
          {uploadProgress !== null && (
            <div className="w-full bg-gray-200 rounded mt-2 h-2">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}
        <div className="p-4 border-t flex">
        
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 border rounded mr-2"
          />
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
          >
            Send
          </button>
          <input
            type="file"
            accept="*/*"
            onChange={handleFileUpload}
            className="hidden"
            id="fileInput"
          />
          <label
            htmlFor="fileInput"
            className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer ml-0.5"
          >
            File
          </label>
        </div>
      </main>
    </div>
  );
};

export default Messages;
