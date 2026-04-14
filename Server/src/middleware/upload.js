import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    // URL path check karke folder decide karega
    const isService = req.originalUrl.includes("/services");
    return {
      folder: isService ? "localhub/services" : "localhub/events",
      allowed_formats: ["jpg", "jpeg", "png"],
    };
  },
});

const upload = multer({ storage });

export { upload };
