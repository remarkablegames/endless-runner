import { LANE_X_POSITIONS } from '../config/game-constants';
import type { LaneIndex } from '../types/input';

/**
 * Lane utility class - represents a discrete lane position.
 * Provides helper methods for lane operations.
 */
export class Lane {
  private readonly index: LaneIndex;

  constructor(index: LaneIndex) {
    this.index = index;
  }

  /**
   * Get the lane index.
   */
  public getIndex(): LaneIndex {
    return this.index;
  }

  /**
   * Get the X position for this lane.
   */
  public getXPosition(): number {
    return LANE_X_POSITIONS[this.index];
  }

  /**
   * Check if this is the leftmost lane.
   */
  public isLeftmost(): boolean {
    return this.index === 0;
  }

  /**
   * Check if this is the rightmost lane.
   */
  public isRightmost(): boolean {
    return this.index === 2;
  }

  /**
   * Check if this is the center lane.
   */
  public isCenter(): boolean {
    return this.index === 1;
  }

  /**
   * Get the left neighbor lane, or undefined if leftmost.
   */
  public getLeftNeighbor(): Lane | undefined {
    if (this.isLeftmost()) {
      return undefined;
    }
    return new Lane((this.index - 1) as LaneIndex);
  }

  /**
   * Get the right neighbor lane, or undefined if rightmost.
   */
  public getRightNeighbor(): Lane | undefined {
    if (this.isRightmost()) {
      return undefined;
    }
    return new Lane((this.index + 1) as LaneIndex);
  }

  /**
   * Check if a lane index is valid.
   */
  public static isValid(index: number): index is LaneIndex {
    return index >= 0 && index <= 2;
  }

  /**
   * Clamp a value to valid lane indices.
   */
  public static clamp(index: number): LaneIndex {
    if (index <= 0) return 0;
    if (index >= 2) return 2;
    return 1;
  }

  /**
   * Get all lanes.
   */
  public static getAll(): Lane[] {
    return [new Lane(0), new Lane(1), new Lane(2)];
  }
}
