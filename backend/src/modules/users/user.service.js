import User from "./user.model.js";
import ApiError from "../../utils/ApiError.js";
import cloudinary from "../../config/cloudinary.js";

export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");
  return user.toPublicProfile();
};

export const getAllDevelopers = async (query = {}) => {
  const { skills, search, page = 1, limit = 10 } = query;

  const filter = { role: "developer", isActive: true };

  if (skills) {
    const skillArray = skills.split(",").map((s) => s.trim());
    filter.skills = { $in: skillArray };
  }

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { bio:  { $regex: search, $options: "i" } },
    ];
  }

  const skip  = (page - 1) * limit;
  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  return {
    users,
    pagination: {
      total,
      page:       Number(page),
      pages:      Math.ceil(total / limit),
      limit:      Number(limit),
    },
  };
};

export const updateUserProfile = async (userId, updateData) => {
  const allowedFields = ["name", "bio", "skills", "socialLinks"];
  const filtered = {};

  allowedFields.forEach((field) => {
    if (updateData[field] !== undefined) {
      filtered[field] = updateData[field];
    }
  });

  const user = await User.findByIdAndUpdate(
    userId,
    { $set: filtered },
    { new: true, runValidators: true }
  );

  if (!user) throw new ApiError(404, "User not found");
  return user.toPublicProfile();
};

export const updateProfileImage = async (userId, file) => {
  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  // Delete old image from Cloudinary
  if (user.profileImage?.publicId) {
    await cloudinary.uploader.destroy(user.profileImage.publicId);
  }

  user.profileImage = {
    url:      file.path,
    publicId: file.filename,
  };

  await user.save({ validateBeforeSave: false });
  return user.toPublicProfile();
};