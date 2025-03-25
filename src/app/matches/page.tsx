import React from "react";
import Link from "next/link";
import { MatchTrackerPage } from "@/components/pages/MatchTrackerPage";
import { Button } from "@/components/ui/button"


export default function MatchTracker(): React.ReactNode {
  return (
    <main className="min-h-screen white">
      <div className="container mx-auto px-4 py-4">
        <Button variant="outline">
          <Link href="/">← Back to Team Summary</Link>
        </Button>
      </div>
      <MatchTrackerPage />
    </main>
  );
}
