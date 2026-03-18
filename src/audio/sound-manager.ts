import '@babylonjs/core/Audio/audioSceneComponent';

import { Sound } from '@babylonjs/core/Audio/sound';
import type { Scene } from '@babylonjs/core/scene';

/**
 * SoundManager - Simple sound effect manager for SFX.
 * Handles loading and playing of game sound effects.
 */
export class SoundManager {
  private jumpSound: Sound;
  private duckSound: Sound;
  private moveSound: Sound;
  private collideSound: Sound;

  constructor(scene: Scene) {
    this.jumpSound = new Sound('jump', 'sounds/jump.mp3', scene, null, {
      loop: false,
    });
    this.duckSound = new Sound('duck', 'sounds/duck.mp3', scene, null, {
      loop: false,
    });
    this.moveSound = new Sound('move', 'sounds/move.mp3', scene, null, {
      loop: false,
    });
    this.collideSound = new Sound(
      'collide',
      'sounds/collide.mp3',
      scene,
      null,
      { loop: false },
    );
  }

  public playJump(): void {
    this.jumpSound.play();
  }

  public playDuck(): void {
    this.duckSound.play();
  }

  public playMove(): void {
    this.moveSound.play();
  }

  public playCollide(): void {
    this.collideSound.play();
  }

  public dispose(): void {
    this.jumpSound.dispose();
    this.duckSound.dispose();
    this.moveSound.dispose();
    this.collideSound.dispose();
  }
}
