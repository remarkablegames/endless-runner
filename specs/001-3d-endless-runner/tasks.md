# Tasks: 3D Endless Runner Game

**Input**: Design documents from `/specs/001-3d-endless-runner/`
**Prerequisites**: plan.md, spec.md, data-model.md, research.md, quickstart.md
**Tests**: Manual playtesting only (no automated tests requested)

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan (src/config/, src/core/, src/entities/, src/scenes/, src/systems/, src/types/, src/utils/)
- [x] T002 [P] Configure TypeScript strict mode in tsconfig.app.json (strict: true)
- [x] T003 [P] Verify Vite build configuration in vite.config.mts for Babylon.js web game

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T004 [P] Create GameStateEnum type in src/types/game-state.ts (Start, Running, Paused, GameOver, Restarting)
- [ ] T005 [P] Create LaneIndex and InputDirection types in src/types/input.ts (LaneIndex: 0|1|2, InputDirection: LEFT|RIGHT|UP|DOWN)
- [ ] T006 [P] Create ObstacleType and PlayerAction types in src/types/obstacle.ts
- [ ] T007 [P] Create DifficultyConfig interface in src/types/difficulty-config.ts (baseSpeed, maxSpeed, speedIncreaseInterval, baseDensity, maxDensity, densityRampDuration)
- [ ] T008 [P] Create game constants in src/config/game-constants.ts (LANE_X_POSITIONS: [-2, 0, 2], BASE_SPEED, MAX_SPEED, etc.)
- [ ] T009 Create GameState class in src/core/game-state.ts (state, score, startTime, pauseTime, isRunning, state transition methods)
- [ ] T010 Create InputHandler class in src/systems/input-handler.ts (keyboard event listeners, first-input-wins logic, input lockout)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Player Movement Control (Priority: P1) 🎯 MVP

**Goal**: Implement 4-directional player movement (left/right lane switching, up/jump, down/duck) across 3 discrete lanes

**Independent Test**: Can be fully tested by spawning the player in a test scene with no obstacles and verifying that pressing movement controls moves the character to the correct lane or triggers the correct vertical action

### Implementation for User Story 1

- [ ] T011 [P] [US1] Create Player class in src/entities/player.ts (currentLane, targetLane, isJumping, isDucking, jumpProgress, duckProgress, verticalPosition)
- [ ] T012 [P] [US1] Create Lane utility in src/entities/lane.ts (index, xPosition, isLeftmost, isRightmost, getLeftNeighbor, getRightNeighbor)
- [ ] T013 [US1] Implement Player lane switching logic in src/entities/player.ts (switchLane method with boundary checks per FR-007, FR-008)
- [ ] T014 [US1] Implement Player jump action in src/entities/player.ts (startJump method, jump animation progress, vertical position interpolation)
- [ ] T015 [US1] Implement Player duck action in src/entities/player.ts (startDuck method, duck animation progress, vertical position interpolation)
- [ ] T016 [US1] Connect InputHandler to Player movement in src/systems/input-system.ts (map LEFT/RIGHT to lane switches, UP to jump, DOWN to duck)
- [ ] T017 [US1] Create PlayerVisual class in src/entities/player-visual.ts (Babylon.js mesh creation, lane transition lerp, jump/duck animation)
- [ ] T018 [US1] Integrate PlayerVisual with Player state in src/entities/player-visual.ts (update method syncs with Player properties)
- [ ] T019 [US1] Add input validation per FR-014 in src/systems/input-handler.ts (first-input-wins, ignore subsequent inputs until release)

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently

- ✅ Player can switch lanes left/right with boundary checks
- ✅ Player can jump (up) and duck (down)
- ✅ First-input-wins prevents conflicting inputs
- ✅ Smooth visual transitions via lerp

---

## Phase 4: User Story 2 - Endless Running Progression (Priority: P2)

**Goal**: Implement automatic forward movement with procedural obstacle spawning and progressive difficulty scaling

**Independent Test**: Can be tested by starting the game with no user input and observing that the character continuously moves forward through generated terrain/obstacles until a game over condition is met

### Implementation for User Story 2

- [ ] T020 [P] [US2] Create Obstacle class in src/entities/obstacle.ts (id, lane, type, zPosition, isActive, requiresJump, requiresDuck, requiresLaneChange)
- [ ] T021 [P] [US2] Create ObstaclePattern class in src/entities/obstacle-pattern.ts (pattern definitions with minRunDuration and difficulty rating)
- [ ] T022 [US2] Implement ObstacleSpawner in src/systems/obstacle-spawner.ts (spawn obstacles ahead of player, pattern selection, object pooling)
- [ ] T023 [US2] Create ObstaclePool in src/systems/obstacle-pool.ts (reuse obstacle instances, activate/deactivate, prevent create/destroy overhead)
- [ ] T024 [US2] Implement difficulty scaling in src/systems/difficulty-manager.ts (interpolate speed and density based on run duration per SC-008, SC-009)
- [ ] T025 [US2] Create ObstacleVisual class in src/entities/obstacle-visual.ts (Babylon.js mesh creation per obstacle type, Babylon.js primitives for MVP)
- [ ] T026 [US2] Integrate obstacle movement in src/systems/obstacle-system.ts (move obstacles toward player based on current speed)
- [ ] T027 [US2] Add obstacle cleanup in src/systems/obstacle-pool.ts (deactivate obstacles that pass behind player, return to pool)
- [ ] T028 [US2] Implement progressive speed increase per FR-019 in src/systems/difficulty-manager.ts (increase every 30 seconds)
- [ ] T029 [US2] Implement progressive density increase per FR-020 in src/systems/difficulty-manager.ts (reach max by 3 minutes)

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently

- ✅ Player can move and avoid obstacles
- ✅ Obstacles spawn in patterns with fair avoidability
- ✅ Game speed increases every 30 seconds
- ✅ Obstacle density increases over 3 minutes
- ✅ Object pooling maintains 60 FPS performance

---

## Phase 5: User Story 3 - Obstacle Collision and Game Over (Priority: P3)

**Goal**: Implement collision detection between player and obstacles with game over state transition

**Independent Test**: Can be tested by intentionally colliding the player with an obstacle and verifying that the game detects the collision and triggers the game over state

### Implementation for User Story 3

- [ ] T030 [P] [US3] Create CollisionDetector in src/systems/collision-detector.ts (bounding box intersection using Babylon.js intersectsMesh())
- [ ] T031 [US3] Implement per-frame collision check in src/systems/collision-detector.ts (check player vs all active obstacles, <50ms detection per SC-003)
- [ ] T032 [US3] Create collision boxes for Player in src/entities/player-visual.ts (separate boxes for standing, jumping, ducking states)
- [ ] T033 [US3] Create collision boxes for Obstacle in src/entities/obstacle-visual.ts (bounding box per obstacle type)
- [ ] T034 [US3] Trigger game over on collision in src/core/game-state.ts (transition Running → GameOver when collision detected)
- [ ] T035 [US3] Implement score tracking in src/core/game-state.ts (distance traveled, continuous update per SC-007)
- [ ] T036 [US3] Add game over state handling in src/core/game-state.ts (freeze game loop, store final score)

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently

- ✅ Player can move and avoid obstacles
- ✅ Collision detection triggers within 50ms
- ✅ Game over state activates on collision
- ✅ Final score is tracked and stored

---

## Phase 6: User Story 4 - Game State Management (Priority: P4)

**Goal**: Implement complete game state machine with start screen, pause/resume, and restart functionality

**Independent Test**: Can be tested by transitioning through each state (start → running → paused → running → game over → restart) and verifying the correct UI and behavior for each state

### Implementation for User Story 4

- [ ] T037 [P] [US4] Create StartScreen in src/scenes/start-screen.ts (Babylon.js GUI with game title and start button)
- [ ] T038 [P] [US4] Create GameOverScreen in src/scenes/game-over-screen.ts (display final score, restart option)
- [ ] T039 [P] [US4] Create PauseOverlay in src/scenes/pause-overlay.ts (paused message, resume button)
- [ ] T040 [US4] Implement state transition Start → Running in src/core/game-state.ts (on start game input, initialize score, set startTime)
- [ ] T041 [US4] Implement state transition Running → Paused in src/core/game-state.ts (on pause input, set pauseTime, freeze all updates per FR-018)
- [ ] T042 [US4] Implement state transition Paused → Running in src/core/game-state.ts (on resume input, clear pauseTime, resume from exact point)
- [ ] T043 [US4] Implement state transition Running → GameOver in src/core/game-state.ts (on collision, trigger T034, display final score)
- [ ] T044 [US4] Implement state transition GameOver → Restarting → Running in src/core/game-state.ts (on restart, reset score, reset obstacles, new run per FR-013)
- [ ] T045 [US4] Connect pause input to InputHandler in src/systems/input-handler.ts (P/Escape key triggers pause/resume)
- [ ] T046 [US4] Connect restart input to InputHandler in src/systems/input-handler.ts (R key on game over screen triggers restart)
- [ ] T047 [US4] Integrate UI screens with GameState in src/scenes/ui-manager.ts (show/hide screens based on current state)
- [ ] T048 [US4] Implement score display update in src/scenes/ui-manager.ts (continuous distance display per SC-007, <100ms delay)

**Checkpoint**: All user stories are now complete and integrated

- ✅ Start screen displays on load
- ✅ Game transitions to running state on start
- ✅ Pause freezes all action and displays overlay
- ✅ Resume continues from exact point
- ✅ Game over displays final score
- ✅ Restart begins new run with reset score

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T049 [P] Add Babylon.js scene cleanup in src/scenes/game-scene.ts (dispose meshes, materials on state transitions per Decision 10)
- [ ] T050 [P] Add object pooling optimization verification in src/systems/obstacle-pool.ts (ensure no create/destroy during gameplay)
- [ ] T051 [P] Add debug mode for difficulty tuning in src/config/game-constants.ts (speed multiplier, density multiplier, invincibility toggle)
- [ ] T052 [P] Verify TypeScript strict mode compliance (npm run lint:tsc, fix any type errors)
- [ ] T053 [P] Verify ESLint compliance (npm run lint:fix, fix any style errors)
- [ ] T054 Update quickstart.md with final controls and troubleshooting (verify accuracy against implementation)
- [ ] T055 [P] Add Babylon.js Inspector hook in src/scenes/game-scene.ts (scene.debugLayer.show() for performance profiling)
- [ ] T056 [P] Verify 60 FPS performance in Chrome DevTools Performance tab (profile gameplay, check frame timing)
- [ ] T057 [P] Verify input latency <100ms per SC-001 (test movement response time)
- [ ] T058 [P] Verify obstacle reaction time 1+ second per SC-004 (check spawn zPosition vs speed)
- [ ] T059 [P] Verify restart flow completes within 3 seconds per SC-005 (record stopwatch results in docs/verification/restart-timing.md)
- [ ] T060 [P] Audit initial bundle size stays under 5MB by inspecting dist/ output and document findings in docs/verification/asset-optimization.md
- [ ] T061 [P] Confirm Babylon assets use optimized geometry/textures (record checks for src/entities assets in docs/verification/asset-optimization.md)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - **BLOCKS all user stories**
- **User Stories (Phase 3-6)**: All depend on Foundational phase completion
  - User stories can proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3 → P4)
- **Polish (Phase 7)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Independent, may integrate with US1
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Depends on US1 (Player) and US2 (Obstacles) being present
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Depends on US3 (collision/game over logic)

### Within Each User Story

- Models before services (e.g., T011 Player before T013 lane switching logic)
- Services before integration (e.g., T016 input-system after T011-T015 Player methods)
- Core implementation before visual integration
- Story complete before moving to next priority

### Parallel Opportunities

- **Phase 1 (Setup)**: T002, T003 can run in parallel
- **Phase 2 (Foundational)**: T004-T008 (types/constants) can run in parallel; T009-T010 can run in parallel
- **Phase 3 (US1)**: T011-T012 (Player, Lane models) can run in parallel; T017 (PlayerVisual) can start after T011
- **Phase 4 (US2)**: T020-T021 (Obstacle, ObstaclePattern models) can run in parallel; T022-T023 (spawner, pool) can run in parallel
- **Phase 5 (US3)**: T030 (CollisionDetector) can start independently; T032-T033 (collision boxes) can run in parallel
- **Phase 6 (US4)**: T037-T039 (UI screens) can run in parallel; T040-T044 (state transitions) can run in parallel
- **Phase 7 (Polish)**: All tasks marked [P] can run in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all Player/Lane model tasks together:
Task: "T011 [P] [US1] Create Player class in src/entities/player.ts"
Task: "T012 [P] [US1] Create Lane utility in src/entities/lane.ts"

# Then visual integration:
Task: "T017 [US1] Create PlayerVisual class in src/entities/player-visual.ts"
```

---

## Parallel Example: User Story 2

```bash
# Launch all obstacle model tasks together:
Task: "T020 [P] [US2] Create Obstacle class in src/entities/obstacle.ts"
Task: "T021 [P] [US2] Create ObstaclePattern class in src/entities/obstacle-pattern.ts"

# Launch spawner and pool tasks together:
Task: "T022 [US2] Implement ObstacleSpawner in src/systems/obstacle-spawner.ts"
Task: "T023 [US2] Create ObstaclePool in src/systems/obstacle-pool.ts"
```

---

## Parallel Example: User Story 4

```bash
# Launch all UI screen tasks together:
Task: "T037 [P] [US4] Create StartScreen in src/scenes/start-screen.ts"
Task: "T038 [P] [US4] Create GameOverScreen in src/scenes/game-over-screen.ts"
Task: "T039 [P] [US4] Create PauseOverlay in src/scenes/pause-overlay.ts"

# Launch all state transition tasks in parallel:
Task: "T040 [US4] Implement Start → Running transition"
Task: "T041 [US4] Implement Running → Paused transition"
Task: "T042 [US4] Implement Paused → Running transition"
Task: "T043 [US4] Implement Running → GameOver transition"
Task: "T044 [US4] Implement GameOver → Restarting → Running transition"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: Test player movement in isolation
   - Spawn player in empty scene
   - Verify lane switching left/right with boundary checks
   - Verify jump and duck actions
   - Verify first-input-wins prevents conflicting inputs
5. Deploy/demo if ready (basic movement prototype)

### Incremental Delivery

1. **Foundation** (Phase 1-2): Project structure, types, constants, input handling
2. **MVP** (Phase 3): Player movement control → Test independently → Demo
3. **Core Gameplay** (Phase 4): Endless running with obstacles → Test independently → Demo
4. **Challenge** (Phase 5): Collision and game over → Test independently → Demo
5. **Polish** (Phase 6): Full state management, UI screens → Test independently → Demo
6. **Optimization** (Phase 7): Performance, cleanup, debug tools → Final validation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Player movement)
   - Developer B: User Story 2 (Obstacle spawning, difficulty)
3. After US1+US2 complete:
   - Developer A: User Story 3 (Collision detection)
   - Developer B: User Story 4 (Game states, UI)
4. All stories integrate independently without breaking previous work

---

## Task Summary

| Phase     | Description       | Task Count |
| --------- | ----------------- | ---------- |
| Phase 1   | Setup             | 3          |
| Phase 2   | Foundational      | 7          |
| Phase 3   | User Story 1 (P1) | 9          |
| Phase 4   | User Story 2 (P2) | 10         |
| Phase 5   | User Story 3 (P3) | 7          |
| Phase 6   | User Story 4 (P4) | 12         |
| Phase 7   | Polish            | 13         |
| **Total** |                   | **61**     |

### Task Count per User Story

- **US1 (Player Movement)**: 9 tasks (T011-T019)
- **US2 (Endless Running)**: 10 tasks (T020-T029)
- **US3 (Collision/Game Over)**: 7 tasks (T030-T036)
- **US4 (Game States)**: 12 tasks (T037-T048)

### Parallel Opportunities Identified

- **Phase 1**: 2/3 tasks parallelizable
- **Phase 2**: 7/7 tasks parallelizable (5 types/constants + 2 core systems)
- **Phase 3 (US1)**: 3/9 tasks parallelizable (Player, Lane models + PlayerVisual)
- **Phase 4 (US2)**: 4/10 tasks parallelizable (Obstacle, Pattern models + Spawner, Pool)
- **Phase 5 (US3)**: 3/7 tasks parallelizable (CollisionDetector + collision boxes)
- **Phase 6 (US4)**: 7/12 tasks parallelizable (UI screens + state transitions)
- **Phase 7**: 13/13 tasks parallelizable

### Independent Test Criteria per Story

- **US1**: Player spawns in empty scene, all 4 directional inputs work with boundary checks
- **US2**: Game runs with no input, obstacles spawn fairly, speed/density increase over time
- **US3**: Intentional collision triggers game over within 50ms, score tracked
- **US4**: All 5 states (Start, Running, Paused, GameOver, Restarting) transition correctly with UI

### Suggested MVP Scope

**Minimum Viable Product**: User Story 1 Only (Player Movement Control)

- Player can switch lanes left/right
- Player can jump and duck
- First-input-wins prevents conflicting inputs
- Smooth visual transitions
- **Deliverable**: Interactive prototype demonstrating core movement mechanic

**Extended MVP**: User Stories 1 + 2

- Add endless running with obstacle spawning
- Progressive difficulty scaling
- **Deliverable**: Playable game loop (no game over state yet)

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Babylon.js primitives used for MVP (no external assets)
- Object pooling critical for 60 FPS performance
- First-input-wins is key design decision for input handling
