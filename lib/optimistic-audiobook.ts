import type { Audiobook } from "@/lib/types";

const DEMO_AUDIO =
  "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

export function createOptimisticAudiobook(input: {
  title: string;
  author: string;
  originalFileName: string;
  sizeBytes: number;
}): Audiobook {
  const id = `optimistic-${crypto.randomUUID()}`;
  return {
    id,
    title: input.title,
    author: input.author,
    description: `Uploading “${input.originalFileName}”…`,
    durationMinutes: 0,
    narrator: null,
    coverImageUrl:
      "https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=400&h=400&fit=crop",
    audioUrl: DEMO_AUDIO,
    uploadedAt: new Date().toISOString(),
    originalFileName: input.originalFileName,
    sizeBytes: input.sizeBytes,
    isPending: true,
  };
}
