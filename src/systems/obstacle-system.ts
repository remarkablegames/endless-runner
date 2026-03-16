import type { PooledObstacle } from './obstacle-pool';
import { ObstacleSpawner } from './obstacle-spawner';

/**
 * Moves active obstacles through the world.
 */
export class ObstacleSystem {
  private readonly obstacleSpawner: ObstacleSpawner;

  constructor(obstacleSpawner: ObstacleSpawner) {
    this.obstacleSpawner = obstacleSpawner;
  }

  /**
   * Spawn, move, and sync active obstacles.
   */
  public update(
    deltaTime: number,
    speed: number,
    density: number,
    runDuration: number,
  ): void {
    this.obstacleSpawner.update(deltaTime, density, runDuration);

    for (const pooledObstacle of this.obstacleSpawner.getActiveObstacles()) {
      pooledObstacle.obstacle.moveForward(speed * deltaTime);
      pooledObstacle.visual.sync();
    }
  }

  /**
   * Expose active obstacles for collision checks.
   */
  public getActiveObstacles(): PooledObstacle[] {
    return this.obstacleSpawner.getActiveObstacles();
  }

  /**
   * Reset all obstacle state.
   */
  public reset(): void {
    this.obstacleSpawner.reset();
  }
}
