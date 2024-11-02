import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
      maxLength: 6,
      minLength: 6,
    },
    usedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    expiresAt: Date,
  },
  { timestamps: true }
);

export const Invite = mongoose.model("Invite", inviteSchema);
