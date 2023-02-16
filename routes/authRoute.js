import express from "express";
import {
  getProfile,
  login,
  logout,
  signUp,
} from "../controllers/authController";
import { isLoggedIn } from "../middlewares/authMiddleware";

const route = express.Router();

route.post("/auth/signup", signUp);
route.post("/auth/login", login);
route.get("/auth/logout", logout);
route.get("/auth/profile", isLoggedIn, getProfile);

export { route as authRoute };
