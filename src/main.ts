import { createEngine, createScene } from './core';
import { InputSystem, RenderSystem } from './systems';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const canvas = document.querySelector('canvas')!;
const spinner = document.getElementById('spinner') as HTMLDivElement;
const engine = createEngine(canvas);
const scene = createScene(engine);

// Hide spinner when scene is ready
scene.onReadyObservable.addOnce(() => {
  spinner.remove();
});

// Enable inspector only in development (excluded from production build)
if (import.meta.env.DEV) {
  void import('@babylonjs/inspector').then(({ ShowInspector }) => {
    ShowInspector(scene, {});
  });
}

new InputSystem(scene);
const renderSystem = new RenderSystem(engine, scene);

renderSystem.startRenderLoop(() => {
  // Update systems
  // Add your game update logic here
});

// Pause when tab is hidden
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    engine.stopRenderLoop();
    return;
  }
  renderSystem.startRenderLoop(() => {
    // Update logic
  });
});
