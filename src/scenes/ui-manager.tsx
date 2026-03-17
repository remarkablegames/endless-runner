import { GameStateEnum } from '../types/game-state';
import { GameOverlay, type PanelContent } from '../ui';

interface UIManagerCallbacks {
  onStart: () => void;
  onResume: () => void;
  onRestart: () => void;
}

type ButtonMode = 'start' | 'resume' | 'restart';
type OverlayPanelContent = PanelContent & {
  mode: ButtonMode;
};

/**
 * Lightweight DOM UI for game states and score.
 */
export class UIManager {
  private root: HTMLDivElement;
  private readonly callbacks: UIManagerCallbacks;
  private buttonMode: ButtonMode = 'start';
  private lastRenderedState: GameStateEnum | null = null;
  private lastRenderedScore = Number.NaN;

  constructor(callbacks: UIManagerCallbacks) {
    this.callbacks = callbacks;
    this.root = this.createOverlay('', false, null);
    document.body.append(this.root);
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

    const nextRoot = this.createOverlay(
      `Distance ${String(roundedScore)}m`,
      state !== GameStateEnum.Start,
      panelContent,
    );
    this.root.replaceWith(nextRoot);
    this.root = nextRoot;
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

  private createOverlay(
    scoreText: string,
    isScoreVisible: boolean,
    panelContent: PanelContent | null,
  ): HTMLDivElement {
    return (
      <div
        id="ui-overlay"
        className="pointer-events-none fixed inset-0 z-2 grid grid-rows-[auto_1fr]"
      >
        <GameOverlay
          scoreText={scoreText}
          isScoreVisible={isScoreVisible}
          panelContent={panelContent}
          onPrimaryAction={() => {
            this.handlePrimaryAction();
          }}
        />
      </div>
    ) as HTMLDivElement;
  }
}
