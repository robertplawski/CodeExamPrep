import mongoose from "mongoose";
import { Solution } from "./solution.model.js";
//const { GridFsFile } = require("multer-gridfs-storage");
export const taskSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
    },
    language: {
      type: String,
      required: true,
    },
    solutions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Solution",
      },
    ],
    allowedSolutionFilenames: {
      type: [String],
      required: true,
      default: ["index.html"],
    },
    files: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "GridFsFile",
      },
    ],
  },
  { timestamps: true }
);

export const Task = mongoose.model("Task", taskSchema);
