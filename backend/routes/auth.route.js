import express from "express";
import {
  registerWithInviteToken,
  login,
  logout,
  isInviteTokenValid,
  createInviteToken,
  verifyEmail,
  removeInvite,
  getInvites,
  me,
} from "../controllers/auth.controller.js";
import { requireAdmin, requireLogin } from "../middleware/auth.middleware.js";
const router = express.Router();

router.get("/verifyEmail", verifyEmail);
router.post("/registerWithInviteToken", registerWithInviteToken);
router.post("/login", login);
router.post("/isInviteTokenValid", isInviteTokenValid);

router.use(requireLogin);
router.post("/logout", logout);
router.post("/me", me);

router.use(requireAdmin);

router.post("/createInviteToken", createInviteToken);
router.get("/getInvites", getInvites);
router.delete("/removeInvite", removeInvite);

export default router;
