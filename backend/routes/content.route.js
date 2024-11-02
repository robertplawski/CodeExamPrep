import express from "express";
import {
  getTasks,
  findTask,
  createTask,
  getTaskFiles,
} from "../controllers/content.controller.js";
import { requireAdmin, requireLogin } from "../middleware/auth.middleware.js";
import { upload, storage } from "../db/connectDB.js";
const router = express.Router();

router.get("/tasks", getTasks);
router.use(requireLogin);
router.post("/findTask", findTask);
router.post("/getTaskFiles", getTaskFiles);

router.use(requireAdmin);
router.post("/createTask", upload.array("files"), createTask);
export default router;
