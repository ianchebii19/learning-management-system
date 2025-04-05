import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";

const handleAuth = async () => {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  return { userId };
};

const f = createUploadthing();

export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: "4MB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async () => {
      // Handle post-upload actions here
    }),

  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
    .middleware(() => handleAuth())
    .onUploadComplete(async () => {
      // Handle post-upload actions here
    }),

  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "128GB" } })
    .middleware(() => handleAuth())
    .onUploadComplete(async () => {
      // Handle post-upload actions here
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
