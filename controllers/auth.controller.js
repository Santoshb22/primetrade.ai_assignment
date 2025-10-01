const User = require("../models/user.model");
const { uploadtoCloudinary } = require("../utils/cloudinary");  

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

module.exports = { register };