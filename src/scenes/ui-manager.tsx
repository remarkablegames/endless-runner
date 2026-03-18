import { GameStateEnum } from '../types/game-state';
import { GameOverlay, type PanelContent } from '../ui';

interface UIManagerCallbacks {
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
  onClick?: () => void;
}

type ButtonMode = 'start' | 'resume' | 'restart';
type OverlayPanelContent = PanelContent & {
  mode: ButtonMode;
};

/**
 * Lightweight DOM UI for game states and score.
 */
export class UIManager {
  private readonly root: HTMLDivElement;
  private readonly contentRoot: HTMLDivElement;
  private readonly callbacks: UIManagerCallbacks;
  private buttonMode: ButtonMode = 'start';
  private lastRenderedState: GameStateEnum | null = null;
  private lastRenderedScore = Number.NaN;

  constructor(callbacks: UIManagerCallbacks) {
    this.callbacks = callbacks;
    this.root = document.createElement('div');
    this.root.id = 'ui-overlay';
    this.root.className =
      'pointer-events-none fixed inset-0 z-2 grid grid-rows-[auto_1fr]';

    this.contentRoot = document.createElement('div');
    this.contentRoot.className = 'contents';
    this.root.append(this.contentRoot);
    document.body.append(this.root);
    this.updateOverlay('', false, null);
  }

  /**
   * Update score and visible panel based on game state.
   */
  public render(state: GameStateEnum, score: number): void {
    const roundedScore = Math.floor(score);
    if (
      state === this.lastRenderedState &&
      roundedScore === this.lastRenderedScore
    ) {
      return;
    }

    this.lastRenderedState = state;
    this.lastRenderedScore = roundedScore;

    const panelContent = this.getPanelContent(state, roundedScore);
    if (panelContent !== null) {
      this.buttonMode = panelContent.mode;
    }

    this.updateOverlay(
      `Distance ${String(roundedScore)}m`,
      state !== GameStateEnum.Start,
      panelContent,
    );
  }

  /**
   * Cleanup DOM nodes.
   */
  public dispose(): void {
    this.root.remove();
  }

  private handlePrimaryAction(): void {
    this.callbacks.onClick?.();

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
  ): OverlayPanelContent | null {
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

  private updateOverlay(
    scoreText: string,
    isScoreVisible: boolean,
    panelContent: PanelContent | null,
  ): void {
    this.contentRoot.replaceChildren(
      <GameOverlay
        scoreText={scoreText}
        isScoreVisible={isScoreVisible}
        panelContent={panelContent}
        onPrimaryAction={() => {
          this.handlePrimaryAction();
        }}
      />,
    );
  }
}
