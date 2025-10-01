const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true, 
        },  
        
        username: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
            index: true
        },
        
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true, 
        },

        avatar: {
            cloudinaryAvatarUrl: {
                type: String
            },

            cloudinaryAvatarPublicId: {
                type: String
            }
        },

        password: {
            type: String,
            required: [true, 'Password is required']
        },
        
        refreshToken: {
            type: String
        }
    },
     
    {
        timestamps: true,
    }
)

userSchema.pre("save", async function(next) {
    if (this.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    next();
});


userSchema.methods.isPasswordMatch = async function(password) {
    return await bcrypt.compare(password, this.password);
}

userSchema.methods.generateAccessToken = function() {
    const payload = {
        id: this._id,
        role: this.role,
        username: this.username,
        email: this.email
    }

    return jwt.sign(
        {
            payload,
        },
            process.env.ACCESS_TOKEN_SECRET,
        { 
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}


userSchema.methods.generateRefreshToken = function() {
    const payload = {
        id: this._id,
    }

    return jwt.sign(
        {
            payload,
        },
            process.env.REFRESH_TOKEN_SECRET,
        { 
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


const User = mongoose.model("User", userSchema);

module.exports = User;
