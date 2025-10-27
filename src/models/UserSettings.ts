import mongoose, { Schema, models, model } from "mongoose";

export interface IUserSettings {
  userId: string;               // from auth provider (NextAuth)
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  notifications?: boolean;
  darkMode?: boolean;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: String, index: true, unique: true, required: true },
    name: String,
    email: String,
    phone: String,
    address: String,
    notifications: { type: Boolean, default: true },
    darkMode: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default models.UserSettings ||
  model<IUserSettings>("UserSettings", UserSettingsSchema);
