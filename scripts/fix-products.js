require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGODB_URI;

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to DB");

  const products = await mongoose.connection.db
    .collection("products")
    .find({})
    .toArray();

  for (const p of products) {
    let description = [];
    let meta = {};

    // ========================
    // SHIRTS
    // ========================
    if (p.category === "shirts") {
      const isShort = p.name.toLowerCase().includes("ss");

      description = [
        isShort ? "Short Sleeve Shirt" : "Long Sleeve Shirt",
        "Fabric: Cotton Blend",
        "MOQ: 50 pcs",
        "Premium Export Quality",
      ];

      meta = {
        sleeve: isShort ? "short" : "long",
        fabric: "cotton blend",
        moq: 50,
      };
    }

    // ========================
    // DENIM
    // ========================
    else if (p.category === "denim") {
      description = [
        "Premium Denim Jeans",
        "Fabric: 100% Cotton",
        "MOQ: 30 pcs",
        "Heavy GSM Fabric",
      ];

      meta = {
        fabric: "denim",
        moq: 30,
      };
    }

    // ========================
    // CARGO
    // ========================
    else if (p.category === "cargo") {
      description = [
        "Cargo Pants",
        "Multi Pocket Design",
        "MOQ: 30 pcs",
        "Durable Fabric",
      ];

      meta = {
        fabric: "cotton blend",
        moq: 30,
      };
    }

    await mongoose.connection.db.collection("products").updateOne(
      { _id: p._id },
      {
        $set: {
          description,
          meta,
        },
      }
    );
  }

  console.log("🔥 All products fixed successfully");
  process.exit();
}

run();