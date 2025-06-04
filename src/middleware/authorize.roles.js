

import ApiError from "../utils/ApiError.js";


export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      return next(
        new ApiError("Access denied. You do not have permission to perform this action.", 403)
      );
    }

    next(); 
  };
};
