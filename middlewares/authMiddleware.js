import asyncHandler from "express-async-handler";
import CustomError from "../utils/CustomError";
// import config from "../config/index.js";
import JwtService from "../services/JwtService";
import User from "../models/userModel";

export const isLoggedIn = asyncHandler(async (req, _res, next) => {
  let token;

  if (
    req.cookies.token ||
    (req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer"))
  ) {
    token = req.cookies.token || req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new CustomError("NOt authorized to access this route", 401);
  } else {
    console.log("<<<<<Protected route>>>>>");
  }

  try {
    const decodedJwtPayload = JwtService.verify(token);

    //_id, find user based on id, set this in req.user
    req.user = await User.findById(decodedJwtPayload._id, "name email");
    next();
  } catch (error) {
    throw new CustomError("NOt authorized to access this route", 401);
  }
});
