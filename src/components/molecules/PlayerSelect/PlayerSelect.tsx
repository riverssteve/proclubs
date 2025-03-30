import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface PlayerData {
  name: string;
  proName?: string;
  favoritePosition: string;
}

interface PlayerSelectProps {
  players: PlayerData[];
  selectedPlayer: string | undefined;
  onPlayerChange: (value: string) => void;
  className?: string;
}

export const PlayerSelect: React.FC<PlayerSelectProps> = ({
  players,
  selectedPlayer,
  onPlayerChange,
  className = "",
}) => {
  return (
    <div className={className}>
      <label className="block mb-2 font-medium">Select Player:</label>
      <Select value={selectedPlayer} onValueChange={onPlayerChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select a player" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Players</SelectLabel>
            {players.map((player) => (
              <SelectItem key={player.name} value={player.name}>
                {player.name} ({player.proName || "Unknown"}) -{" "}
                {player.favoritePosition}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
