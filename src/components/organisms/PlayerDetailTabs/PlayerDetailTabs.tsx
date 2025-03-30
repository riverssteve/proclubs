import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlayerProfileCard,  PlayerProfile } from '@/components/molecules/PlayerProfileCard';
import { PlayerStatsCard, PlayerDetailedStats } from '@/components/molecules/PlayerStatsCard';

interface PlayerDetailTabsProps {
  player: PlayerProfile & PlayerDetailedStats;
  isPer90: boolean;
  setIsPer90: (value: boolean) => void;
}

export const PlayerDetailTabs: React.FC<PlayerDetailTabsProps> = ({
  player,
  isPer90,
  setIsPer90
}) => {
  return (
    <Tabs defaultValue="profile" className="w-full">
      <div className="flex justify-center">
        <TabsList className="grid grid-cols-3 mb-6 md:w-150 centre">
          <TabsTrigger value="profile">Player Profile</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>
      </div>

      <TabsContent value="profile" className="space-y-4">
        <PlayerProfileCard player={player} isPer90={isPer90} />
      </TabsContent>

      <TabsContent value="stats" className="space-y-4">
        <PlayerStatsCard 
          player={player} 
          isPer90={isPer90} 
          setIsPer90={setIsPer90} 
        />
      </TabsContent>

      <TabsContent value="history" className="space-y-4">
        <span>Hi</span>
      </TabsContent>
    </Tabs>
  );
};
