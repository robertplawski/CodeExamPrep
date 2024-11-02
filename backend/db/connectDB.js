import mongoose from "mongoose";
import multer from "multer";
import { GridFsStorage } from "multer-gridfs-storage";
import { configDotenv } from "dotenv";
configDotenv();
export var storage = new GridFsStorage({
  url: process.env.MONGODB_URI,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      const filename = file.originalname;
      const fileInfo = {
        filename: filename,
        bucketName: "uploads",
      };
      resolve(fileInfo);
    });
  },
});
export var upload = multer({ storage });

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    upload = console.log("MongoDB connected: ", conn.connection.host);
  } catch (error) {
    console.log("Error connection to MongoDb", error.message);
    process.exit(1);
  }
};
