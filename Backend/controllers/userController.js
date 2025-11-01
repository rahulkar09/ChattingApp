const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const { cloudinary } = require("../config/cloudinary");

// Signup USER
const signupUser = async(req, res) => { 
    const {fullname, email, password} = req.body;
    try {
        if(!fullname || !email || !password) {
            return res.status(400).json({
                success: false, 
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({email});
        if(existingUser) {
            return res.status(400).json({
                success: false, 
                message: "User already exists"
            });
        }

        const salt = await bcrypt.genSalt(12);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await User.create({
            fullname, 
            email, 
            password: hashedPassword
        });

        const token = jwt.sign({userId: newUser._id}, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        const userResponse = {
            _id: newUser._id,
            fullname: newUser.fullname,
            email: newUser.email,
            profilePic: newUser.profilePic,
            bio: newUser.bio
        };

        return res.status(201).json({
            success: true, 
            message: "User created successfully", 
            data: { userData: userResponse, token }
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: "Internal Server Error"
        });
    }
};

// Login
const login = async(req, res) => {
    const {email, password} = req.body;
    try {
        if(!email || !password) {
            return res.status(400).json({
                success: false, 
                message: "All fields are required"
            });
        }

        const existingUser = await User.findOne({email});
        if(!existingUser) {
            return res.status(400).json({
                success: false, 
                message: "User does not exist"
            });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
        if(!isPasswordCorrect) {
            return res.status(400).json({
                success: false, 
                message: "Invalid credentials"
            });
        }

        const token = jwt.sign({userId: existingUser._id}, process.env.JWT_SECRET, {
            expiresIn: '24h'
        });

        const userResponse = {
            _id: existingUser._id,
            fullname: existingUser.fullname,
            email: existingUser.email,
            profilePic: existingUser.profilePic,
            bio: existingUser.bio
        };

        return res.status(200).json({
            success: true, 
            message: "Login successful", 
            data: { userData: userResponse, token }
        });

    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: "Internal Server Error"
        });
    }
};

// Controller to check if user is authenticated (FIXED)
const checkAuth = async(req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        
        if(!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            user: user
        });
    } catch(error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
};

// Controller to update user profile
const updateProfile = async(req, res) => {
    try {
        const {profilePic, bio, fullName} = req.body;
        
        const userId = req.user.userId;

        if(!userId) {
            return res.status(401).json({
                success: false, 
                message: "Unauthorized - Invalid token"
            });
        }

        let updatedUser;

        if(!profilePic) {
            updatedUser = await User.findByIdAndUpdate(
                userId, 
                {bio, fullName}, 
                {new: true}
            ).select('-password');
        } else {
            try {
                const upload = await cloudinary.uploader.upload(profilePic);
                updatedUser = await User.findByIdAndUpdate(
                    userId, 
                    {
                        profilePic: upload.secure_url,
                        bio,
                        fullName
                    }, 
                    {new: true}
                ).select('-password');
            } catch(uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({
                    success: false, 
                    message: "Failed to upload image"
                });
            }
        }

        if(!updatedUser) {
            return res.status(404).json({
                success: false, 
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true, 
            message: "Profile updated successfully", 
            user: updatedUser
        });

    } catch(error) {  
        console.error(error);
        return res.status(500).json({
            success: false, 
            message: "Internal Server Error"
        });
    }
};

module.exports = {signupUser, login, checkAuth, updateProfile};
