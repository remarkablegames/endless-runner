interface StatePanelProps {
  panelRef: (node: HTMLDivElement) => void;
  titleRef: (node: HTMLHeadingElement) => void;
  messageRef: (node: HTMLParagraphElement) => void;
  primaryButtonRef: (node: HTMLButtonElement) => void;
  onPrimaryAction: () => void;
}

export function StatePanel({
  panelRef,
  titleRef,
  messageRef,
  primaryButtonRef,
  onPrimaryAction,
}: StatePanelProps) {
  return (
    <div
      id="state-panel"
      className="pointer-events-auto pointer-events-none max-w-112 place-self-center rounded-3xl border border-teal-400/20 bg-slate-950/80 p-8 text-center opacity-0 shadow-2xl backdrop-blur-md"
      ref={panelRef}
    >
      <h1
        className="mb-3 text-[clamp(2.2rem,4vw,3.4rem)] tracking-[0.06em] uppercase"
        ref={titleRef}
      />

      <p className="mb-6 leading-6 text-slate-50/80" ref={messageRef} />

      <button
        type="button"
        className="cursor-pointer rounded-full border border-teal-400/40 bg-linear-to-br from-cyan-400 to-blue-500 px-5 py-3.5 text-base font-bold text-slate-950 shadow-lg transition duration-150 ease-in-out hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0 active:shadow-md"
        onClick={onPrimaryAction}
        ref={primaryButtonRef}
      />
    </div>
  );
}
