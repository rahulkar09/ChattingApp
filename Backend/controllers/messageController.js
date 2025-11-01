const User = require('../models/User');
const Message = require('../models/message');
const cloudinary = require('../config/cloudinary');
const { io, userSocketMap } = require('../server'); // Add this import

const getUserForSidebar = async (req, res) => {
    try {
        const userId = req.user._id;
        const filteredUsers = await User.find({_id: {$ne: userId}}).select('-password');

        // Count number of unseen messages
        const unseenMessage = {};
        const promises = filteredUsers.map(async (user) => {
            const message = await Message.find({
                senderId: user._id,
                receiverId: userId, // Fixed spelling
                seen: false
            });
            if (message.length > 0) {
                unseenMessage[user._id] = message.length;
            }
        });
        await Promise.all(promises);

        return res.status(200).json({
            success: true, 
            data: {filteredUsers, unseenMessage}
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }   
};

// Get all messages for selected user
const getMessages = async (req, res) => {
    try {
        const {id: selectedUserId} = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [
                {senderId: myId, receiverId: selectedUserId},
                {senderId: selectedUserId, receiverId: myId}
            ]
        }).sort({createdAt: 1});
        
        await Message.updateMany(
            {senderId: selectedUserId, receiverId: myId, seen: false},
            {$set: {seen: true}}
        );
        
        return res.status(200).json({success: true, messages});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
};

// API to mark message as seen using message id
const markMessageAsSeen = async (req, res) => {
    try {
        const {id} = req.params;
        await Message.findByIdAndUpdate(id, {seen: true});
        return res.status(200).json({success: true, message: "Message marked as seen"});
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

// API for sending message to a selected user
const sendMessage = async (req, res) => {
    try {
        const {text, image} = req.body;
        const receiverId = req.params.id; // Fixed spelling
        const senderId = req.user._id;
        let imageUrl;
        
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        // Fixed: Use Message.create with await (no 'new' keyword)
        const newMessage = await Message.create({
            senderId,
            receiverId, // Fixed spelling
            text,
            image: imageUrl
        });

        // Emit the message to the receiver if online using socket.io
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
        
        return res.status(200).json({ 
            success: true,
            message: "Message sent successfully",
            data: newMessage
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: "Internal Server Error"});
    }
}

module.exports = {getUserForSidebar, getMessages, markMessageAsSeen, sendMessage};
