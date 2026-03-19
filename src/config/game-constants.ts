import type { DifficultyConfig } from '../types/difficulty-config';
import type { LaneIndex } from '../types/input';

export type MusicTrackId =
  | 'intro1'
  | 'intro2'
  | 'intro3'
  | 'verse1'
  | 'verse2'
  | 'verse3'
  | 'bridge1'
  | 'bridge2'
  | 'bridge3'
  | 'chorus1'
  | 'chorus2'
  | 'chorus3'
  | 'chorus4'
  | 'chorus5';

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
export const BASE_SPEED = 12;

/**
 * Maximum forward speed cap.
 */
export const MAX_SPEED = 30;

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
export const BASE_DENSITY = 0.85;

/**
 * Maximum obstacle spawn density.
 */
export const MAX_DENSITY = 3.0;

/**
 * Duration to reach max density in seconds (per SC-009: 3 minutes).
 */
export const DENSITY_RAMP_DURATION = 105;

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
 * Music track lookup for deterministic loop sequencing.
 */
export const MUSIC_TRACK_PATHS: Record<MusicTrackId, string> = {
  intro1: 'music/intro1.mp3',
  intro2: 'music/intro2.mp3',
  intro3: 'music/intro3.mp3',
  verse1: 'music/verse1.mp3',
  verse2: 'music/verse2.mp3',
  verse3: 'music/verse3.mp3',
  bridge1: 'music/bridge1.mp3',
  bridge2: 'music/bridge2.mp3',
  bridge3: 'music/bridge3.mp3',
  chorus1: 'music/chorus1.mp3',
  chorus2: 'music/chorus2.mp3',
  chorus3: 'music/chorus3.mp3',
  chorus4: 'music/chorus4.mp3',
  chorus5: 'music/chorus5.mp3',
};

/**
 * Default music loop order. Playback wraps to the first item after the last.
 */
export const DEFAULT_MUSIC_SEQUENCE: MusicTrackId[] = [
  'intro1',
  'verse1',
  'bridge1',
  'chorus1',
  'verse2',
  'chorus2',
  'bridge2',
  'chorus3',
];

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
export const DUCK_DURATION = 0.5;

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
 * Kept short so repeated lane changes still feel responsive.
 */
export const INPUT_LOCKOUT_DURATION = 50;

/**
 * Obstacle spawn distance ahead of player.
 * Ensures 1+ second reaction time (per SC-004).
 */
export const OBSTACLE_SPAWN_Z = 42;

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

/**
 * Player Z position in world units.
 * Camera target point for the player.
 */
export const PLAYER_Z = 8;
