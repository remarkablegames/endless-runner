interface ScoreDisplayProps {
  scoreLabelRef: (node: HTMLDivElement) => void;
}

const SCORE_LABEL_CLASS_NAME =
  'm-5 justify-self-end rounded-full border border-teal-400/25 bg-slate-950/70 px-4 py-3 text-sm uppercase tracking-wider backdrop-blur-md opacity-0';

export function ScoreDisplay({ scoreLabelRef }: ScoreDisplayProps) {
  return (
    <div
      id="score-display"
      class={SCORE_LABEL_CLASS_NAME}
      ref={scoreLabelRef}
    />
  );
}
