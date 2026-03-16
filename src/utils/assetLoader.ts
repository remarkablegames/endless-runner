import { Sound } from '@babylonjs/core/Audio/sound';
import { BaseTexture } from '@babylonjs/core/Materials/Textures/baseTexture';
import { CubeTexture } from '@babylonjs/core/Materials/Textures/cubeTexture';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { Scene } from '@babylonjs/core/scene';

/**
 * Asset loading results
 */
export interface LoadedAssets {
  textures: Map<string, BaseTexture>;
  sounds: Map<string, Sound>;
  models: Map<string, unknown>;
}

/**
 * Asset loader utility
 */
export class AssetLoader {
  private scene: Scene;
  private loadedAssets: LoadedAssets;

  constructor(scene: Scene) {
    this.scene = scene;
    this.loadedAssets = {
      textures: new Map(),
      sounds: new Map(),
      models: new Map(),
    };
  }

  /**
   * Load a texture
   */
  loadTexture(name: string, path: string): Texture {
    const texture = new Texture(path, this.scene);
    this.loadedAssets.textures.set(name, texture);
    return texture;
  }

  /**
   * Load a cube texture (for skyboxes)
   */
  loadCubeTexture(name: string, path: string): CubeTexture {
    const texture = new CubeTexture(path, this.scene);
    this.loadedAssets.textures.set(name, texture);
    return texture;
  }

  /**
   * Load a sound
   */
  loadSound(
    name: string,
    path: string,
    options?: { loop?: boolean; autoplay?: boolean; volume?: number },
  ): Promise<Sound> {
    return new Promise((resolve) => {
      const sound = new Sound(name, path, this.scene, () => {
        this.loadedAssets.sounds.set(name, sound);
        if (options?.autoplay) {
          sound.play();
        }
        if (options?.loop) {
          sound.loop = true;
        }
        if (options?.volume !== undefined) {
          sound.setVolume(options.volume);
        }
        resolve(sound);
      });
    });
  }

  /**
   * Get a loaded texture
   */
  getTexture(name: string): BaseTexture | undefined {
    return this.loadedAssets.textures.get(name);
  }

  /**
   * Get a loaded sound
   */
  getSound(name: string): Sound | undefined {
    return this.loadedAssets.sounds.get(name);
  }

  /**
   * Load multiple assets
   */
  async loadAll(assets: {
    textures?: { name: string; path: string }[];
    sounds?: { name: string; path: string }[];
  }): Promise<LoadedAssets> {
    const promises: Promise<Sound>[] = [];

    if (assets.textures) {
      for (const { name, path } of assets.textures) {
        this.loadTexture(name, path);
      }
    }

    if (assets.sounds) {
      for (const { name, path } of assets.sounds) {
        promises.push(this.loadSound(name, path));
      }
    }

    await Promise.all(promises);
    return this.loadedAssets;
  }

  /**
   * Dispose all loaded assets
   */
  dispose() {
    for (const texture of this.loadedAssets.textures.values()) {
      texture.dispose();
    }
    for (const sound of this.loadedAssets.sounds.values()) {
      sound.dispose();
    }
    this.loadedAssets.textures.clear();
    this.loadedAssets.sounds.clear();
    this.loadedAssets.models.clear();
  }
}
