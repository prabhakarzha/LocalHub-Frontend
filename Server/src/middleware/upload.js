import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../utils/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "localhub/events",
    allowed_formats: ["jpg", "jpeg", "png"],
  },
});

// Ye line missing thi, isi wajah se upload object valid nahi tha
const upload = multer({ storage });

export { upload };
