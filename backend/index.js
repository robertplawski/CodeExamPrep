import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./db/connectDB.js";

import authRoutes from "./routes/auth.route.js";
import contentRoutes from "./routes/content.route.js";
import cookieParser from "cookie-parser";
import uploadsRoutes from "./routes/uploads.route.js";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(
  cors({
    origin: [
      "http://192.168.1.172:5173",
      "http://192.168.1.172:5000",
      "https://cep.robertplawski.pl",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
  res.send("Api");
});
app.get("/api/ping", (req, res) => {
  res.status(200).json({ success: true, message: "Pong!" });
});

app.use("/api/auth", authRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/uploads", uploadsRoutes);
app.listen(PORT, () => {
  connectDB();
  console.log("Server listening on port: ", PORT);
});
