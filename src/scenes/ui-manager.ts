import { GameStateEnum } from '../types/game-state';

interface UIManagerCallbacks {
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

/**
 * Lightweight DOM UI for game states and score.
 */
export class UIManager {
  private readonly root: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly message: HTMLParagraphElement;
  private readonly primaryButton: HTMLButtonElement;
  private readonly scoreLabel: HTMLDivElement;
  private readonly callbacks: UIManagerCallbacks;
  private buttonMode: 'start' | 'resume' | 'restart' = 'start';

  constructor(callbacks: UIManagerCallbacks) {
    this.callbacks = callbacks;
    this.root = document.createElement('div');
    this.root.id = 'ui-overlay';

    this.scoreLabel = document.createElement('div');
    this.scoreLabel.id = 'score-display';
    this.root.append(this.scoreLabel);

    const panel = document.createElement('div');
    panel.id = 'state-panel';

    this.title = document.createElement('h1');
    this.message = document.createElement('p');
    this.primaryButton = document.createElement('button');
    this.primaryButton.type = 'button';
    this.primaryButton.addEventListener('click', () => {
      if (this.buttonMode === 'start') {
        this.callbacks.onStart();
        return;
      }

      if (this.buttonMode === 'resume') {
        this.callbacks.onResume();
        return;
      }

      this.callbacks.onRestart();
    });

    panel.append(this.title, this.message, this.primaryButton);
    this.root.append(panel);
    document.body.append(this.root);
  }

  /**
   * Update score and visible panel based on game state.
   */
  public render(state: GameStateEnum, score: number): void {
    this.scoreLabel.textContent = `Distance ${String(Math.floor(score))}m`;
    this.scoreLabel.dataset.visible =
      state === GameStateEnum.Start ? 'false' : 'true';

    if (state === GameStateEnum.Start) {
      this.setPanel(
        'Endless Runner',
        'Three lanes. Jump low barriers, duck high ones, and survive as speed ramps up.',
        'Start Run',
        'start',
      );
      return;
    }

    if (state === GameStateEnum.Paused) {
      this.setPanel(
        'Paused',
        'Run is frozen. Press P or Escape to resume.',
        'Resume',
        'resume',
      );
      return;
    }

    if (state === GameStateEnum.GameOver) {
      this.setPanel(
        'Game Over',
        `Final distance ${String(Math.floor(score))}m. Press R or restart to run again.`,
        'Restart',
        'restart',
      );
      return;
    }

    this.root
      .querySelector('#state-panel')
      ?.setAttribute('data-hidden', 'true');
  }

  /**
   * Cleanup DOM nodes.
   */
  public dispose(): void {
    this.root.remove();
  }

  private setPanel(
    title: string,
    message: string,
    buttonLabel: string,
    mode: 'start' | 'resume' | 'restart',
  ): void {
    const panel = this.root.querySelector('#state-panel');
    panel?.setAttribute('data-hidden', 'false');
    this.buttonMode = mode;
    this.title.textContent = title;
    this.message.textContent = message;
    this.primaryButton.textContent = buttonLabel;
  }
}
