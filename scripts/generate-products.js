require("dotenv").config();

const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

// ✅ Import your TS model
const Product = require("../src/models/ProductModel").default;

// ✅ MongoDB connect
async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ DB Connection Error:", err);
    process.exit(1);
  }
}

// ✅ ROOT FOLDER
const ROOT = path.join(
  process.cwd(),
  "public/image/topwear/shirts"
);

// ✅ CATEGORY CONFIG
const CATEGORY = "shirts";

// 🔥 Helper: get all images from folder
function getImages(folderPath) {
  const files = fs.readdirSync(folderPath);

  return files
    .filter((file) =>
      [".jpg", ".jpeg", ".png", ".webp"].includes(
        path.extname(file).toLowerCase()
      )
    )
    .map(
      (file) =>
        "/" +
        path
          .join("image/topwear/shirts", path.basename(path.dirname(folderPath)), path.basename(folderPath), file)
          .replace(/\\/g, "/")
    );
}

// 🔥 MAIN FUNCTION
async function generateProducts() {
  await connectDB();

  const sections = fs.readdirSync(ROOT);

  for (const section of sections) {
    const sectionPath = path.join(ROOT, section);

    if (!fs.lstatSync(sectionPath).isDirectory()) continue;

    // 👉 Detect subCategory
    let subCategory = "";
    if (section.toLowerCase().includes("long")) {
      subCategory = "long-sleeve";
    } else if (section.toLowerCase().includes("short")) {
      subCategory = "short-sleeve";
    }

    const skus = fs.readdirSync(sectionPath);

    for (const skuFolder of skus) {
      const skuPath = path.join(sectionPath, skuFolder);

      if (!fs.lstatSync(skuPath).isDirectory()) continue;

      const images = getImages(skuPath);

      if (images.length === 0) continue;

      const sku = skuFolder.trim();

      try {
        // ❗ Avoid duplicates
        const exists = await Product.findOne({ sku });

        if (exists) {
          console.log(`⚠️ Skipping (exists): ${sku}`);
          continue;
        }

        // ✅ Create product
        await Product.create({
          name: sku,
          sku,
          category: CATEGORY,
          subCategory,
          price: 0,
          stock: 0,
          images,
          approved: true,
        });

        console.log(`✅ Created: ${sku}`);
      } catch (err) {
        console.error(`❌ Error for ${sku}:`, err.message);
      }
    }
  }

  console.log("🎉 DONE");
  process.exit();
}

// 🚀 RUN
generateProducts();