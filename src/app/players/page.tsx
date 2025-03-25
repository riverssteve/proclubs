import React from "react";
import PlayerStatsDashboard from "@/components/pages/PlayerStatsDashboard";
import Link from "next/link";
import { Button } from "@/components/ui/button"


export default function PlayersPage(): React.ReactNode {
  return (
    <main className="min-h-screen white">
      <div className="container mx-auto px-4 py-4">
        <Button variant="outline">
          <Link href="/">← Back to Team Summary</Link>
        </Button>
      </div>
      <PlayerStatsDashboard />
    </main>
  );
}
