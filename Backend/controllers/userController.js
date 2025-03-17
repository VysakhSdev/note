import asyncHandler from "../middleware/asyncHandler.js";
import UserModel from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//-------------------SIGN UP------------//
export const userSignUp = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  console.log(req.body, "req.body");

  // Validate required fields
  if (!name || !email || !phone || !password) {
    return res.status(400).json({
      status: "failed",
      message: "All fields are required",
    });
  }

  // Check if user already exists
  const existingUser = await UserModel.findOne({ email });
  if (existingUser) {
    return res.status(403).json({
      status: "failed",
      message: "The provided email is already registered",
    });
  }

  // Create new user
  const newUser = await UserModel.create({ name, email, password, phone });

  return res.status(201).json({
    status: "success",
    data: newUser,
    message: "User registered successfully",
  });
});

//-------------------LOGIN------------//
export const userLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate required fields
  if (!email || !password) {
    return res.status(400).json({
      status: "failed",
      message: "Email and password are required",
    });
  }

  // Find user by email
  const user = await UserModel.findOne({ email });
  if (!user) {
    return res.status(404).json({
      status: "failed",
      message: "No account found with this email",
    });
  }

  // Check password
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      status: "failed",
      message: "Incorrect password. Please try again.",
    });
  }

  // Generate JWT token
  const accessToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.USER_ACCESS_TOKEN_SECRET,
    { expiresIn: "60d" }
  );

  // Send response
  return res.status(200).json({
    status: "success",
    data: {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token: accessToken,
    },
    message: "Login successful",
  });
});
