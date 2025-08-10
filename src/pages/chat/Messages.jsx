import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  addDoc,
  orderBy,
  Timestamp,
  getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../../lib/firebase";
import { useAuth } from "../../hooks/useAuth";

const Messages = () => {
  const tId = useParams();
  const user = useAuth();
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(tId || null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [uploadProgress, setUploadProgress] = useState(null);
  const [userProfiles, setUserProfiles] = useState({});

  // mobile mode state
  const [isMobileChatOpen, setIsMobileChatOpen] = useState(false);

  const fetchUserProfiles = async (uids) => {
    const profiles = {};
    for (const uid of uids) {
      if (!profiles[uid]) {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          profiles[uid] = userDoc.data();
        }
      }
    }
    setUserProfiles((prev) => ({ ...prev, ...profiles }));
  };

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "threads"),
      where("users", "array-contains", user.uid)
    );
    const unsub = onSnapshot(q, async (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setThreads(fetched);

      // Collect all other participant UIDs
      const otherUids = fetched
        .map((thread) => thread.users.find((uid) => uid !== user.uid))
        .filter(Boolean);

      // Fetch their profiles
      await fetchUserProfiles(otherUids);
    });

    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!selectedThread) return;

    const q = query(
      collection(db, "threads", selectedThread.id, "messages"),
      orderBy("timestamp")
    );

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

  console.log("first", userProfiles);

  return (
    <div className="flex h-screen">
      {/* Sidebar - desktop */}
      <aside className="hidden md:block w-80 border-r overflow-y-auto">
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
                onClick={() => {
                  setSelectedThread(thread);
                  setIsMobileChatOpen(true); // show chat on mobile
                }}
              >
                <p className="font-medium">
                  Chat with: {userProfiles[otherUser]?.firstName || otherUser}
                </p>
                <p className="text-sm text-gray-600 truncate">
                  {thread.lastMessage}
                </p>
              </li>
            );
          })}
        </ul>
      </aside>

      {/* Sidebar - mobile */}
      {!selectedThread && (
        <aside className="block md:hidden w-full overflow-y-auto">
          <h2 className="text-xl font-semibold p-4">Messages</h2>
          <ul>
            {threads.map((thread) => {
              const otherUser = thread.users.find((uid) => uid !== user.uid);
              return (
                <li
                  key={thread.id}
                  className="p-4 border-b cursor-pointer hover:bg-gray-50"
                  onClick={() => {
                    setSelectedThread(thread);
                    setIsMobileChatOpen(true);
                  }}
                >
                  <p className="font-medium">
                    {" "}
                    Chat with: {userProfiles[otherUser]?.firstName || otherUser}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {thread.lastMessage}
                  </p>
                </li>
              );
            })}
          </ul>
        </aside>
      )}

      {/* Chat Window */}
      {selectedThread && (
        <main className="flex-1 flex flex-col w-full">
          {/* Back button for mobile */}
          <div className="md:hidden p-2 border-b flex items-center">
            <button
              onClick={() => {
                setIsMobileChatOpen(false);
                setSelectedThread(null); // <-- important
              }}
              className="text-sm bg-gray-200 px-3 py-1 rounded mr-2"
            >
              ← Back
            </button>
            <h3 className="font-semibold">Chat</h3>
          </div>

          {/* Messages */}
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
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img
                      src={msg.imageUrl}
                      alt="attachment"
                      className="max-w-[70%] md:max-w-xs rounded-lg shadow"
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
                  <p className="inline-block px-4 py-2 rounded bg-green-100 text-gray-800 max-w-[80%] break-words">
                    {msg.text}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Upload progress */}
          {uploadProgress !== null && (
            <div className="w-full bg-gray-200 rounded mt-2 h-2">
              <div
                className="bg-green-500 h-2 rounded"
                style={{ width: `${uploadProgress}%` }}
              ></div>
            </div>
          )}

          {/* Input area */}
          <div className="border-t flex mx-full">
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
      )}
    </div>
  );
};

export default Messages;
