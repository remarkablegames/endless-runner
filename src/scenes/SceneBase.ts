import type { Engine } from '@babylonjs/core/Engines/engine';
import type { Scene } from '@babylonjs/core/scene';

/**
 * Base class for all game scenes
 */
export abstract class SceneBase {
  protected scene: Scene;
  protected engine: Engine;

  constructor(engine: Engine, scene: Scene) {
    this.engine = engine;
    this.scene = scene;
  }

  /**
   * Called when the scene is activated
   */
  onActivate() {
    // Override for scene activation
  }

  /**
   * Called when the scene is deactivated
   */
  onDeactivate() {
    // Override to cleanup
  }

  /**
   * Called every frame while the scene is active
   */
  onUpdate() {
    // Override for per-frame logic
  }

  /**
   * Cleanup when scene is destroyed
   */
  dispose() {
    this.scene.dispose();
  }
}
