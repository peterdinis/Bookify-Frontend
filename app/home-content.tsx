import { AudiobookDashboard } from "@/components/audiobook-dashboard";
import { getAudiobooks } from "@/lib/audiobook-store";
import { headers } from "next/headers";

export async function HomeContent() {
  await headers();
  const books = getAudiobooks();
  return <AudiobookDashboard initialBooks={books} />;
}
