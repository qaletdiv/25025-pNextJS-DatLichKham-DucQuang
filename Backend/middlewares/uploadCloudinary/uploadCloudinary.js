import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const patientImages = "patients"; // Tạo một folder cha để lưu ảnh của các bệnh nhân
    const username = req.body.username || req.account?.username || "unknow"; // Tạo folder chứa ảnh theo tên username

    return {
      folder: `${patientImages}/${username}`,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

const upload = multer({ storage, limits: { fileSize: 10 * 1024 * 1024 } });

export const uploadMultiple = upload.array("images", 10);
