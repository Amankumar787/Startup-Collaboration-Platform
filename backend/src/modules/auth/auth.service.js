import User from "../users/user.model.js";
import ApiError from "../../utils/ApiError.js";
import { generateToken } from "../../utils/generateToken.js";

export const registerUser = async ({ name, email, password, role }) => {
  const exists = await User.findOne({ email });
  if (exists) throw new ApiError(409, "Email already registered");

  const user  = await User.create({ name, email, password, role });
  const token = generateToken({ id: user._id, role: user.role });

  return { user: user.toPublicProfile(), token };
};

export const loginUser = async ({ email, password }) => {
  const user = await User.findOne({ email }).select("+password");
  if (!user) throw new ApiError(401, "Invalid email or password");

  const isMatch = await user.comparePassword(password);
  if (!isMatch) throw new ApiError(401, "Invalid email or password");

  if (!user.isActive) throw new ApiError(403, "Account deactivated");

  user.lastSeen = new Date();
  await user.save({ validateBeforeSave: false });

  const token = generateToken({ id: user._id, role: user.role });
  return { user: user.toPublicProfile(), token };
};