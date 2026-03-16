import type { Mesh } from '@babylonjs/core/Meshes/mesh';
import type { Scene } from '@babylonjs/core/scene';

/**
 * Base class for game entities
 */
export abstract class Entity {
  protected mesh: Mesh;
  protected scene: Scene;
  private isDisposed = false;

  constructor(mesh: Mesh) {
    this.mesh = mesh;
    this.scene = mesh.getScene();
  }

  /**
   * Get the underlying mesh
   */
  getMesh(): Mesh {
    return this.mesh;
  }

  /**
   * Get the entity's position
   */
  getPosition() {
    return this.mesh.position.clone();
  }

  /**
   * Set the entity's position
   */
  setPosition(x: number, y: number, z: number) {
    this.mesh.position.set(x, y, z);
  }

  /**
   * Called every frame
   */
  update() {
    // Override for per-entity logic
  }

  /**
   * Check if entity is disposed
   */
  getIsDisposed(): boolean {
    return this.isDisposed;
  }

  /**
   * Cleanup the entity
   */
  dispose() {
    if (!this.isDisposed) {
      this.mesh.dispose();
      this.isDisposed = true;
    }
  }
}
