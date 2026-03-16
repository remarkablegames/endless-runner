import type { ObstacleType } from '../types/obstacle';

/**
 * ObstacleSpawn - represents a single obstacle spawn point within a pattern.
 */
export interface ObstacleSpawn {
  /** Lane offset from player's current lane (0 = same lane) */
  laneOffset: number;
  /** Z offset from spawn point */
  zOffset: number;
  /** Type of obstacle */
  type: ObstacleType;
}

/**
 * ObstaclePattern class - represents a predefined arrangement of obstacles.
 * Patterns ensure fair, playable obstacle combinations.
 */
export class ObstaclePattern {
  private readonly id: string;
  private readonly spawns: ObstacleSpawn[];
  private readonly minRunDuration: number;
  private readonly difficulty: number;

  constructor(
    id: string,
    spawns: ObstacleSpawn[],
    minRunDuration: number,
    difficulty: number,
  ) {
    this.id = id;
    this.spawns = spawns;
    this.minRunDuration = minRunDuration;
    this.difficulty = Math.max(0, Math.min(1, difficulty));
  }

  /**
   * Get the pattern ID.
   */
  public getId(): string {
    return this.id;
  }

  /**
   * Get all spawn points.
   */
  public getSpawns(): ObstacleSpawn[] {
    return [...this.spawns];
  }

  /**
   * Get minimum run duration before this pattern can appear.
   */
  public getMinRunDuration(): number {
    return this.minRunDuration;
  }

  /**
   * Get difficulty rating (0-1).
   */
  public getDifficulty(): number {
    return this.difficulty;
  }

  /**
   * Check if this pattern is avoidable.
   * A pattern is avoidable if not all 3 lanes are blocked at the same Z.
   */
  public isAvoidable(): boolean {
    const lanesByZ = new Map<number, Set<number>>();

    for (const spawn of this.spawns) {
      const zKey = spawn.zOffset;
      const lanesAtZ = lanesByZ.get(zKey) ?? new Set<number>();
      lanesByZ.set(zKey, lanesAtZ);
      // Normalize lane offset to absolute lane (0, 1, 2)
      // For validation, we just check if all 3 lanes would be blocked
      lanesAtZ.add(spawn.laneOffset + 1); // Center at 1
    }

    // Check if any Z position blocks all 3 lanes
    for (const lanes of lanesByZ.values()) {
      if (lanes.size >= 3) {
        return false;
      }
    }

    return true;
  }
}

/**
 * Default obstacle patterns for spawning.
 */
export const DEFAULT_PATTERNS: ObstaclePattern[] = [
  // Single obstacle in player's lane (easy)
  new ObstaclePattern(
    'single_center',
    [{ laneOffset: 0, zOffset: 0, type: 'GROUND' }],
    0,
    0.2,
  ),
  // Single obstacle left (easy)
  new ObstaclePattern(
    'single_left',
    [{ laneOffset: -1, zOffset: 0, type: 'GROUND' }],
    0,
    0.2,
  ),
  // Single obstacle right (easy)
  new ObstaclePattern(
    'single_right',
    [{ laneOffset: 1, zOffset: 0, type: 'GROUND' }],
    0,
    0.2,
  ),
  // Two obstacles with gap in middle (medium)
  new ObstaclePattern(
    'double_sides',
    [
      { laneOffset: -1, zOffset: 0, type: 'GROUND' },
      { laneOffset: 1, zOffset: 0, type: 'GROUND' },
    ],
    30,
    0.5,
  ),
  // Alternating obstacles (medium)
  new ObstaclePattern(
    'alternating',
    [
      { laneOffset: 0, zOffset: 0, type: 'GROUND' },
      { laneOffset: -1, zOffset: -10, type: 'GROUND' },
    ],
    45,
    0.6,
  ),
  // Airborne obstacle requiring duck (medium)
  new ObstaclePattern(
    'airborne_center',
    [{ laneOffset: 0, zOffset: 0, type: 'AIRBORNE' }],
    30,
    0.5,
  ),
  // Full lane barrier (hard)
  new ObstaclePattern(
    'full_barrier',
    [{ laneOffset: 0, zOffset: 0, type: 'FULL_LANE' }],
    60,
    0.7,
  ),
  // Three obstacles in sequence (hard)
  new ObstaclePattern(
    'triple_sequence',
    [
      { laneOffset: 0, zOffset: 0, type: 'GROUND' },
      { laneOffset: -1, zOffset: -8, type: 'GROUND' },
      { laneOffset: 1, zOffset: -16, type: 'GROUND' },
    ],
    90,
    0.8,
  ),
];
