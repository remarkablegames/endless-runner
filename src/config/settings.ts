/**
 * Game configuration settings
 */
export interface GameSettings {
  /** Enable physics engine */
  physics: boolean;

  /** Target frame rate */
  targetFrameRate: number;

  /** Audio enabled */
  audioEnabled: boolean;

  /** Initial volume (0-1) */
  volume: number;

  /** Screen width (0 for fullscreen) */
  screenWidth: number;

  /** Screen height (0 for fullscreen) */
  screenHeight: number;
}

/**
 * Default game settings
 */
export const defaultSettings: GameSettings = {
  physics: false,
  targetFrameRate: 60,
  audioEnabled: true,
  volume: 0.5,
  screenWidth: 0,
  screenHeight: 0,
};

/**
 * Current game settings (can be modified at runtime)
 */
export const settings: GameSettings = { ...defaultSettings };

/**
 * Update settings
 */
export function updateSettings(partial: Partial<GameSettings>) {
  Object.assign(settings, partial);
}

/**
 * Reset settings to defaults
 */
export function resetSettings() {
  Object.assign(settings, defaultSettings);
}
