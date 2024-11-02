import mongoose from "mongoose";

export const fileSchema = new mongoose.Schema({
  filename: String,
  contentType: String,
  uploadDate: Date,
  length: Number,
  chunkSize: Number,
  encoding: String,
  md5: String,
});

export const File = mongoose.model("File", fileSchema);
