import { Suspense } from "react";
import { DashboardSuspenseFallback } from "@/components/dashboard-suspense-fallback";
import { RequireAuth } from "@/components/require-auth";
import { HomeContent } from "./home-content";

export default function Home() {
  return (
    <RequireAuth>
      <Suspense fallback={<DashboardSuspenseFallback />}>
        <HomeContent />
      </Suspense>
    </RequireAuth>
  );
}
