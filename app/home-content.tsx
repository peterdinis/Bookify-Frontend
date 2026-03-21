import { headers } from "next/headers";
import { AudiobookDashboard } from "@/components/audiobook-dashboard";
import { getAudiobooks } from "@/lib/audiobook-store";

export async function HomeContent() {
  await headers();
  const books = getAudiobooks();
  return <AudiobookDashboard initialBooks={books} />;
}
