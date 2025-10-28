import { createRouteHandler } from "uploadthing/next";
import { createUploadthing, type FileRouter } from "uploadthing/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";

const f = createUploadthing();

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) throw new Error("Unauthorized");
      return { userEmail: session.user.email };
    })
    .onUploadComplete(async ({ file, metadata }) => {
      console.log("✅ Upload complete:", {
        url: file.url,
        uploadedBy: metadata.userEmail,
      });
      return { uploadedBy: metadata.userEmail, fileUrl: file.url };
    }),
} satisfies FileRouter;

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});
