import { createUploadthing, type FileRouter } from "uploadthing/next";

const f = createUploadthing();

// // This is your FileRouter. It defines what files can be uploaded.
export const ourFileRouter = {
  // // This is our specific uploader for business documents
  businessDocumentUploader: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
    pdf: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    // // This middleware runs on your server before the upload begins.
    // // For a public registration form, we don't need to check for a user session.
    .middleware(async ({ req }) => {
      // // Whatever you return here is available in the onUploadComplete callback
      return { uploaderId: "public-registration" };
    })
    // // This code runs on your server after the upload is complete.
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for:", metadata.uploaderId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.uploaderId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;