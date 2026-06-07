const DEFAULT_ADMIN_EMAIL = "Thegarmentguy291@gmail.com";
const DEFAULT_ADMIN_NAME = "The Garment Guy Admin";
let mongooseClient;

async function loadLocalEnv() {
  try {
    const dotenv = await import("dotenv");
    dotenv.config({ path: ".env.local", quiet: true });
    dotenv.config({ path: ".env", quiet: true });
  } catch {
    // dotenv is optional for hosted one-time runs where env vars are injected.
  }
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function main() {
  await loadLocalEnv();

  const bcrypt = (await import("bcryptjs")).default;
  const mongoose = (await import("mongoose")).default;
  mongooseClient = mongoose;

  const mongoUri = process.env.MONGODB_URI;
  const email = String(process.env.ADMIN_EMAIL || DEFAULT_ADMIN_EMAIL)
    .trim()
    .toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is required");
  }

  if (!email) {
    throw new Error("ADMIN_EMAIL is required");
  }

  await mongoose.connect(mongoUri, { dbName: "TheGarmentGuyDB" });

  const userSchema = new mongoose.Schema(
    {
      name: { type: String, required: true },
      email: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      role: { type: String, default: "buyer" },
      status: { type: String, default: "pending" },
      phone: String,
      shopName: String,
      businessName: String,
      businessType: String,
      accountType: String,
      location: String,
    },
    { timestamps: true }
  );

  const User = mongoose.models.User || mongoose.model("User", userSchema);
  const existingUser = await User.findOne({
    email: {
      $regex: `^${escapeRegExp(email)}$`,
      $options: "i",
    },
  });

  const update = {
    name: existingUser?.name || DEFAULT_ADMIN_NAME,
    email,
    role: "admin",
    status: "approved",
  };

  if (password) {
    update.password = await bcrypt.hash(password, 10);
  } else if (!existingUser) {
    throw new Error("ADMIN_PASSWORD is required when creating an admin user");
  }

  if (existingUser) {
    await User.updateOne({ _id: existingUser._id }, { $set: update });
  } else {
    await User.create(update);
  }

  console.log("Admin user created/updated");
}

main()
  .catch((error) => {
    console.error(error.message || "Failed to create admin user");
    process.exitCode = 1;
  })
  .finally(async () => {
    if (mongooseClient) {
      await mongooseClient.disconnect();
    }
  });
