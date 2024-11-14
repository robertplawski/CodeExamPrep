import { Task } from "../models/task.model.js";
import { Solution } from "../models/solution.model.js";
import {
  getAuthorizationToken,
  isAuthorizationTokenValid,
} from "../utils/cookies.js";
import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import { upload } from "../db/connectDB.js";
export const createSolution = async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required!" });
    }

    let userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    let userSolution = await Solution.findOne({ author: userId, task: taskId })
      ._doc;
    if (userSolution) {
      return res.status(400).json({
        success: false,
        message: "Solution already exists!",
      });
    }
    const solution = new Solution({
      task: new mongoose.Types.ObjectId(taskId),
      author: new mongoose.Types.ObjectId(userId),
    });
    const task = await Task.findOne({ _id: taskId }).populate("solutions");
    await solution.save();
    task.solutions.push(solution._id);
    await task.save();
    return res.status(200).json({ success: true, solution: solution });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const previewSolution = async (req, res) => {};
export const scoreSolution = async (req, res) => {};
var gfs = null;
export const createNewSolutionFile = async (req, res) => {
  try {
    const { taskId, filename } = req.body;
    if (!gfs) {
      gfs = new GridFSBucket(mongoose.connection.db, { bucketName: "uploads" });
    }
    if (!taskId || !filename) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    let userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    let userSolution = await Solution.findOne({ author: userId, task: taskId });

    if (!userSolution) {
      return res.status(400).json({
        success: false,
        message: "Solution doesn't exist!",
      });
    }

    const task = await Task.findOne({ _id: taskId });
    if (!task.allowedSolutionFilenames.includes(filename)) {
      return res
        .status(400)
        .json({ success: false, message: "Filename not allowed" });
    }

    const solution = await Solution.findOne({
      task: new mongoose.Types.ObjectId(taskId),
      author: new mongoose.Types.ObjectId(userId),
    });
    /*const Uploads = await mongoose.connection.collection("uploads.files");

    const file = await Uploads.findOne({
      filename: filename,
      metadata: { taskId: taskId },
    });
    if (file) {
      return res
        .status(400)
        .json({ success: false, message: "File already exists!" });
    }*/
    /*console.log(solution);
    if (solution.files.map((val) => val.metadata.filename).includes(filename)) {
      return res
        .status(400)
        .json({ success: false, message: "File already exists!" });
    }*/

    //upload.single({'name'})
    const stream = gfs.openUploadStream(filename, {
      metadata: {
        filename: filename,
        taskId: taskId,
      },

      contentType: "text/plain",
    });
    stream.write(Number(Math.random()).toString(36).slice(2, 10).toUpperCase());
    stream.end();
    solution.files.push(new mongoose.Types.ObjectId(stream.id));
    await solution.save();
    //await stream.save();

    return res.status(200).json({ success: true, solution: solution });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getSolution = async (req, res) => {
  try {
    const { taskId } = req.body;
    if (!taskId) {
      return res
        .status(401)
        .json({ success: false, message: "All fields are required!" });
    }

    let userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    let userSolution = await Solution.findOne({
      author: new mongoose.Types.ObjectId(userId),
      task: new mongoose.Types.ObjectId(taskId),
    });
    if (!userSolution) {
      return res.status(404).json({
        success: false,
        message: "No solution found, try creating one!",
      });
    }

    return res.status(200).json({ success: true, solution: userSolution });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
