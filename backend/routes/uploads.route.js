import {
  downloadUploads,
  findMetadata,
} from "../controllers/uploads.controller.js";
import { requireAdmin, requireLogin } from "../middleware/auth.middleware.js";
import express from "express";
const router = express.Router();
router.use(requireLogin);
router.get("/:id/download", downloadUploads);
router.get("/:id/metadata", findMetadata);
export default router;
