import ApiError from "../utils/ApiError.js";

export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ApiError(403, `Access denied. Required role: ${roles.join(" or ")}`)
      );
    }
    next();
  };
};