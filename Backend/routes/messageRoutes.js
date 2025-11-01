const express = require('express');
const messagerouter = express.Router();
const { getUserForSidebar, getMessages, markMessageAsSeen, sendMessage } = require('../controllers/messageController');
const { protectRoute } = require('../middleware/auth');

messagerouter.get('/users', protectRoute, getUserForSidebar);
messagerouter.get('/:id', protectRoute, getMessages);
messagerouter.post('/mark/:id', protectRoute, markMessageAsSeen);
messagerouter.post('/send/:id', protectRoute, sendMessage);  // Fixed: Added :id parameter

module.exports = messagerouter;
