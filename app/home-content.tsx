import { AudiobookDashboard } from "@/components/audiobook-dashboard";
import { listAudiobooksAction } from "@/app/actions/audiobooks";
import { getCurrentUserAction } from "@/app/actions/authActions";

export async function HomeContent() {
  const [booksResult, userResult] = await Promise.all([
    listAudiobooksAction({}),
    getCurrentUserAction({}),
  ]);

  const books = booksResult?.data ?? [];
  const user = userResult?.data?.success ? userResult.data.user : null;

  return <AudiobookDashboard initialBooks={books} user={user} />;
}
