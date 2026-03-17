interface ScoreDisplayProps {
  scoreText: string;
  isVisible: boolean;
}

export function ScoreDisplay({ scoreText, isVisible }: ScoreDisplayProps) {
  return (
    <div
      id="score-display"
      class={[
        'm-5 justify-self-end rounded-full border border-teal-400/25 bg-slate-950/70 px-4 py-3 text-sm tracking-wider uppercase backdrop-blur-md',
        !isVisible && 'opacity-0',
      ]}
    >
      {scoreText}
    </div>
  );
}
