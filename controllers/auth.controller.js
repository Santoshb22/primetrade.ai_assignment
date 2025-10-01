const User = require("../models/user.model");
const { uploadtoCloudinary } = require("../utils/cloudinary");  

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId);  // ✅ fix typo
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken; // ✅ fix
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}; 

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const avatarLocalpath = req?.file?.path;

    // validate required fields
    if ([name, username, email, password].some(field => !field || field.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(409).json({ message: "User with this email or username already exists" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters long" });
    }

    let avatar = { cloudinaryAvatarUrl: "", cloudinaryAvatarPublicId: "" };

    if (req.file) {
      const uploadResult = await uploadtoCloudinary(avatarLocalpath);
      if (uploadResult) {
        avatar.cloudinaryAvatarUrl = uploadResult.url;
        avatar.cloudinaryAvatarPublicId = uploadResult.public_id;
      } else {
        return res.status(500).json({ message: "Failed to upload avatar image" });
      }
    }

    const createUser = await User.create({
      name,
      username,
      email,
      password,
      avatar
    });

    const createdUser = await User.findById(createUser._id).select("-password -refreshToken");

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: createdUser
    });

  } catch (error) {
    console.error("Error during registration:", error);
    res.status(500).json({ message: "Server error during registration" });  
  }
};

const login = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username) {
      return res.status(400).json({ message: "Email or username is required" });
    }

    const user = await User.findOne({ $or: [ { email }, { username } ] });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await user.isPasswordMatch(password); // ✅ fix
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { refreshToken, accessToken } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
      httpOnly: true,
      secure: true,  // set to false in dev if needed
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
};

module.exports = { register, login };
