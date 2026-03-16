import type { SceneBase } from '../scenes/SceneBase';

/**
 * Scene configuration
 */
export interface SceneConfig {
  name: string;
  preload?: () => Promise<void>;
  create: () => SceneBase;
}

/**
 * Scene registry for managing available scenes
 */
export type SceneRegistry = Map<string, SceneConfig>;
