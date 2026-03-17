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
      'm-5 justify-self-end rounded-full border border-[rgb(73_215_208_/_0.24)] bg-[rgb(7_11_18_/_0.72)] px-4 py-3 text-[0.95rem] uppercase tracking-[0.08em] backdrop-blur-[10px]',
      INVISIBLE_CLASS_NAME,
    ].join(' ');
    this.root.append(this.scoreLabel);

    this.panel = document.createElement('div');
    this.panel.id = 'state-panel';
    this.panel.className = [
      'pointer-events-auto place-self-center max-w-112 rounded-3xl border border-[rgb(73_215_208_/_0.18)] bg-[rgb(8_12_20_/_0.78)] p-8 text-center shadow-[0_20px_60px_rgb(0_0_0_/_0.35)] backdrop-blur-[14px]',
      HIDDEN_CLASS_NAME,
    ].join(' ');

    this.title = document.createElement('h1');
    this.title.className =
      'mb-3 text-[clamp(2.2rem,4vw,3.4rem)] uppercase tracking-[0.06em]';

    this.message = document.createElement('p');
    this.message.className = 'mb-6 leading-6 text-[rgb(242_247_251_/_0.8)]';

    this.primaryButton = document.createElement('button');
    this.primaryButton.type = 'button';
    this.primaryButton.className =
      'cursor-pointer rounded-full border border-[rgb(73_215_208_/_0.35)] [background:linear-gradient(135deg,#35c6d7,#2489ea)] px-[1.3rem] py-[0.9rem] text-base font-bold text-[#031119] shadow-[0_10px_24px_rgb(36_137_234_/_0.18)] transition-[transform,box-shadow,filter] duration-150 ease-in-out hover:-translate-y-0.5 hover:brightness-[1.08] hover:shadow-[0_14px_32px_rgb(36_137_234_/_0.28)] active:translate-y-0 active:shadow-[0_8px_18px_rgb(36_137_234_/_0.2)]';

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
