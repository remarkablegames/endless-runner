import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import type { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import type { Scene } from '@babylonjs/core/scene';

import { Entity } from './Entity';

/**
 * Example player entity with movement
 */
export class Player extends Entity {
  private moveSpeed: number;

  constructor(scene: Scene, position: Vector3) {
    // Create player mesh (sphere)
    const mesh = MeshBuilder.CreateSphere('player', { diameter: 1 }, scene);
    const material = new StandardMaterial('playerMaterial', scene);
    material.diffuseColor = new Color3(1, 0.4, 0.4);
    material.specularColor = new Color3(0.5, 0.5, 0.5);
    mesh.material = material;
    mesh.position = position;

    super(mesh);

    this.moveSpeed = 5;
  }

  /**
   * Move the player in a direction
   */
  move(direction: Vector3, deltaTime: number) {
    const movement = direction.scale(this.moveSpeed * deltaTime);
    this.mesh.position.addInPlace(movement);
  }

  /**
   * Set movement speed
   */
  setSpeed(speed: number) {
    this.moveSpeed = speed;
  }

  /**
   * Update player
   */
  override update() {
    // Override for player-specific update logic
  }
}
