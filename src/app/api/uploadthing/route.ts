import { createNextRouteHandler } from "@uploadthing/next";
import { createUploadthing, type FileRouter, type UploadedFileData } from "@uploadthing/server";
import { getServerSession } from "next-auth";
import authOptions from "@/auth.config";

const f = createUploadthing();

interface UploadMetadata {
  userEmail: string;
}

export const ourFileRouter = {
  productImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 5 },
  })
    .middleware(async () => {
      const session = await getServerSession(authOptions);
      if (!session || !session.user?.email) throw new Error("Unauthorized");
      return { userEmail: session.user.email } as UploadMetadata;
    })
    .onUploadComplete(async ({
      file,
      metadata,
    }: {
      file: UploadedFileData;
      metadata: UploadMetadata;
    }) => {
      console.log("✅ Upload complete:", {
        url: file.url,
        uploadedBy: metadata.userEmail,
      });
      return { uploadedBy: metadata.userEmail, fileUrl: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
