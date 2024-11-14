import { Invite } from "../models/invite.model.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";
import {
  generateAndSetAuthorizationCookie,
  getAuthorizationToken,
  isAuthorizationTokenValid,
  deleteAuthorizationCookie,
} from "../utils/cookies.js";
import mongoose from "mongoose";
import { sendVerificationEmail } from "../resend/emails.js";

export const logout = async (req, res) => {
  try {
    deleteAuthorizationCookie(res);
    res.status(200).json({ success: true, message: "Succesfully logged out" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const me = async (req, res) => {
  try {
    const userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    if (!userId) {
      throw new Error("Token invalid, try relogging");
    }
    const user = await User.findOne({ _id: userId });
    if (!user) {
      deleteAuthorizationCookie(res);
      throw new Error("Weird, this account doesn't exist anymore.");
    }
    res
      .status(200)
      .json({ success: true, user: { ...user._doc, password: undefined } });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    /*if (getAuthorizationToken(req)) {
      if (isAuthorizationTokenValid(getAuthorizationToken(req))) {
        return res
          .status(400)
          .json({ success: false, message: "Already logged in " });
      }
    }*/
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required " });
    }
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password, unauthorized" });
    }
    user.lastLoginAt = Date.now();
    await user.save();
    generateAndSetAuthorizationCookie(res, user._id);
    return res.status(200).json({
      success: true,
      message: "Logged in successfully",
      user: { ...user._doc, password: undefined },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const registerWithInviteToken = async (req, res) => {
  const { inviteToken, email, password, name } = req.body;
  try {
    if (!inviteToken || !email || !password || !name) {
      throw new Error("All fields are required");
    }
    //if (!(await Invite.countDocuments({})) == 0) {
    const inviteValid = await Invite.findOne({
      token: inviteToken,
      expiresAt: { $gt: Date.now() },
      usedBy: null,
    });
    if (!inviteValid) {
      throw new Error("Invite is invalid");
    }   let userSolution = await Solution.findOne({ author: userId, task: taskId })
    ._doc;
  if (!userSolution) {
    return res.status(400).json({
      success: false,
      message: "No solution found! Try creating one",
    });
  }
    //}
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      throw new Error("User already exists");
    }

    const verificationToken = Number(Math.random())
      .toString(36)
      .slice(2, 10)
      .toUpperCase();
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      email,
      password: hashedPassword,
      name,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // +24h
    });
    inviteValid.usedBy = user;
    await inviteValid.save();
    await user.save();

    generateAndSetAuthorizationCookie(res, user._id);

    sendVerificationEmail(name, email, verificationToken);

    res.status(201).json({
      success: true,
      message:
        "User succesfully registered, check your mailbox for confirmation email!",
      user: {
        ...user._doc,
        password: undefined,
        verificationToken: undefined,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const removeInvite = async (req, res) => {
  const { token } = req.body;
  try {
    const inviteValid = await Invite.findOne({
      token,
    });

    console.log(inviteValid);
    if (!inviteValid) {
      throw new Error("Invite is invalid");
    }

    if (inviteValid.usedBy) {
      throw new Error("Token is being used by an user");
    }
    const result = await Invite.deleteOne({ token });
    res.status(200).json({
      success: true,
      result: result,
      message: "Succesfully removed invite",
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
export const isInviteTokenValid = async (req, res) => {
  const { token } = req.body;
  try {
    const inviteValid = await Invite.findOne({
      token,
      expiresAt: { $gt: Date.now() },
      usedBy: null,
    });
    if (!inviteValid) {
      throw new Error("Invite is invalid");
    }
    res.status(200).json({ success: true, message: "Invite is valid" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getInvites = async (req, res) => {
  const findInvites = await Invite.find().populate("usedBy");
  if (!findInvites) {
    return res
      .status(404)
      .json({ success: false, message: "No invite codes", invites: [] });
  }
  res
    .status(200)
    .json({ success: true, message: "Got invites", invites: findInvites });
};
// 100000000000000 for ever token
export const createInviteToken = async (req, res) => {
  const { token, expiresAt } = req.body;
  try {
    // IF THERE IS NOT ACCESS CODE THEN DON'T REQUIRE GROUP

    if (!getAuthorizationToken(req)) {
      throw new Error("Not logged in");
    }
    const userId = isAuthorizationTokenValid(getAuthorizationToken(req));
    if (!userId) {
      throw new Error("Token invalid, try relogging");
    }
    const user = await User.findOne({ _id: userId });

    if (!user) {
      deleteAuthorizationCookie(res);
      throw new Error("Weird, user doesn't exist");
    }
    if (!user.groups.includes("admin")) {
      throw new Error("User is not in the admin group!");
    }

    if (!token || !expiresAt) {
      throw new Error("All fields are required");
    }
    const inviteAlreadyExists = await Invite.findOne({ token });
    if (inviteAlreadyExists) {
      throw new Error("Invite already exists");
    }

    const invite = new Invite({ token, expiresAt });
    await invite.save();
    res
      .status(200)
      .json({ success: true, message: "Successfully created invite token!" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const verifyEmail = async (req, res) => {
  const { token } = req.query;
  try {
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      throw new Error("Invalid or expired verification code");
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();
    res
      .status(200)
      .json({ success: true, message: "Succesfully verified email" });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};
