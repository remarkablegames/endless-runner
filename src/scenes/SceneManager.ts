import { SceneBase } from './SceneBase';

/**
 * Manages scene loading and transitions
 */
export class SceneManager {
  private scenes = new Map<string, SceneBase>();
  private currentScene: SceneBase | null = null;

  /**
   * Register a scene
   */
  addScene(name: string, scene: SceneBase) {
    this.scenes.set(name, scene);
  }

  /**
   * Get a registered scene
   */
  getScene(name: string): SceneBase | undefined {
    return this.scenes.get(name);
  }

  /**
   * Activate a scene
   */
  activateScene(name: string) {
    const scene = this.scenes.get(name);
    if (!scene) {
      return;
    }

    // Deactivate current scene
    if (this.currentScene) {
      this.currentScene.onDeactivate();
    }

    // Activate new scene
    this.currentScene = scene;
    this.currentScene.onActivate();
  }

  /**
   * Get the current active scene
   */
  getCurrentScene(): SceneBase | null {
    return this.currentScene;
  }

  /**
   * Update the current scene
   */
  update() {
    if (this.currentScene) {
      this.currentScene.onUpdate();
    }
  }

  /**
   * Dispose all scenes
   */
  dispose() {
    for (const scene of this.scenes.values()) {
      scene.dispose();
    }
    this.scenes.clear();
    this.currentScene = null;
  }
}
