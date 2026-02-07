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
    { x: 1000, y: 680, patrolMin: 850, patrolMax: 1200 },
    { x: 400, y: 370, patrolMin: 340, patrolMax: 460 },
  ],
  spinPlatform: { x: 640, y: 100, w: 180 },
  goal: { x: 640, y: 60, w: 60, h: 60 },
  saws: [
    { x: 400, y: 400, w: 150, speed: 0.18, padding: 15 },
    { x: 700, y: 300, w: 200, speed: 0.12, padding: 15 },
  ],
  playerSpawn: { x: 100, y: 600 },
};

export const LEVEL_3 = {
  platforms: [
    { x: 200, y: 550, w: 200 },
    { x: 500, y: 420, w: 150 },
    { x: 800, y: 320, w: 250 },
    { x: 350, y: 250, w: 150 },
    { x: 1050, y: 500, w: 150 },
  ],
  enemies: [
    { x: 200, y: 680, patrolMin: 50, patrolMax: 400 },
    { x: 900, y: 680, patrolMin: 700, patrolMax: 1100 },
    { x: 800, y: 290, patrolMin: 691, patrolMax: 909 },
  ],
  spinPlatform: { x: 640, y: 80, w: 160 },
  goal: { x: 640, y: 40, w: 60, h: 60 },
  saws: [
    { x: 500, y: 420, w: 150, speed: 0.18, padding: 15 },
    { x: 800, y: 320, w: 250, speed: 0.14, padding: 15 },
    { x: 200, y: 550, w: 200, speed: 0.2, padding: 15 },
  ],
  playerSpawn: { x: 640, y: 600 },
};

export const LEVEL_4 = {
  platforms: [
    { x: 150, y: 520, w: 150 },
    { x: 450, y: 440, w: 200 },
    { x: 750, y: 350, w: 150 },
    { x: 1050, y: 440, w: 200 },
    { x: 600, y: 220, w: 200 },
    { x: 250, y: 300, w: 100 },
  ],
  enemies: [
    { x: 300, y: 680, patrolMin: 100, patrolMax: 500 },
    { x: 900, y: 680, patrolMin: 750, patrolMax: 1150 },
    { x: 450, y: 410, patrolMin: 366, patrolMax: 534 },
    { x: 1050, y: 410, patrolMin: 966, patrolMax: 1134 },
  ],
  spinPlatform: { x: 640, y: 80, w: 150 },
  goal: { x: 640, y: 40, w: 60, h: 60 },
  saws: [
    { x: 450, y: 440, w: 200, speed: 0.2, padding: 15 },
    { x: 750, y: 350, w: 150, speed: 0.22, padding: 15 },
    { x: 1050, y: 440, w: 200, speed: 0.16, padding: 15 },
    { x: 600, y: 220, w: 200, speed: 0.18, padding: 15 },
  ],
  playerSpawn: { x: 100, y: 600 },
};

export const LEVEL_5 = {
  platforms: [
    { x: 180, y: 550, w: 120 },
    { x: 400, y: 460, w: 150 },
    { x: 650, y: 370, w: 180 },
    { x: 900, y: 280, w: 150 },
    { x: 1100, y: 460, w: 120 },
    { x: 350, y: 230, w: 120 },
    { x: 750, y: 180, w: 100 },
  ],
  enemies: [
    { x: 200, y: 680, patrolMin: 50, patrolMax: 350 },
    { x: 1000, y: 680, patrolMin: 850, patrolMax: 1200 },
    { x: 650, y: 340, patrolMin: 576, patrolMax: 724 },
    { x: 400, y: 430, patrolMin: 341, patrolMax: 459 },
    { x: 900, y: 250, patrolMin: 841, patrolMax: 959 },
  ],
  spinPlatform: { x: 640, y: 70, w: 140 },
  goal: { x: 640, y: 30, w: 60, h: 60 },
  saws: [
    { x: 400, y: 460, w: 150, speed: 0.22, padding: 15 },
    { x: 650, y: 370, w: 180, speed: 0.2, padding: 15 },
    { x: 900, y: 280, w: 150, speed: 0.25, padding: 15 },
    { x: 180, y: 550, w: 120, speed: 0.18, padding: 15 },
    { x: 750, y: 180, w: 100, speed: 0.28, padding: 15 },
  ],
  playerSpawn: { x: 640, y: 600 },
};
