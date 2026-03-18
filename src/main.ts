import { SoundManager } from './audio';
import { DIFFICULTY_CONFIG } from './config/game-constants';
import { createEngine, createScene } from './core';
import { GameState } from './core/game-state';
import { Player, PlayerVisual } from './entities';
import { UIManager } from './scenes';
import {
  CollisionDetector,
  DifficultyManager,
  InputHandler,
  InputSystem,
  ObstaclePool,
  ObstacleSpawner,
  ObstacleSystem,
  RenderSystem,
} from './systems';
import { GameStateEnum } from './types/game-state';

const canvas = document.querySelector<HTMLCanvasElement>('#game');
const spinner = document.querySelector<HTMLDivElement>('#spinner');

if (!canvas) {
  throw new Error('Game canvas not found');
}

const engine = createEngine(canvas);
const scene = createScene(engine);
const renderSystem = new RenderSystem(engine, scene);
const gameState = new GameState();
const difficultyManager = new DifficultyManager(DIFFICULTY_CONFIG);
const inputHandler = new InputHandler();
const player = new Player();
const soundManager = new SoundManager(scene);
const inputSystem = new InputSystem(player, soundManager);
const playerVisual = new PlayerVisual(player, scene);
const obstaclePool = new ObstaclePool(scene);
const obstacleSpawner = new ObstacleSpawner(obstaclePool);
const obstacleSystem = new ObstacleSystem(obstacleSpawner);
const collisionDetector = new CollisionDetector();

const resetRun = (): void => {
  player.reset();
  playerVisual.syncImmediate();
  difficultyManager.reset();
  obstacleSystem.reset();
  inputHandler.clearInputs();
};

const startRun = (): void => {
  if (gameState.getState() === GameStateEnum.Start) {
    resetRun();
    gameState.startGame();
    return;
  }

  if (gameState.getState() === GameStateEnum.GameOver) {
    resetRun();
    gameState.restartGame();
  }
};

const resumeRun = (): void => {
  if (gameState.getState() === GameStateEnum.Paused) {
    gameState.resumeGame();
    inputHandler.clearInputs();
  }
};

const uiManager = new UIManager({
  onRestart: startRun,
  onResume: resumeRun,
  onStart: startRun,
});

inputHandler.initialize();

scene.onReadyObservable.addOnce(() => {
  spinner?.remove();
  uiManager.render(gameState.getState(), gameState.getScore());
});

renderSystem.startRenderLoop((deltaTime) => {
  if (inputHandler.consumePauseRequested()) {
    if (gameState.getState() === GameStateEnum.Running) {
      gameState.pauseGame();
      inputHandler.clearInputs();
    } else if (gameState.getState() === GameStateEnum.Paused) {
      resumeRun();
    }
  }

  if (
    gameState.getState() === GameStateEnum.Start &&
    inputHandler.consumeStartRequested()
  ) {
    startRun();
  }

  if (
    gameState.getState() === GameStateEnum.GameOver &&
    inputHandler.consumeRestartRequested()
  ) {
    startRun();
  }

  if (gameState.isRunning()) {
    const inputDirection = inputHandler.pollInput();
    if (inputDirection !== null) {
      inputSystem.handleDirection(inputDirection);
    }

    player.update(deltaTime);
    playerVisual.update();
    difficultyManager.update(deltaTime);

    const currentSpeed = difficultyManager.getCurrentSpeed();
    const currentDensity = difficultyManager.getCurrentDensity();

    obstacleSystem.update(
      deltaTime,
      currentSpeed,
      currentDensity,
      difficultyManager.getRunDuration(),
    );
    gameState.updateScore(deltaTime, currentSpeed);

    if (
      collisionDetector.hasCollision(
        player,
        obstacleSystem.getActiveObstacles(),
      )
    ) {
      soundManager.playCollide();
      gameState.triggerGameOver();
      inputHandler.clearInputs();
    }
  } else {
    playerVisual.update();
  }

  uiManager.render(gameState.getState(), gameState.getScore());
});

window.addEventListener('visibilitychange', () => {
  if (document.hidden && gameState.getState() === GameStateEnum.Running) {
    gameState.pauseGame();
    inputHandler.clearInputs();
  }
});

window.addEventListener('beforeunload', () => {
  inputHandler.dispose();
  uiManager.dispose();
  playerVisual.dispose();
  obstaclePool.dispose();
  soundManager.dispose();
});
