import React from "react";
import PlayerStatsDashboard from "@/components/PlayerStatsDashboard";
import Link from "next/link";

export default function PlayersPage(): React.ReactNode {
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
      <PlayerStatsDashboard />
    </main>
  );
}
