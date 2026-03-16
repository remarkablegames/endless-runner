import type { Entity } from '../entities/Entity';

/**
 * Entity constructor type
 */
export type EntityConstructor<T extends Entity = Entity> = new (
  ...args: unknown[]
) => T;

/**
 * Entity update callback
 */
export type EntityUpdateCallback = (deltaTime: number) => void;

/**
 * Entity dispose callback
 */
export type EntityDisposeCallback = () => void;
