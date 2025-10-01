const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
}); 

const uploadtoCloudinary = async (filePath) => {
    try {
        if(!filePath) return null;

        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: "image",
        });
        return result;
    } catch (error) {
        console.error("Cloudinary upload error:", error);
        return null;
    }
    finally {
        fs.unlinkSync(filePath, (err) => {
            if(err) console.error("Error deleting local file:", err);
        });
    }   
};

const deleteFromCloudinary = async(public_id) => {
    try {
        if(!public_id) return null;

        const result = await cloudinary.uploader.destroy(public_id, {
            resource_type: "image"
        })

        return result;
    } catch (error) {
        console.log("Failed to delete image:", error);  
        return null; 
    }
}


module.exports = { uploadtoCloudinary, deleteFromCloudinary };