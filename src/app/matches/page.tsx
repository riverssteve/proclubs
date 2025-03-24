import React from "react";
import Link from "next/link";
import { MatchTrackerPage } from "@/components/pages/MatchTrackerPage";

export default function MatchTracker(): React.ReactNode {
  return (
    <main className="min-h-screen white">
      <div className="container mx-auto px-4 py-4">
        <Link
          href="/"
          className="text-blue-600 hover:text-blue-800 mb-4 inline-block"
        >
          ← Back to Team Summary
        </Link>
      </div>
      <MatchTrackerPage />
    </main>
  );
}
