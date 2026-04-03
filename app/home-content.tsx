import { AudiobookDashboard } from "@/components/audiobook-dashboard";
import { listAudiobooksAction } from "@/app/actions/audiobooks";

export async function HomeContent() {
  const booksResult = await listAudiobooksAction({});
  const books = booksResult?.data ?? [];
  // Prihlásený používateľ cez Entra: AuthProvider volá /api/auth/me z prehliadača (cookie na API hoste).
  return <AudiobookDashboard initialBooks={books} />;
}
