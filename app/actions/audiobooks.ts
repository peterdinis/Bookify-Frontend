"use server";

import { z } from "zod";
import { cookies } from "next/headers";
import { actionClient } from "@/lib/safe-action";

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
    const apiBase = process.env.API_URL || "http://localhost:5041";
    const url = `${apiBase}/api/audiobooks`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const res = await fetch(url, {
        headers: {
          cookie: cookieHeader,
        },
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error(`Backend error (${res.status}): ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("[Action] listAudiobooksAction failed:", error);
      throw error;
    }
  });

export const uploadAudiobookAction = actionClient
  .inputSchema(uploadSchema)
  .action(async ({ parsedInput }) => {
    const apiBase = process.env.API_URL || "http://localhost:5041";
    const url = `${apiBase}/api/audiobooks`;

    const cookieStore = await cookies();
    const cookieHeader = cookieStore.toString();

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          cookie: cookieHeader,
        },
        body: JSON.stringify(parsedInput),
      });

      if (!res.ok) {
        throw new Error(`Backend error (${res.status}): ${res.statusText}`);
      }

      return await res.json();
    } catch (error) {
      console.error("[Action] uploadAudiobookAction failed:", error);
      throw error;
    }
  });
