"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { actionClient } from "@/lib/safe-action";
import { addAudiobookFromUpload, getAudiobooks } from "@/lib/audiobook-store";

const uploadSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  author: z.string().trim().min(1, "Author is required").max(120),
  originalFileName: z.string().min(1).max(512),
  sizeBytes: z.number().int().positive().max(5_000_000_000),
  mimeType: z
    .string()
    .min(1)
    .refine(
      (m) =>
        m.startsWith("audio/") ||
        m === "application/octet-stream" ||
        m === "application/x-mpegurl",
      "Please upload an audio file.",
    ),
});

export const listAudiobooksAction = actionClient
  .inputSchema(z.object({}))
  .action(async () => {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    return getAudiobooks();
  });

export const uploadAudiobookAction = actionClient
  .inputSchema(uploadSchema)
  .action(async ({ parsedInput }) => {
    const session = await auth();
    if (!session?.user) throw new Error("Unauthorized");
    const book = addAudiobookFromUpload(parsedInput);
    return { id: book.id, title: book.title };
  });
