import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    const accountAvatar = "avatars"; // Tạo một folder cha để lưu ảnh của các avatar
    const username = req.body.username || req.user?.username || "unknow"; // Tạo folder chứa ảnh theo tên username

    return {
      folder: `${patientImages}/${username}`,
      allowed_formats: ["jpg", "png", "jpeg", "webp"],
    };
  },
});

const upload = multer({ storage });

export const uploadSingle = upload.single("image");
