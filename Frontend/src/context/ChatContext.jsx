import { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";
import toast from "react-hot-toast";
import axios from "axios";

export const ChatContext = createContext();

const backendUrl = import.meta.env.VITE_BACKEND_URL;

export const ChatProvider = ({ children }) => {
  const { authuser, socket, token } = useContext(AuthContext);

  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unseenMessages, setUnseenMessages] = useState({});
  const [data, setData] = useState({});

  // Fetch users with unseen messages count
  const getUsers = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/messages/users`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      const allUsers = data.data.filteredUsers || [];
      setUsers(allUsers);
      setUnseenMessages(data.data.unseenMessage || {});
    } catch (error) {
      console.error("getUsers error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUsers();
    }
  }, [token]);

  // Fetch messages with selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (data.success) {
        setMessages(data.messages || []);
        setData(data);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("getMessages error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Send message to selected user
  const sendMessage = async (messageData) => {
    if (!selectedUser?._id) {
      toast.error("Please select a user to send a message.");
      return;
    }
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/messages/send/${selectedUser._id}`,
        messageData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      if (data.success) {
        // Add new message to the messages array
        setMessages((prev) => [...prev, data.data]);
      }
    } catch (error) {
      console.error("sendMessage error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // Subscribe to socket event for new messages
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      console.log("New message received:", newMessage);
      
      // Check if message is from the currently selected user
      const messageSenderId = String(newMessage.senderId?._id || newMessage.senderId);
      const selectedUserId = String(selectedUser?._id);
      const currentUserId = String(authuser?._id);

      if (selectedUser && messageSenderId === selectedUserId) {
        // Message is from selected user, add to messages
        setMessages((prev) => [...prev, newMessage]);
        
        // Mark message as seen
        axios.put(
          `${backendUrl}/api/messages/mark/${newMessage._id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        ).catch(e => console.error("Failed to mark message seen:", e));
      } else if (messageSenderId !== currentUserId) {
        // Message is from someone else not currently selected
        // Update unseen messages count
        setUnseenMessages((prev) => ({
          ...prev,
          [messageSenderId]: (prev[messageSenderId] || 0) + 1,
        }));
      }
    };

    socket.on("newMessage", handleNewMessage);

    // Cleanup
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedUser, authuser, token, backendUrl]);

  // Clear unseen messages when user is selected
  useEffect(() => {
    if (selectedUser) {
      setUnseenMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0
      }));
    }
  }, [selectedUser]);

  const value = {
    users,
    messages,
    selectedUser,
    unseenMessages,
    setSelectedUser,
    getUsers,
    getMessages,
    sendMessage,
    data
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
