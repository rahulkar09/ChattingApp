const mongoose = require('mongoose');
require('dotenv').config();

const messageSchema  = new mongoose.Schema({
    senderId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true 
    },
    recieverId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User',
        required : true
    },
    text : {
        type : String,
        required : true
    },
    seen : {
        type : Boolean,
        default : false
    }
    
}, { timestamps: true })

module.exports = mongoose.models.Message || mongoose.model('Message', messageSchema);
