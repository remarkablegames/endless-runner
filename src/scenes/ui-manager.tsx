import { GameStateEnum } from '../types/game-state';
import { GameOverlay } from '../ui';

interface UIManagerCallbacks {
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

type ButtonMode = 'start' | 'resume' | 'restart';

interface PanelContent {
  title: string;
  message: string;
  buttonLabel: string;
  mode: ButtonMode;
}

const INVISIBLE_CLASS_NAME = 'opacity-0';
const HIDDEN_CLASS_NAMES = ['pointer-events-none', INVISIBLE_CLASS_NAME];

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
  private buttonMode: ButtonMode = 'start';
  private lastRenderedState: GameStateEnum | null = null;
  private lastRenderedScore = Number.NaN;

  constructor(callbacks: UIManagerCallbacks) {
    this.callbacks = callbacks;

    const refs: {
      root?: HTMLDivElement;
      scoreLabel?: HTMLDivElement;
      panel?: HTMLDivElement;
      title?: HTMLHeadingElement;
      message?: HTMLParagraphElement;
      primaryButton?: HTMLButtonElement;
    } = {};

    const overlay = (
      <GameOverlay
        rootRef={(node) => {
          refs.root = node;
        }}
        scoreLabelRef={(node) => {
          refs.scoreLabel = node;
        }}
        panelRef={(node) => {
          refs.panel = node;
        }}
        titleRef={(node) => {
          refs.title = node;
        }}
        messageRef={(node) => {
          refs.message = node;
        }}
        primaryButtonRef={(node) => {
          refs.primaryButton = node;
        }}
        onPrimaryAction={() => {
          this.handlePrimaryAction();
        }}
      />
    );

    document.body.append(overlay);

    if (
      refs.root === undefined ||
      refs.scoreLabel === undefined ||
      refs.panel === undefined ||
      refs.title === undefined ||
      refs.message === undefined ||
      refs.primaryButton === undefined
    ) {
      throw new Error('Failed to initialize UI overlay');
    }

    this.root = refs.root;
    this.scoreLabel = refs.scoreLabel;
    this.panel = refs.panel;
    this.title = refs.title;
    this.message = refs.message;
    this.primaryButton = refs.primaryButton;
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

    const panelContent = this.getPanelContent(state, roundedScore);
    if (panelContent === null) {
      this.panel.classList.add(...HIDDEN_CLASS_NAMES);
      return;
    }

    this.panel.classList.remove(...HIDDEN_CLASS_NAMES);
    this.buttonMode = panelContent.mode;
    this.title.textContent = panelContent.title;
    this.message.textContent = panelContent.message;
    this.primaryButton.textContent = panelContent.buttonLabel;
  }

  /**
   * Cleanup DOM nodes.
   */
  public dispose(): void {
    this.root.remove();
  }

  private handlePrimaryAction(): void {
    if (this.buttonMode === 'start') {
      this.callbacks.onStart();
      return;
    }

    if (this.buttonMode === 'resume') {
      this.callbacks.onResume();
      return;
    }

    this.callbacks.onRestart();
  }

  private getPanelContent(
    state: GameStateEnum,
    roundedScore: number,
  ): PanelContent | null {
    if (state === GameStateEnum.Start) {
      return {
        title: 'Endless Runner',
        message:
          '3 lanes. Jump or duck to avoid obstacles. Survive as speed ramps up.',
        buttonLabel: 'Start Run',
        mode: 'start',
      };
    }

    if (state === GameStateEnum.Paused) {
      return {
        title: 'Paused',
        message: 'Press P or Esc to resume.',
        buttonLabel: 'Resume',
        mode: 'resume',
      };
    }

    if (state === GameStateEnum.GameOver) {
      return {
        title: 'Game Over',
        message: `Final distance ${String(roundedScore)}m. Press R to restart.`,
        buttonLabel: 'Restart',
        mode: 'restart',
      };
    }

    return null;
  }
}
