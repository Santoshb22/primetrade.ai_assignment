const User = require("../models/user.model");
const { uploadtoCloudinary, deleteFromCloudinary } = require("../utils/cloudinary");  
const jwt = require("jsonwebtoken");

const generateAccessAndRefreshTokens = async (userId) => {
  const user = await User.findById(userId); 
  const accessToken = await user.generateAccessToken();
  const refreshToken = await user.generateRefreshToken();

  user.refreshToken = refreshToken; 
  await user.save({ validateBeforeSave: false });

  return { accessToken, refreshToken };
}; 

const register = async (req, res) => {
  try {
    const { name, username, email, password } = req.body;
    const avatarLocalPath = req?.file?.path; 

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
      const uploadResult = await uploadtoCloudinary(avatarLocalPath); 
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

    const isPasswordValid = await user.isPasswordMatch(password); 
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id); 

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

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
};

const logout = async (req, res) => {
  try {
    await User.findByIdAndUpdate( 
      req.user._id, 
      {
        $unset: {
          refreshToken: 1,
        }
      },
      {
        new: true
      }
    )

    const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User logged out" })
  } catch (error) {
    return res.status(500).json({ message: "Log out failed" })
  }
}

const generateNewRefreshToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!incomingRefreshToken) {
      return res.status(401).json({ message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id); 

    if (!user) {
      return res.status(401).json({ message: "Invalid refresh token" });
    }

    if (user.refreshToken !== incomingRefreshToken) {
      return res.status(401).json({ message: "Refresh token is expired or used" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id); 

    const options = {
      httpOnly: true,
      secure: true
    }

    return res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({ message: "Access token refreshed" });
  } catch (error) {
    return res.status(401).json({ message: error.message || "Invalid refresh token" });
  }
}

const editAvatar = async (req, res) => {
  try {
    const avatarLocalPath = req.file?.path;

    if (!avatarLocalPath) {
      return res.status(400).json({ message: "Avatar is required" });
    }

    const cloudinaryResponse = await uploadtoCloudinary(avatarLocalPath); 
    if (!cloudinaryResponse) {
      return res.status(400).json({ message: "Failed to upload new avatar" });
    }

    const avatar = {
      cloudinaryAvatarUrl: cloudinaryResponse?.secure_url || "",
      cloudinaryAvatarPublicId: cloudinaryResponse?.public_id || "",
    };
  
    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.avatar?.cloudinaryAvatarPublicId) {
      await deleteFromCloudinary(user.avatar?.cloudinaryAvatarPublicId);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          avatar
        }
      },
      {
        new: true
      }
    ).select("-password -refreshToken");

    return res.status(200).json({ message: "Avatar updated successfully", user: updatedUser });

  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
}

const editProfile = async (req, res) => {
  try {
    const { name, username, email } = req.body;

    if ([name, username, email].some(field => !field || field.trim() === "")) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(req.user?._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
      _id: { $ne: req.user?._id }
    });
    if (existingUser) {
      return res.status(409).json({ message: "Email or username already in use" });
    }

    user.name = name;
    user.username = username;
    user.email = email;
    await user.save();

    const updatedUser = await User.findById(req.user?._id).select("-password -refreshToken");
    console.log(updatedUser);
    return res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating profile:", error);
    return res.status(500).json({ message: "Server error during profile update" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id).select("-password -refreshToken");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return res.status(500).json({ message: "Server error during fetching profile" });
  }
};

module.exports = { register, login, logout, generateNewRefreshToken, editAvatar, editProfile, getProfile };