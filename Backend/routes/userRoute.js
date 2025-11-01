const express = require('express');
const { signupUser, login, updateProfile, checkAuth } = require('../controllers/userController');
const { protectRoute } = require('../middleware/auth');

const userRouter = express.Router();

userRouter.post('/signup', signupUser);
userRouter.post('/login', login);
userRouter.patch('/updateProfile', protectRoute, updateProfile);  // Changed to PATCH
userRouter.get('/checkauth' , protectRoute , checkAuth )
module.exports = userRouter;
