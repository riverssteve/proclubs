import React from "react";

interface TimeStampProps {
  timestamp: number;
}

export const TimeStamp: React.FC<TimeStampProps> = ({ timestamp }) => {
  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return <span className="text-sm text-gray-600">{formatDate(timestamp)}</span>;
};
