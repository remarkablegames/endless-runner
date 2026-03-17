interface StatePanelProps {
  panelRef: (node: HTMLDivElement) => void;
  titleRef: (node: HTMLHeadingElement) => void;
  messageRef: (node: HTMLParagraphElement) => void;
  primaryButtonRef: (node: HTMLButtonElement) => void;
  onPrimaryAction: () => void;
}

const PANEL_CLASS_NAME =
  'pointer-events-auto place-self-center max-w-112 rounded-3xl border border-teal-400/20 bg-slate-950/80 p-8 text-center shadow-2xl backdrop-blur-md pointer-events-none opacity-0';
const TITLE_CLASS_NAME =
  'mb-3 text-[clamp(2.2rem,4vw,3.4rem)] uppercase tracking-[0.06em]';
const MESSAGE_CLASS_NAME = 'mb-6 leading-6 text-slate-50/80';
const PRIMARY_BUTTON_CLASS_NAME =
  'cursor-pointer rounded-full border border-teal-400/40 bg-linear-to-br from-cyan-400 to-blue-500 px-5 py-3.5 text-base font-bold text-slate-950 shadow-lg transition duration-150 ease-in-out hover:-translate-y-0.5 hover:brightness-110 hover:shadow-xl active:translate-y-0 active:shadow-md';

export function StatePanel({
  panelRef,
  titleRef,
  messageRef,
  primaryButtonRef,
  onPrimaryAction,
}: StatePanelProps) {
  return (
    <div id="state-panel" class={PANEL_CLASS_NAME} ref={panelRef}>
      <h1 class={TITLE_CLASS_NAME} ref={titleRef} />
      <p class={MESSAGE_CLASS_NAME} ref={messageRef} />
      <button
        type="button"
        class={PRIMARY_BUTTON_CLASS_NAME}
        onClick={onPrimaryAction}
        ref={primaryButtonRef}
      />
    </div>
  );
}
