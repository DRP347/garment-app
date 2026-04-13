import mongoose, { Schema, model, models } from "mongoose";

const UserSettingsSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    whatsappNotifications: { type: Boolean, default: true },
    emailNotifications: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const UserSettings =
  models.UserSettings || model("UserSettings", UserSettingsSchema);

export default UserSettings;
