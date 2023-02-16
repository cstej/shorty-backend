import { isLoggedIn } from "../middlewares/authMiddleware";

const { Router } = require("express");
const {
  createShortUrl,
  redirectUrl,
  getAllurls,
  deleteUrl,
} = require("../controllers/urlController");
const route = Router();

route.post("/url", createShortUrl);
route.delete("/url/:shortId", isLoggedIn, deleteUrl);
route.get("/urls", isLoggedIn, getAllurls);

export { route as urlRoute };
