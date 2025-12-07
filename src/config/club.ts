/**
 * Club configuration
 * Central location for club-specific constants
 */

export const CLUB_CONFIG = {
  id: 219778,
  name: "BigfootBallclub",
  platform: "common-gen5", // PlayStation 5/Xbox Series X
} as const;

// Convenience export for backward compatibility
export const CLUB_ID = CLUB_CONFIG.id;
