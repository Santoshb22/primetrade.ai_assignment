const User = require("../models/user.model");
const { uploadtoCloudinary } = require("../utils/cloudinary");  

const generateAccessAndRefreshTokens = async (userId) => {
    const user = await User.findbyId(userId);
    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    User.refreshToken = refreshToken;
    await user.save({validateBeforeSave: false});

    return { accessToken, refreshToken };
} 

const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;
        const avatarLocalpath = req.file.path;

        if([name, username, email, password].some(field => field.trim() === "")) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if(existingUser) {
            return res.status(409).json({ message: "User with this email or username already exists" });
        }

        if(password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters long" });
        }

        if(!req.file) {
            return res.status(400).json({ message: "Avatar image is required" });
        }

          let avatar = {
            cloudinaryAvatarUrl: "",
            cloudinaryAvatarPublicId: ""
        };
        const uploadResult = await uploadtoCloudinary(avatarLocalpath);
        if(uploadResult) {
            avatar.cloudinaryAvatarUrl = uploadResult.secure_url;
            avatar.cloudinaryAvatarPublicId = uploadResult.public_id;
        } else {
            return res.status(500).json({ message: "Failed to upload avatar image" });
        }

        const newUser = new User({
            name,
            username,       
            email,
            password,
            avatar
        }); 

        const createUser = await User.crreate(newUser);
        
        const createdUser = await User.findbyId(createUser._id).select("-password -refreshToken");   
        return res.status(201).json({success: true, message: "User registered successfully", user: createdUser });   

    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ message: "Server error during registration" });  
    }
}

const login = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        if(!email && !username) {
            return res.status(400).json({ message: "Email or username is required" });
        }

        const user = await user.findOne({
            $or: [ { email }, { username } ]
        })

        if(!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if(!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
        }
        const isPasswordValid = await user.isPasswordMatch(password);

        const {refreshToken, accessToken} = await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findbyId(user._id).select("-password -refreshToken");

        const cookieOptions = {
            httpOnly: true,
            secure: true,
        };

        return res.status(200)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .cookie("accessToken", accessToken, cookieOptions)
        .json({
            success: true,
            message: "Login successful",
            accessToken,
            user: loggedInUser
        });
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json({ message: "Server error during login" }); 
    }
}

module.exports = { 
    register,
    login
};