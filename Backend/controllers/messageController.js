const User = require('../models/User');
const Message = require('../models/message');
const cloudinary = require('../config/cloudinary');
const { io, userSocketMap,  } = require('../server'); // Import socket.io instance and socket map

// Get all users for sidebar with unseen messages count
const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: userId } }).select('-password');

        // Count unseen messages from each user to current user
        const unseenMessage = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            });
            if (messages.length > 0) {
                unseenMessage[user._id] = messages.length;
            }
        });
        await Promise.all(promises);

        return res.status(200).json({
            success: true,
            data: { filteredUsers, unseenMessage }
        });
    }
    catch (error) {
        console.error('getUserForSidebar error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Get all messages exchanged with selected user
const getMessages = async (req, res) => {
    try {
        const selectedUserId = req.params.id;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        }).sort({ createdAt: 1 });

        // Mark messages from selected user as seen
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId, seen: false },
            { $set: { seen: true } }
        );

        return res.status(200).json({ success: true, messages });
    }
    catch (error) {
        console.error('getMessages error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Mark a single message as seen by message ID
const markMessageAsSeen = async (req, res) => {
    try {
        const messageId = req.params.id;
        await Message.findByIdAndUpdate(messageId, { seen: true });
        return res.status(200).json({ success: true, message: "Message marked as seen" });
    }
    catch (error) {
        console.error('markMessageAsSeen error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

// Send message (text and/or image) to selected user and emit socket event if online
const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const receiverId = req.params.id;
        const senderId = req.user._id;

        if (!receiverId) {
            return res.status(400).json({ success: false, message: "Receiver ID is required" });
        }

        let imageUrl = null;
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Create and save new message document
        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        });

        console.log("receiverId:", receiverId);
console.log("receiverSocketId from map:", userSocketMap[receiverId]);


        // Emit message to recipient if connected
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        } else {
            console.log(`Receiver socket not connected for userId: ${receiverId}`);
        }

        return res.status(200).json({
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    }
    catch (error) {
        console.error('sendMessage error:', error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

module.exports = { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage };
