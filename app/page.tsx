import { Suspense } from "react";
import { DashboardSuspenseFallback } from "@/components/dashboard-suspense-fallback";
import { HomeContent } from "./home-content";

export default function Home() {
  return (
    <Suspense fallback={<DashboardSuspenseFallback />}>
      <HomeContent />
    </Suspense>
  );
}
