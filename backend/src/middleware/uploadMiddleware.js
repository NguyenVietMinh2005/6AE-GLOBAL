import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";

// Cấu hình Cloudinary (Lấy từ biến môi trường .env để bảo mật)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: "6ae_global_documents",
        resource_type: "auto" // Cho phép tải lên cả PDF, ảnh JPG, PNG...
    }
});

export const upload = multer({ storage });