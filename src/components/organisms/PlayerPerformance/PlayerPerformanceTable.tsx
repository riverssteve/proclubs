import React from 'react';
import { PlayerRating } from '@/components/atoms/PlayerRating/PlayerRating';
import { MatchPlayer } from '@/types/match';

interface PlayerPerformanceTableProps {
  players: MatchPlayer[];
}

interface PositionStyle {
  color: string;
  icon: string;
}

export const PlayerPerformanceTable: React.FC<PlayerPerformanceTableProps> = ({ players }) => {
  // Get position icon/color
  const getPositionStyle = (position: string): PositionStyle => {
    const styles: Record<string, PositionStyle> = {
      forward: { color: "text-red-600", icon: "⚔️" },
      midfielder: { color: "text-green-600", icon: "🔄" },
      defender: { color: "text-blue-600", icon: "🛡️" },
      goalkeeper: { color: "text-yellow-600", icon: "🧤" }
    };

    return styles[position] || { color: "text-gray-600", icon: "👤" };
  };

  const calculatePercentage = (made: string | undefined, attempts: string | undefined): string => {
    if (!made || !attempts || parseInt(attempts) === 0) return "N/A";
    return ((parseInt(made) / parseInt(attempts)) * 100).toFixed(1);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="py-3 px-4 text-left">Player</th>
            <th className="py-3 px-4 text-center">Position</th>
            <th className="py-3 px-4 text-center">Rating</th>
            <th className="py-3 px-4 text-center">Goals</th>
            <th className="py-3 px-4 text-center">Assists</th>
            <th className="py-3 px-4 text-center">Pass %</th>
            <th className="py-3 px-4 text-center">Tackle %</th>
            <th className="py-3 px-4 text-center">Shots</th>
          </tr>
        </thead>
        <tbody>
          {players.map((player, index) => {
            const posStyle = getPositionStyle(player.pos);
            const passSuccess = calculatePercentage(player.passesmade, player.passattempts);
            const tackleSuccess = calculatePercentage(player.tacklesmade, player.tackleattempts);

            return (
              <tr key={index} className={index % 2 === 0 ? "bg-gray-50 dark:bg-gray-900" : ""}>
                <td className="py-3 px-4 font-medium">
                  {player.mom === "1" && "⭐ "}
                  {player.playername}
                </td>
                <td className={`py-3 px-4 text-center ${posStyle.color}`}>
                  {posStyle.icon} {player.pos.charAt(0).toUpperCase() + player.pos.slice(1)}
                </td>
                <td className="py-3 px-4 text-center">
                  <PlayerRating rating={player.rating} />
                </td>
                <td className="py-3 px-4 text-center">{player.goals || "0"}</td>
                <td className="py-3 px-4 text-center">{player.assists || "0"}</td>
                <td className="py-3 px-4 text-center">{passSuccess}%</td>
                <td className="py-3 px-4 text-center">{tackleSuccess}%</td>
                <td className="py-3 px-4 text-center">{player.shots || "0"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
