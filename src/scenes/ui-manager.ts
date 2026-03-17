import { GameStateEnum } from '../types/game-state';

interface UIManagerCallbacks {
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

const HIDDEN_CLASS_NAME = 'pointer-events-none opacity-0';
const INVISIBLE_CLASS_NAME = 'opacity-0';

/**
 * Lightweight DOM UI for game states and score.
 */
export class UIManager {
  private readonly root: HTMLDivElement;
  private readonly title: HTMLHeadingElement;
  private readonly message: HTMLParagraphElement;
  private readonly primaryButton: HTMLButtonElement;
  private readonly scoreLabel: HTMLDivElement;
  private readonly panel: HTMLDivElement;
  private readonly callbacks: UIManagerCallbacks;
  private buttonMode: 'start' | 'resume' | 'restart' = 'start';
  private lastRenderedState: GameStateEnum | null = null;
  private lastRenderedScore = Number.NaN;

  constructor(callbacks: UIManagerCallbacks) {
    this.callbacks = callbacks;
    this.root = document.createElement('div');
    this.root.id = 'ui-overlay';
    this.root.className =
      'pointer-events-none fixed inset-0 z-2 grid grid-rows-[auto_1fr]';

    this.scoreLabel = document.createElement('div');
    this.scoreLabel.id = 'score-display';
    this.scoreLabel.className = [
      'm-5 justify-self-end rounded-full border border-teal-400/25 bg-slate-950/70 px-4 py-3 text-sm uppercase tracking-wider backdrop-blur-md',
      INVISIBLE_CLASS_NAME,
    ].join(' ');
    this.root.append(this.scoreLabel);

    this.panel = document.createElement('div');
    this.panel.id = 'state-panel';
    this.panel.className = [
      'pointer-events-auto place-self-center max-w-112 rounded-3xl border border-teal-400/20 bg-slate-950/80 p-8 text-center shadow-2xl backdrop-blur-md',
      HIDDEN_CLASS_NAME,
    ].join(' ');

    this.title = document.createElement('h1');
    this.title.className =
      'mb-3 text-[clamp(2.2rem,4vw,3.4rem)] uppercase tracking-[0.06em]';

    this.message = document.createElement('p');
    this.message.className = 'mb-6 leading-6 text-slate-50/80';

    this.primaryButton = document.createElement('button');
    this.primaryButton.type = 'button';
    this.primaryButton.className =
      'cursor-pointer rounded-full border border-teal-400/40 bg-linear-to-br from-cyan-400 to-blue-500 px-5 py-3.5 text-base font-bold text-slate-950 shadow-lg transition duration-150 ease-in-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl active:translate-y-0 active:shadow-md';

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

    this.panel.append(this.title, this.message, this.primaryButton);
    this.root.append(this.panel);
    document.body.append(this.root);
  }

  /**
   * Update score and visible panel based on game state.
   */
  public render(state: GameStateEnum, score: number): void {
    const roundedScore = Math.floor(score);
    if (roundedScore !== this.lastRenderedScore) {
      this.scoreLabel.textContent = `Distance ${String(roundedScore)}m`;
      this.lastRenderedScore = roundedScore;
    }

    this.scoreLabel.classList.toggle(
      INVISIBLE_CLASS_NAME,
      state === GameStateEnum.Start,
    );

    if (state === this.lastRenderedState) {
      return;
    }

    this.lastRenderedState = state;

    if (state === GameStateEnum.Start) {
      this.setPanel(
        'Endless Runner',
        '3 lanes. Jump or duck to avoid obstacles. Survive as speed ramps up.',
        'Start Run',
        'start',
      );
      return;
    }

    if (state === GameStateEnum.Paused) {
      this.setPanel('Paused', 'Press P or Esc to resume.', 'Resume', 'resume');
      return;
    }

    if (state === GameStateEnum.GameOver) {
      this.setPanel(
        'Game Over',
        `Final distance ${String(Math.floor(score))}m. Press R to restart.`,
        'Restart',
        'restart',
      );
      return;
    }

    this.panel.classList.add('pointer-events-none', 'opacity-0');
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
    this.panel.classList.remove('pointer-events-none', 'opacity-0');
    this.buttonMode = mode;
    this.title.textContent = title;
    this.message.textContent = message;
    this.primaryButton.textContent = buttonLabel;
  }
}
