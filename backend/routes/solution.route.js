import express from "express";
import { requireAdmin, requireLogin } from "../middleware/auth.middleware.js";
import {
  getSolution,
  createSolution,
  createNewSolutionFile,
} from "../controllers/solution.controller.js";
const router = express.Router();

router.use(requireLogin);
router.post("/", getSolution);
router.post("/create", createSolution);
router.post("/createNewFile", createNewSolutionFile);

export default router;
