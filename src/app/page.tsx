import React from "react";
import TeamSummary from "@/components/pages/TeamSummary";

export default function Home(): React.ReactNode {
  return (
    <main className="min-h-screen bg-background">
      <TeamSummary />
    </main>
  );
}
