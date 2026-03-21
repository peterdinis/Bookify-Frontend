export type Audiobook = {
  id: string;
  title: string;
  author: string;
  description: string;
  durationMinutes: number;
  narrator: string | null;
  coverImageUrl: string;
  audioUrl: string;
  uploadedAt: string;
  originalFileName: string | null;
  sizeBytes: number | null;
  /** True while waiting for server action (optimistic row). */
  isPending?: boolean;
};
