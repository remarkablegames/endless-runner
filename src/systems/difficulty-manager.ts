import type { DifficultyConfig } from '../types/difficulty-config';

/**
 * DifficultyManager class - handles progressive difficulty scaling.
 * Interpolates speed and density based on run duration.
 */
export class DifficultyManager {
  private config: DifficultyConfig;
  private runDuration = 0;
  private lastSpeedIncreaseTime = 0;

  constructor(config: DifficultyConfig) {
    this.config = config;
  }

  /**
   * Update the difficulty manager based on elapsed time.
   * @param deltaTime - Time since last update in seconds
   */
  public update(deltaTime: number): void {
    this.runDuration += deltaTime;
  }

  /**
   * Get the current speed based on run duration.
   * Linear interpolation from baseSpeed to maxSpeed.
   */
  public getCurrentSpeed(): number {
    const progress = Math.min(
      1,
      this.runDuration / this.config.densityRampDuration,
    );
    return (
      this.config.baseSpeed +
      (this.config.maxSpeed - this.config.baseSpeed) * progress
    );
  }

  /**
   * Get the current obstacle density based on run duration.
   * Linear interpolation from baseDensity to maxDensity.
   */
  public getCurrentDensity(): number {
    const progress = Math.min(
      1,
      this.runDuration / this.config.densityRampDuration,
    );
    return (
      this.config.baseDensity +
      (this.config.maxDensity - this.config.baseDensity) * progress
    );
  }

  /**
   * Get the run duration in seconds.
   */
  public getRunDuration(): number {
    return this.runDuration;
  }

  /**
   * Check if it's time for a speed increase.
   * Returns true every speedIncreaseInterval seconds.
   */
  public shouldIncreaseSpeed(): boolean {
    const intervals = Math.floor(
      this.runDuration / this.config.speedIncreaseInterval,
    );
    if (intervals > this.lastSpeedIncreaseTime) {
      this.lastSpeedIncreaseTime = intervals;
      return true;
    }
    return false;
  }

  /**
   * Reset the difficulty manager for a new run.
   */
  public reset(): void {
    this.runDuration = 0;
    this.lastSpeedIncreaseTime = 0;
  }

  /**
   * Get the difficulty config.
   */
  public getConfig(): DifficultyConfig {
    return this.config;
  }
}
