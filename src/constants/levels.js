export const LEVEL_1 = {
  platforms: [
    { x: 200, y: 550, w: 100 },
    { x: 500, y: 450, w: 200 },
    { x: 900, y: 350, w: 400 },
    { x: 300, y: 300, w: 200 },
    { x: 1050, y: 550, w: 100 },
  ],
  enemies: [
    { x: 300, y: 680, patrolMin: 100, patrolMax: 500 },
    { x: 1000, y: 680, patrolMin: 780, patrolMax: 1180 },
  ],
  spinPlatform: { x: 640, y: 80, w: 200 },
  goal: { x: 640, y: 40, w: 60, h: 60 },
  saws: [
    { x: 500, y: 450, w: 200, speed: 0.15, padding: 15 },
  ],
  playerSpawn: { x: 640, y: 600 },
};

export const LEVEL_2 = {
  platforms: [
    { x: 150, y: 500, w: 150 },
    { x: 400, y: 400, w: 150 },
    { x: 700, y: 300, w: 200 },
    { x: 1000, y: 400, w: 150 },
    { x: 1100, y: 550, w: 100 },
  ],
  enemies: [
    { x: 200, y: 680, patrolMin: 50, patrolMax: 350 },
    { x: 700, y: 680, patrolMin: 500, patrolMax: 900 },
    { x: 1100, y: 680, patrolMin: 950, patrolMax: 1230 },
  ],
  spinPlatform: { x: 640, y: 100, w: 180 },
  goal: { x: 640, y: 60, w: 60, h: 60 },
  saws: [
    { x: 400, y: 400, w: 150, speed: 0.18, padding: 15 },
    { x: 700, y: 300, w: 200, speed: 0.12, padding: 15 },
  ],
  playerSpawn: { x: 100, y: 600 },
};
