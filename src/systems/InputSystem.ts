import { Player } from '../entities/Player';
import type { InputDirection } from '../types/input';

/**
 * Maps abstract input directions to player actions.
 */
export class InputSystem {
  private readonly player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  /**
   * Apply a single directional input to the player.
   */
  public handleDirection(direction: InputDirection): boolean {
    switch (direction) {
      case 'LEFT':
        return this.player.switchLane(
          Math.max(0, this.player.getCurrentLane() - 1) as 0 | 1 | 2,
        );
      case 'RIGHT':
        return this.player.switchLane(
          Math.min(2, this.player.getCurrentLane() + 1) as 0 | 1 | 2,
        );
      case 'UP':
        return this.player.startJump();
      case 'DOWN':
        return this.player.startDuck();
      default:
        return false;
    }
  }
}
