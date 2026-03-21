import { createMockAudiobook, seedMockAudiobooks } from "@/lib/mock-audiobooks";
import type { Audiobook } from "@/lib/types";

const globalForStore = globalThis as typeof globalThis & {
  __bookifyAudiobooks?: Audiobook[];
};

function initialBooks(): Audiobook[] {
  return seedMockAudiobooks(8);
}

export function getAudiobooks(): Audiobook[] {
  if (!globalForStore.__bookifyAudiobooks) {
    globalForStore.__bookifyAudiobooks = initialBooks();
  }
  return globalForStore.__bookifyAudiobooks;
}

export function addAudiobookFromUpload(input: {
  title: string;
  author: string;
  originalFileName: string;
  sizeBytes: number;
  mimeType: string;
}): Audiobook {
  const list = getAudiobooks();
  const book = createMockAudiobook({
    title: input.title,
    author: input.author,
    originalFileName: input.originalFileName,
    sizeBytes: input.sizeBytes,
    description: `Uploaded file (${input.mimeType}). Mock metadata generated for development.`,
  });
  list.unshift(book);
  return book;
}
