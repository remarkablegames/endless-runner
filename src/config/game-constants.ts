import type { DifficultyConfig } from '../types/difficulty-config';
import type { LaneIndex } from '../types/input';

/**
 * Track dimensions in world units.
 */
export const TRACK_WIDTH = 8;
export const TRACK_LENGTH = 160;

/**
 * Distance from the center lane to the outer lane centers.
 * Kept slightly inside the track edges so the player and obstacles stay on
 * the visible path instead of overhanging the sides.
 */
export const LANE_CENTER_OFFSET = 1.6;

/**
 * X-axis positions for the three lanes.
 * Evenly spaced for consistent lane switching.
 */
export const LANE_X_POSITIONS: Record<LaneIndex, number> = {
  0: -LANE_CENTER_OFFSET, // Left lane
  1: 0, // Center lane
  2: LANE_CENTER_OFFSET, // Right lane
};

/**
 * Base forward speed (world units per second).
 */
export const BASE_SPEED = 10;

/**
 * Maximum forward speed cap.
 */
export const MAX_SPEED = 25;

/**
 * Speed increase interval in seconds (per SC-008).
 */
export const SPEED_INCREASE_INTERVAL = 30;

/**
 * Speed amount added per interval.
 */
export const SPEED_INCREASE_AMOUNT = 2.5;

/**
 * Base obstacle spawn density (obstacles per second).
 */
export const BASE_DENSITY = 0.5;

/**
 * Maximum obstacle spawn density.
 */
export const MAX_DENSITY = 2.0;

/**
 * Duration to reach max density in seconds (per SC-009: 3 minutes).
 */
export const DENSITY_RAMP_DURATION = 180;

/**
 * Default difficulty configuration.
 */
export const DIFFICULTY_CONFIG: DifficultyConfig = {
  baseSpeed: BASE_SPEED,
  maxSpeed: MAX_SPEED,
  speedIncreaseInterval: SPEED_INCREASE_INTERVAL,
  speedIncreaseAmount: SPEED_INCREASE_AMOUNT,
  baseDensity: BASE_DENSITY,
  maxDensity: MAX_DENSITY,
  densityRampDuration: DENSITY_RAMP_DURATION,
};

/**
 * Lane transition duration in seconds.
 * Time to smoothly lerp between lanes.
 */
export const LANE_TRANSITION_DURATION = 0.15;

/**
 * Jump duration in seconds.
 */
export const JUMP_DURATION = 0.6;

/**
 * Duck duration in seconds.
 */
export const DUCK_DURATION = 0.8;

/**
 * Jump height in world units.
 */
export const JUMP_HEIGHT = 3;

/**
 * Duck height reduction in world units.
 */
export const DUCK_HEIGHT_REDUCTION = 1.5;

/**
 * Input lockout duration in milliseconds.
 * Time to wait before accepting new input after an action (per FR-014).
 */
export const INPUT_LOCKOUT_DURATION = 150;

/**
 * Obstacle spawn distance ahead of player.
 * Ensures 1+ second reaction time (per SC-004).
 */
export const OBSTACLE_SPAWN_Z = 50;

/**
 * Obstacle cleanup distance behind player.
 * Obstacles passing this point are returned to pool.
 */
export const OBSTACLE_CLEANUP_Z = -10;

/**
 * Collision detection tolerance.
 * Used for bounding box intersection checks.
 */
export const COLLISION_TOLERANCE = 0.1;
