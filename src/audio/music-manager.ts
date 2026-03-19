import '@babylonjs/core/Audio/audioSceneComponent';

import { Sound } from '@babylonjs/core/Audio/sound';
import type { Observer } from '@babylonjs/core/Misc/observable';
import type { Scene } from '@babylonjs/core/scene';

import {
  DEFAULT_MUSIC_SEQUENCE,
  MUSIC_TRACK_PATHS,
  type MusicTrackId,
} from '../config/game-constants';

/**
 * Manages background music playback and deterministic track sequencing.
 */
export class MusicManager {
  private readonly sounds: Record<MusicTrackId, Sound>;
  private readonly sequence: MusicTrackId[];
  private currentSound: Sound | null = null;
  private currentObserver: Observer<Sound> | null = null;
  private hasStarted = false;
  private sequenceIndex = 0;

  constructor(scene: Scene, sequence: MusicTrackId[] = DEFAULT_MUSIC_SEQUENCE) {
    if (sequence.length === 0) {
      throw new Error('Music sequence must contain at least one track');
    }

    this.sequence = [...sequence];
    this.sounds = this.createTrackSounds(scene);
  }

  play() {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;
    this.playCurrentTrack();
  }

  pause() {
    if (this.currentSound?.isPlaying) {
      this.currentSound.pause();
    }
  }

  resume() {
    if (this.currentSound?.isPaused) {
      this.currentSound.play();
      return;
    }

    if (this.hasStarted && this.currentSound === null) {
      this.playCurrentTrack();
    }
  }

  stop() {
    this.hasStarted = false;
    this.sequenceIndex = 0;
    this.stopCurrentSound();
  }

  dispose() {
    this.stop();

    for (const sound of Object.values(this.sounds)) {
      sound.dispose();
    }
  }

  private createTrackSounds(scene: Scene): Record<MusicTrackId, Sound> {
    return Object.fromEntries(
      Object.entries(MUSIC_TRACK_PATHS).map(([trackId, trackPath]) => {
        return [trackId, new Sound(trackId, trackPath, scene)];
      }),
    ) as Record<MusicTrackId, Sound>;
  }

  private playCurrentTrack() {
    const trackId = this.sequence[this.sequenceIndex];
    const sound = this.sounds[trackId];

    this.detachCurrentObserver();
    this.currentSound = sound;
    this.currentObserver = sound.onEndedObservable.addOnce(() => {
      this.currentObserver = null;
      this.currentSound = null;

      if (!this.hasStarted) {
        return;
      }

      this.sequenceIndex = (this.sequenceIndex + 1) % this.sequence.length;
      this.playCurrentTrack();
    });

    sound.stop();
    sound.play();
  }

  private stopCurrentSound() {
    this.detachCurrentObserver();

    if (this.currentSound) {
      this.currentSound.stop();
      this.currentSound = null;
    }
  }

  private detachCurrentObserver() {
    if (this.currentSound && this.currentObserver) {
      this.currentSound.onEndedObservable.remove(this.currentObserver);
      this.currentObserver = null;
    }
  }
}
