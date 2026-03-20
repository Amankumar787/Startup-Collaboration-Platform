import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import ApiError from "../utils/ApiError.js";

const createStorage = (folder) =>
  new CloudinaryStorage({
    cloudinary,
    params: {
      folder: `startup-platform/${folder}`,
      allowed_formats: ["jpg", "jpeg", "png", "webp"],
      transformation: [{ width: 800, height: 800, crop: "limit" }],
    },
  });

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new ApiError(400, "Only image files are allowed"), false);
  }
};

export const uploadAvatar = multer({
  storage: createStorage("avatars"),
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

export const uploadProjectCover = multer({
  storage: createStorage("projects"),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single("coverImage");