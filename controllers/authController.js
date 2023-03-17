import CustomError from "../utils/CustomError";
import asyncHandler from "express-async-handler";
import JwtService from "../services/JwtService";
import bcrypt from "bcrypt";
import User from "../models/userModel";

export const cookieOptions = {
  expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  httpOnly: true,
  //could be in a separate file in utils
};

export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new CustomError("Please fill all fields", 400);
  }
  //check if user exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new CustomError("User already exists", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });
  const token = JwtService.sign({ _id: user._id });
  console.log(user);
  user.password = undefined;

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    token,
    user,
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new CustomError("Please fill all fields", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new CustomError("Invalid credentials", 400);
  }

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  //   const isPasswordMatched = await user.comparePassword(password);

  if (isPasswordMatched) {
    const token = JwtService.sign({ _id: user._id });
    user.password = undefined;
    res.cookie("token", token, cookieOptions);
    return res.status(200).json({
      success: true,
      token,
      user,
    });
  }

  throw new CustomError("Invalid credentials - pass", 400);
});

export const logout = asyncHandler(async (req, res) => {
  // res.clearCookie()
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});

export const getProfile = asyncHandler(async (req, res) => {
  const { user } = req;
  if (!user) {
    throw new CustomError("User not found", 404);
  }
  res.status(200).json({
    success: true,
    user,
  });
});
