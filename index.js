import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { authRoute } from "./routes/authRoute";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { urlRoute } from "./routes/urlRoute";
import { redirectUrl } from "./controllers/urlController";
require("dotenv").config();

const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    exposedHeaders: ["set-cookie"],
  })
);
app.use(express.json());
app.use(cookieParser());

app.use(morgan("dev"));

app.use("/api", authRoute);
app.use("/api", urlRoute);
// route.get("/u/:shortId", redirectUrl);

app.use("/u/:shortId", redirectUrl);

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Db connected");
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
main();
