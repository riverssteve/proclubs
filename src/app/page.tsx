import React from 'react';
import PlayerStatsDashboard from '../components/PlayerStatsDashboard';

export default function Home(): React.ReactNode {
  return (
    <main className="min-h-screen white">
      <PlayerStatsDashboard />
    </main>
  );
}
