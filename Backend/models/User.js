const mongoose = require('mongoose');
require('dotenv').config();

const messageSchema = new mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true 
    },
    receiverId: {  // Fixed spelling (or keep as recieverId if you prefer)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    text: {
        type: String,
        default: ''  // Made optional since image-only messages are possible
    },
    image: {
        type: String,  // Cloudinary URL
        default: null
    },
    seen: {
        type: Boolean,
        default: false
    }
    
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
