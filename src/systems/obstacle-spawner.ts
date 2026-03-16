import { OBSTACLE_CLEANUP_Z, OBSTACLE_SPAWN_Z } from '../config/game-constants';
import { Lane } from '../entities/lane';
import { DEFAULT_PATTERNS } from '../entities/obstacle-pattern';
import { ObstaclePool, type PooledObstacle } from './obstacle-pool';

/**
 * Spawns obstacle patterns based on the current difficulty.
 */
export class ObstacleSpawner {
  private readonly obstaclePool: ObstaclePool;
  private spawnCooldown = 0;

  constructor(obstaclePool: ObstaclePool) {
    this.obstaclePool = obstaclePool;
  }

  /**
   * Update obstacle spawning and cleanup.
   */
  public update(deltaTime: number, density: number, runDuration: number): void {
    this.spawnCooldown -= deltaTime;

    if (this.spawnCooldown <= 0) {
      this.spawnPattern(runDuration);
      this.spawnCooldown = Math.max(0.3, 1 / Math.max(0.1, density));
    }

    for (const pooledObstacle of this.obstaclePool.getActive()) {
      if (pooledObstacle.obstacle.getZPosition() < OBSTACLE_CLEANUP_Z) {
        this.obstaclePool.release(pooledObstacle);
      }
    }
  }

  /**
   * Reset spawning for a fresh run.
   */
  public reset(): void {
    this.spawnCooldown = 0;
    this.obstaclePool.reset();
  }

  /**
   * Current active obstacles.
   */
  public getActiveObstacles(): PooledObstacle[] {
    return this.obstaclePool.getActive();
  }

  private spawnPattern(runDuration: number): void {
    const eligiblePatterns = DEFAULT_PATTERNS.filter(
      (pattern) =>
        pattern.getMinRunDuration() <= runDuration && pattern.isAvoidable(),
    );
    const patterns =
      eligiblePatterns.length > 0 ? eligiblePatterns : DEFAULT_PATTERNS;
    const targetDifficulty = Math.min(0.95, 0.25 + runDuration / 75);
    const totalWeight = patterns.reduce((sum, pattern) => {
      const difficultyGap = Math.abs(
        pattern.getDifficulty() - targetDifficulty,
      );
      const weight = Math.max(0.15, 1 - difficultyGap);
      return sum + weight * weight;
    }, 0);
    let selection = Math.random() * totalWeight;
    let selectedPattern = patterns[patterns.length - 1];

    for (const pattern of patterns) {
      const difficultyGap = Math.abs(
        pattern.getDifficulty() - targetDifficulty,
      );
      const weight = Math.max(0.15, 1 - difficultyGap);
      selection -= weight * weight;
      if (selection <= 0) {
        selectedPattern = pattern;
        break;
      }
    }

    for (const spawn of selectedPattern.getSpawns()) {
      const laneValue = Lane.clamp(1 + spawn.laneOffset);
      this.obstaclePool.acquire(
        laneValue,
        spawn.type,
        OBSTACLE_SPAWN_Z + spawn.zOffset,
      );
    }
  }
}
