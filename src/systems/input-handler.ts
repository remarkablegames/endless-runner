import type { InputDirection } from '../types/input';

/**
 * InputHandler class - manages keyboard input for player control.
 * Implements first-input-wins logic with 150ms queued-input lockout.
 */
export class InputHandler {
  /** Currently pressed keys set */
  private pressedKeys = new Set<string>();

  /** Queued input direction (first input wins) */
  private queuedInput: InputDirection | null = null;

  /** Input lockout timestamp (ms) */
  private lockoutUntil = 0;

  /** Key mapping to input directions */
  private keyMap: Record<string, InputDirection> = {
    ArrowLeft: 'LEFT',
    KeyA: 'LEFT',
    ArrowRight: 'RIGHT',
    KeyD: 'RIGHT',
    ArrowUp: 'UP',
    KeyW: 'UP',
    ArrowDown: 'DOWN',
    KeyS: 'DOWN',
  };

  /** Pause key mapping */
  private pauseKeys = new Set<string>(['KeyP', 'Escape']);

  /**
   * Register keyboard event listeners.
   * @param canvas - The canvas element to attach listeners to
   */
  public initialize(canvas: HTMLCanvasElement): void {
    canvas.addEventListener('keydown', this.handleKeyDown.bind(this));
    canvas.addEventListener('keyup', this.handleKeyUp.bind(this));
  }

  /**
   * Handle key down events.
   * Implements first-input-wins with lockout.
   */
  private handleKeyDown(event: KeyboardEvent): void {
    this.pressedKeys.add(event.code);

    // Check for pause input
    if (this.pauseKeys.has(event.code)) {
      return;
    }

    // Check if this key maps to a valid input direction
    const inputDirection = this.keyMap[event.code];

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!inputDirection) {
      return;
    }

    // First-input-wins: only queue if no input is queued and not in lockout
    if (this.queuedInput === null && Date.now() >= this.lockoutUntil) {
      this.queuedInput = inputDirection;
    }
  }

  /**
   * Handle key up events.
   * Clears lockout on key release to allow new inputs.
   */
  private handleKeyUp(event: KeyboardEvent): void {
    this.pressedKeys.delete(event.code);

    // Clear lockout on release of the key that triggered the queued input
    if (this.queuedInput && this.keyMap[event.code] === this.queuedInput) {
      this.queuedInput = null;
      this.lockoutUntil = Date.now() + 150; // 150ms lockout per FR-014
    }
  }

  /**
   * Poll for the next input direction.
   * Returns null if no input is queued.
   * Consumes the queued input (call once per frame).
   */
  public pollInput(): InputDirection | null {
    const input = this.queuedInput;
    // Don't clear here - clear on keyup instead for first-input-wins
    return input;
  }

  /**
   * Check if a specific input direction is currently queued.
   */
  public isInputQueued(direction: InputDirection): boolean {
    return this.queuedInput === direction;
  }

  /**
   * Check if pause input was triggered.
   * Called on keydown to detect pause request.
   */
  public isPauseTriggered(): boolean {
    for (const code of this.pauseKeys) {
      if (this.pressedKeys.has(code)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Clear all queued inputs.
   * Used when transitioning between game states.
   */
  public clearInputs(): void {
    this.queuedInput = null;
    this.pressedKeys.clear();
  }

  /**
   * Get the current lockout status.
   */
  public isLockedOut(): boolean {
    return Date.now() < this.lockoutUntil;
  }
}
