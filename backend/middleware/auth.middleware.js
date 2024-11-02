import { User } from "../models/user.model.js";
import {
  deleteAuthorizationCookie,
  getAuthorizationToken,
  isAuthorizationTokenValid,
} from "../utils/cookies.js";

export const requireLogin = async (req, res, next) => {
  //res.setHeader("access-control-allow-origin", "https://cep.robertplawski.pl");

  try {
    const userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    if (!userId) {
      throw new Error("Token invalid, try relogging");
    }
    const user = await User.findOne({ _id: userId });

    if (!user) {
      deleteAuthorizationCookie(res);
      throw new Error("Weird, user doesn't exist");
    }

    next();
  } catch (error) {
    res.status(301).json({ success: false, message: "Unauthorized" });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    if (!userId) {
      throw new Error("Token invalid, try relogging");
    }
    const user = await User.findOne({ _id: userId });

    if (!user) {
      deleteAuthorizationCookie(res);
      throw new Error("Weird, user doesn't exist");
    }

    next();
  } catch {
    res.status(301).json({ success: false, message: "Unauthorized" });
  }
};
