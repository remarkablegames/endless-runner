interface ScoreDisplayProps {
  scoreLabelRef: (node: HTMLDivElement) => void;
}

export function ScoreDisplay({ scoreLabelRef }: ScoreDisplayProps) {
  return (
    <div
      id="score-display"
      className="m-5 justify-self-end rounded-full border border-teal-400/25 bg-slate-950/70 px-4 py-3 text-sm tracking-wider uppercase opacity-0 backdrop-blur-md"
      ref={scoreLabelRef}
    />
  );
}
