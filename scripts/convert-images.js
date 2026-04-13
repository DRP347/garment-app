const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const inputDir = "public/image/topwear/shirts";

async function processFolder(folderPath) {
  const files = fs.readdirSync(folderPath);

  for (const file of files) {
    const filePath = path.join(folderPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      await processFolder(filePath); // 🔁 recursive
    } else if (/\.(jpg|jpeg|JPG|JPEG)$/.test(file)) {
      const output = filePath.replace(/\.(jpg|jpeg|JPG|JPEG)$/, ".webp");

      try {
        await sharp(filePath)
          .webp({ quality: 75 })
          .toFile(output);

        console.log("✅ Converted:", output);
      } catch (err) {
        console.error("❌ Error:", filePath, err.message);
      }
    }
  }
}

processFolder(inputDir).then(() => {
  console.log("🔥 DONE converting all images");
});