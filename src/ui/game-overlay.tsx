import { ScoreDisplay } from './score-display';
import { StatePanel } from './state-panel';

interface GameOverlayProps {
  rootRef: (node: HTMLDivElement) => void;
  scoreLabelRef: (node: HTMLDivElement) => void;
  panelRef: (node: HTMLDivElement) => void;
  titleRef: (node: HTMLHeadingElement) => void;
  messageRef: (node: HTMLParagraphElement) => void;
  primaryButtonRef: (node: HTMLButtonElement) => void;
  onPrimaryAction: () => void;
}

export function GameOverlay({
  rootRef,
  scoreLabelRef,
  panelRef,
  titleRef,
  messageRef,
  primaryButtonRef,
  onPrimaryAction,
}: GameOverlayProps) {
  return (
    <div
      id="ui-overlay"
      className="pointer-events-none fixed inset-0 z-2 grid grid-rows-[auto_1fr]"
      ref={rootRef}
    >
      <ScoreDisplay scoreLabelRef={scoreLabelRef} />
      <StatePanel
        panelRef={panelRef}
        titleRef={titleRef}
        messageRef={messageRef}
        primaryButtonRef={primaryButtonRef}
        onPrimaryAction={onPrimaryAction}
      />
    </div>
  );
}
