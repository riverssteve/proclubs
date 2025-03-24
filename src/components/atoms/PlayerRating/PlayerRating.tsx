import React from 'react';

interface PlayerRatingProps {
  rating: string;
  maxRating?: string;
}

export const PlayerRating: React.FC<PlayerRatingProps> = ({ rating, maxRating = "10" }) => {
  const ratingValue = parseFloat(rating);
  let colorClass = "text-gray-600";
  
  if (ratingValue >= 8.5) {
    colorClass = "text-green-600 font-bold";
  } else if (ratingValue >= 7.5) {
    colorClass = "text-blue-600 font-bold";
  } else if (ratingValue >= 6) {
    colorClass = "text-amber-600";
  } else {
    colorClass = "text-red-600";
  }
  
  return (
    <span className={`${colorClass}`}>
      {rating}/{maxRating}
    </span>
  );
};
