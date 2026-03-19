import '@babylonjs/core/Audio/audioSceneComponent';

import { Sound } from '@babylonjs/core/Audio/sound';
import type { Observer } from '@babylonjs/core/Misc/observable';
import type { Scene } from '@babylonjs/core/scene';

type MusicSection = 'intro' | 'verse' | 'bridge' | 'chorus';

const MUSIC_VOLUME = 1.0;

const SECTION_SEQUENCE: MusicSection[] = [
  'verse',
  'bridge',
  'chorus',
  'verse',
  'chorus',
  'bridge',
  'chorus',
];

const SECTION_TRACK_PATHS: Record<MusicSection, string[]> = {
  intro: ['music/intro1.mp3', 'music/intro2.mp3', 'music/intro3.mp3'],
  verse: ['music/verse1.mp3', 'music/verse2.mp3', 'music/verse3.mp3'],
  bridge: ['music/bridge1.mp3', 'music/bridge2.mp3', 'music/bridge3.mp3'],
  chorus: [
    'music/chorus1.mp3',
    'music/chorus2.mp3',
    'music/chorus3.mp3',
    'music/chorus4.mp3',
    'music/chorus5.mp3',
  ],
};

/**
 * Manages background music playback and section sequencing.
 */
export class MusicManager {
  private readonly sections: Record<MusicSection, Sound[]>;
  private readonly lastVariantIndex: Partial<Record<MusicSection, number>> = {};
  private currentSound: Sound | null = null;
  private currentObserver: Observer<Sound> | null = null;
  private hasStarted = false;
  private hasPlayedIntro = false;
  private sequenceIndex = 0;

  constructor(scene: Scene) {
    this.sections = {
      intro: this.createSectionSounds(scene, 'intro'),
      verse: this.createSectionSounds(scene, 'verse'),
      bridge: this.createSectionSounds(scene, 'bridge'),
      chorus: this.createSectionSounds(scene, 'chorus'),
    };
  }

  play() {
    if (this.hasStarted) {
      return;
    }

    this.hasStarted = true;

    if (!this.hasPlayedIntro) {
      this.playSection('intro');
      return;
    }

    this.playNextSection();
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
      this.playNextSection();
    }
  }

  stop() {
    this.hasStarted = false;
    this.hasPlayedIntro = false;
    this.sequenceIndex = 0;
    this.stopCurrentSound();
  }

  dispose() {
    this.stop();

    for (const sounds of Object.values(this.sections)) {
      for (const sound of sounds) {
        sound.dispose();
      }
    }
  }

  private createSectionSounds(scene: Scene, section: MusicSection): Sound[] {
    return SECTION_TRACK_PATHS[section].map((trackPath, index) => {
      return new Sound(`${section}-${String(index)}`, trackPath, scene, null, {
        autoplay: false,
        loop: false,
        spatialSound: false,
        volume: MUSIC_VOLUME,
      });
    });
  }

  private playNextSection() {
    const nextSection = SECTION_SEQUENCE[this.sequenceIndex];
    this.sequenceIndex = (this.sequenceIndex + 1) % SECTION_SEQUENCE.length;
    this.playSection(nextSection);
  }

  private playSection(section: MusicSection) {
    const sound = this.pickSectionVariant(section);

    this.detachCurrentObserver();
    this.currentSound = sound;
    this.currentObserver = sound.onEndedObservable.addOnce(() => {
      this.currentObserver = null;
      this.currentSound = null;

      if (!this.hasStarted) {
        return;
      }

      if (section === 'intro') {
        this.hasPlayedIntro = true;
      }

      this.playNextSection();
    });

    sound.stop();
    sound.play();
  }

  private pickSectionVariant(section: MusicSection): Sound {
    const sounds = this.sections[section];
    const previousIndex = this.lastVariantIndex[section];

    if (sounds.length === 1) {
      this.lastVariantIndex[section] = 0;
      return sounds[0];
    }

    let nextIndex = Math.floor(Math.random() * sounds.length);
    if (sounds.length > 1 && nextIndex === previousIndex) {
      nextIndex = (nextIndex + 1) % sounds.length;
    }

    this.lastVariantIndex[section] = nextIndex;
    return sounds[nextIndex];
  }

  private stopCurrentSound() {
    this.detachCurrentObserver();

    if (this.currentSound !== null) {
      this.currentSound.stop();
      this.currentSound = null;
    }
  }

  private detachCurrentObserver() {
    if (this.currentSound !== null && this.currentObserver !== null) {
      this.currentSound.onEndedObservable.remove(this.currentObserver);
      this.currentObserver = null;
    }
  }
}
