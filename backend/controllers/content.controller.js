import { Task } from "../models/task.model.js";
import { Solution } from "../models/solution.model.js";
import {
  getAuthorizationToken,
  isAuthorizationTokenValid,
} from "../utils/cookies.js";
import mongoose from "mongoose";

export const getTasks = async (req, res) => {
  let userSolution = undefined;
  if (isAuthorizationTokenValid(getAuthorizationToken(req))) {
    let userId = isAuthorizationTokenValid(getAuthorizationToken(req));

    userSolution = await Solution.findOne({
      author: new mongoose.Types.ObjectId(userId),
    });
  }

  let tasks = await Task.find().populate("solutions");

  tasks = tasks.map((task) => {
    const averageScore =
      task.solutions.reduce((total, next) => total + next.age, 0) /
        task.solutions.length || 0;

    return {
      ...task._doc,
      averageScore: averageScore || 0,
      yourScore: userSolution?.score,
    };
  });

  // res.setHeader("Cache-Control", `max-age=${60}`);
  res.status(200).json({
    success: true,
    message: "Got tasks",
    tasks: tasks,
  });
};
export const findTask = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      throw new Error("All fields are required");
    }
    const task = await Task.findOne({ name });
    if (!task) {
      throw new Error("Zadanie nieznalezione!");
    }
    return res.status(200).json({
      success: true,
      message: "Succesfully got task and solution",
      task,
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const getTaskFiles = async (req, res) => {
  const { name } = req.body;
  try {
    if (!name) {
      throw new Error("All fields are required");
    }
    const task = await Task.findOne({ name });
    if (!task) {
      throw new Error("Zadanie nieznalezione!");
    }
    const files = task.files;
    return res
      .status(200)
      .json({ success: true, message: "Succesfully got task", files });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { name, title, language } = req.body;

    if (!name || !title || !language || !req.files) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required!" });
    }

    const result = new Task({
      name,
      title,
      language,
      files: req.files.map((file) => file.id),
    });
    await result.save();
    res.status(200).json({
      success: true,
      result,
      message: "Successfully created new task",
    });
  } catch (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
