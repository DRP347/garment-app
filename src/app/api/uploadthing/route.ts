import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";
import dbConnect from "@/lib/db";
import Product from "@/models/ProductModel";

// Initialize UploadThing securely using env variables
const uploadthing = createUploadthing({
  apiKey: process.env.UPLOADTHING_SECRET!,
  appId: process.env.UPLOADTHING_APP_ID!,
});

const f = uploadthing.fileRouter();

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 6 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session?.user) throw new UploadThingError("Unauthorized");
      return { userId: session.user.id };
    })
    .onUploadComplete(
      async ({ file, metadata }: { file: any; metadata: any }) => {
        await dbConnect();

        try {
          // Example: store the uploaded image URL to a product
          const product = await Product.findOneAndUpdate(
            { uploadedBy: metadata.userId },
            { $push: { images: file.url } },
            { new: true, upsert: true }
          );

          console.log("✅ Uploaded image saved:", product?._id);
        } catch (err) {
          console.error("❌ Failed to save uploaded image:", err);
        }

        return { uploadedBy: metadata.userId, fileUrl: file.url };
      }
    ),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
