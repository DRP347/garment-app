import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connectDB from "@/lib/db";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import UserModel from "@/models/UserModel";
import UserSettings from "@/models/UserSettings";

type SettingsPayload = {
  name?: unknown;
  phone?: unknown;
  location?: unknown;
  address?: unknown;
  emailNotifications?: unknown;
  notifications?: unknown;
  darkMode?: unknown;
};

type UserRecord = {
  _id: unknown;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  role?: string;
};

type SettingsRecord = {
  emailNotifications?: boolean;
  darkMode?: boolean;
};

function jsonError(error: string, status: number) {
  return NextResponse.json({ error }, { status });
}

function cleanString(value: unknown) {
  return String(value || "").trim();
}

function optionalBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

async function getLoggedInUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { response: jsonError("Unauthorized", 401) };
  }

  await connectDB();

  const user = (await UserModel.findOne({ email: session.user.email })
    .select("_id name email phone location role")
    .lean()
    .exec()) as UserRecord | null;

  if (!user) {
    return { response: jsonError("User not found", 404) };
  }

  return { user };
}

async function readJson(req: Request): Promise<SettingsPayload | null> {
  try {
    const body = await req.json();
    if (!body || typeof body !== "object" || Array.isArray(body)) return null;
    return body as SettingsPayload;
  } catch {
    return null;
  }
}

function serializeSettings(user: UserRecord, settings?: SettingsRecord | null) {
  return {
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    location: user.location || "",
    address: user.location || "",
    role: user.role || "buyer",
    emailNotifications: settings?.emailNotifications ?? true,
    notifications: settings?.emailNotifications ?? true,
    darkMode: settings?.darkMode ?? false,
  };
}

export async function GET() {
  try {
    const result = await getLoggedInUser();
    if ("response" in result) return result.response;

    const settings = (await UserSettings.findOne({ userId: result.user._id })
      .lean()
      .exec()) as SettingsRecord | null;

    return NextResponse.json(serializeSettings(result.user, settings));
  } catch (error) {
    console.error("USER_SETTINGS_GET_ERROR:", error);
    return jsonError("Failed to load settings", 500);
  }
}

export async function PATCH(req: Request) {
  try {
    const result = await getLoggedInUser();
    if ("response" in result) return result.response;

    const body = await readJson(req);
    if (!body) return jsonError("Invalid JSON payload", 400);

    const userUpdates: Record<string, string> = {};
    const settingsUpdates: Record<string, boolean> = {};

    if (body.name !== undefined) {
      const name = cleanString(body.name);
      if (!name) return jsonError("Name is required", 400);
      userUpdates.name = name;
    }

    if (body.phone !== undefined) {
      userUpdates.phone = cleanString(body.phone);
    }

    if (body.location !== undefined || body.address !== undefined) {
      userUpdates.location = cleanString(body.location ?? body.address);
    }

    const emailNotifications = optionalBoolean(
      body.emailNotifications ?? body.notifications
    );
    if (emailNotifications !== undefined) {
      settingsUpdates.emailNotifications = emailNotifications;
    }

    const darkMode = optionalBoolean(body.darkMode);
    if (darkMode !== undefined) {
      settingsUpdates.darkMode = darkMode;
    }

    if (Object.keys(userUpdates).length) {
      await UserModel.updateOne({ _id: result.user._id }, { $set: userUpdates });
    }

    if (Object.keys(settingsUpdates).length) {
      await UserSettings.findOneAndUpdate(
        { userId: result.user._id },
        { $set: settingsUpdates },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
        .lean()
        .exec();
    }

    const [user, settings] = await Promise.all([
      UserModel.findById(result.user._id)
        .select("_id name email phone location role")
        .lean()
        .exec() as Promise<UserRecord | null>,
      UserSettings.findOne({ userId: result.user._id }).lean().exec() as Promise<SettingsRecord | null>,
    ]);

    if (!user) return jsonError("User not found", 404);

    return NextResponse.json({
      message: "Settings updated successfully",
      settings: serializeSettings(user, settings),
    });
  } catch (error) {
    console.error("USER_SETTINGS_PATCH_ERROR:", error);
    return jsonError("Failed to update settings", 500);
  }
}

export const PUT = PATCH;

