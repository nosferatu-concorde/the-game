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

export const LEVEL_6 = {
  platforms: [
    { x: 160, y: 520, w: 100 },
    { x: 400, y: 430, w: 120 },
    { x: 640, y: 340, w: 100 },
    { x: 900, y: 430, w: 120 },
    { x: 1100, y: 520, w: 100 },
    { x: 300, y: 220, w: 100 },
    { x: 800, y: 180, w: 120 },
  ],
  enemies: [
    { x: 300, y: 680, patrolMin: 50, patrolMax: 500 },
    { x: 900, y: 680, patrolMin: 700, patrolMax: 1200 },
    { x: 400, y: 400, patrolMin: 356, patrolMax: 444 },
    { x: 900, y: 400, patrolMin: 856, patrolMax: 944 },
    { x: 640, y: 310, patrolMin: 606, patrolMax: 674 },
  ],
  spinPlatform: { x: 550, y: 70, w: 120 },
  goal: { x: 550, y: 30, w: 60, h: 60 },
  saws: [
    { x: 160, y: 520, w: 100, speed: 0.24, padding: 15 },
    { x: 400, y: 430, w: 120, speed: 0.22, padding: 15 },
    { x: 640, y: 340, w: 100, speed: 0.26, padding: 15 },
    { x: 900, y: 430, w: 120, speed: 0.2, padding: 15 },
    { x: 800, y: 180, w: 120, speed: 0.3, padding: 15 },
  ],
  playerSpawn: { x: 640, y: 600 },
};

export const LEVEL_7 = {
  platforms: [
    { x: 120, y: 540, w: 80 },
    { x: 350, y: 460, w: 100 },
    { x: 600, y: 380, w: 80 },
    { x: 850, y: 300, w: 100 },
    { x: 1100, y: 380, w: 80 },
    { x: 450, y: 220, w: 120 },
    { x: 750, y: 160, w: 80 },
    { x: 200, y: 320, w: 80 },
  ],
  enemies: [
    { x: 200, y: 680, patrolMin: 50, patrolMax: 400 },
    { x: 1000, y: 680, patrolMin: 800, patrolMax: 1230 },
    { x: 350, y: 430, patrolMin: 316, patrolMax: 384 },
    { x: 850, y: 270, patrolMin: 816, patrolMax: 884 },
    { x: 450, y: 190, patrolMin: 406, patrolMax: 494 },
  ],
  spinPlatform: { x: 640, y: 60, w: 100 },
  goal: { x: 640, y: 20, w: 60, h: 60 },
  saws: [
    { x: 120, y: 540, w: 80, speed: 0.26, padding: 15 },
    { x: 600, y: 380, w: 80, speed: 0.28, padding: 15 },
    { x: 1100, y: 380, w: 80, speed: 0.24, padding: 15 },
    { x: 350, y: 460, w: 100, speed: 0.3, padding: 15 },
    { x: 850, y: 300, w: 100, speed: 0.26, padding: 15 },
    { x: 750, y: 160, w: 80, speed: 0.32, padding: 15 },
  ],
  playerSpawn: { x: 100, y: 600 },
};

export const LEVEL_8 = {
  platforms: [
    { x: 200, y: 550, w: 80 },
    { x: 450, y: 480, w: 80 },
    { x: 700, y: 400, w: 80 },
    { x: 950, y: 320, w: 80 },
    { x: 1150, y: 480, w: 80 },
    { x: 350, y: 280, w: 100 },
    { x: 600, y: 200, w: 80 },
    { x: 850, y: 150, w: 100 },
  ],
  enemies: [
    { x: 150, y: 680, patrolMin: 50, patrolMax: 300 },
    { x: 1050, y: 680, patrolMin: 900, patrolMax: 1230 },
    { x: 700, y: 370, patrolMin: 676, patrolMax: 724 },
    { x: 350, y: 250, patrolMin: 316, patrolMax: 384 },
    { x: 850, y: 120, patrolMin: 816, patrolMax: 884 },
    { x: 950, y: 290, patrolMin: 926, patrolMax: 974 },
  ],
  spinPlatform: { x: 640, y: 60, w: 100 },
  goal: { x: 640, y: 20, w: 60, h: 60 },
  saws: [
    { x: 200, y: 550, w: 80, speed: 0.28, padding: 15 },
    { x: 450, y: 480, w: 80, speed: 0.3, padding: 15 },
    { x: 700, y: 400, w: 80, speed: 0.26, padding: 15 },
    { x: 950, y: 320, w: 80, speed: 0.32, padding: 15 },
    { x: 1150, y: 480, w: 80, speed: 0.28, padding: 15 },
    { x: 600, y: 200, w: 80, speed: 0.34, padding: 15 },
  ],
  playerSpawn: { x: 640, y: 600 },
};

export const LEVEL_9 = {
  platforms: [
    { x: 150, y: 530, w: 80 },
    { x: 380, y: 450, w: 80 },
    { x: 620, y: 370, w: 80 },
    { x: 860, y: 290, w: 80 },
    { x: 1100, y: 450, w: 80 },
    { x: 250, y: 250, w: 80 },
    { x: 500, y: 180, w: 80 },
    { x: 750, y: 130, w: 80 },
    { x: 1000, y: 180, w: 80 },
  ],
  enemies: [
    { x: 300, y: 680, patrolMin: 50, patrolMax: 550 },
    { x: 900, y: 680, patrolMin: 700, patrolMax: 1230 },
    { x: 380, y: 420, patrolMin: 356, patrolMax: 404 },
    { x: 860, y: 260, patrolMin: 836, patrolMax: 884 },
    { x: 500, y: 150, patrolMin: 476, patrolMax: 524 },
    { x: 1000, y: 150, patrolMin: 976, patrolMax: 1024 },
  ],
  spinPlatform: { x: 640, y: 50, w: 80 },
  goal: { x: 640, y: 10, w: 60, h: 60 },
  saws: [
    { x: 150, y: 530, w: 80, speed: 0.3, padding: 15 },
    { x: 380, y: 450, w: 80, speed: 0.32, padding: 15 },
    { x: 620, y: 370, w: 80, speed: 0.28, padding: 15 },
    { x: 860, y: 290, w: 80, speed: 0.34, padding: 15 },
    { x: 1100, y: 450, w: 80, speed: 0.3, padding: 15 },
    { x: 250, y: 250, w: 80, speed: 0.32, padding: 15 },
    { x: 750, y: 130, w: 80, speed: 0.36, padding: 15 },
  ],
  playerSpawn: { x: 100, y: 600 },
};

export const LEVEL_10 = {
  platforms: [
    { x: 130, y: 540, w: 70 },
    { x: 330, y: 460, w: 70 },
    { x: 530, y: 380, w: 70 },
    { x: 730, y: 300, w: 70 },
    { x: 930, y: 380, w: 70 },
    { x: 1130, y: 460, w: 70 },
    { x: 250, y: 240, w: 70 },
    { x: 500, y: 170, w: 70 },
    { x: 780, y: 120, w: 70 },
    { x: 1050, y: 200, w: 70 },
  ],
  enemies: [
    { x: 200, y: 680, patrolMin: 50, patrolMax: 400 },
    { x: 1000, y: 680, patrolMin: 800, patrolMax: 1230 },
    { x: 530, y: 350, patrolMin: 511, patrolMax: 549 },
    { x: 730, y: 270, patrolMin: 711, patrolMax: 749 },
    { x: 250, y: 210, patrolMin: 231, patrolMax: 269 },
    { x: 780, y: 90, patrolMin: 761, patrolMax: 799 },
    { x: 1050, y: 170, patrolMin: 1031, patrolMax: 1069 },
  ],
  spinPlatform: { x: 640, y: 45, w: 70 },
  goal: { x: 640, y: 5, w: 60, h: 60 },
  saws: [
    { x: 130, y: 540, w: 70, speed: 0.32, padding: 15 },
    { x: 330, y: 460, w: 70, speed: 0.34, padding: 15 },
    { x: 530, y: 380, w: 70, speed: 0.3, padding: 15 },
    { x: 730, y: 300, w: 70, speed: 0.36, padding: 15 },
    { x: 930, y: 380, w: 70, speed: 0.32, padding: 15 },
    { x: 1130, y: 460, w: 70, speed: 0.28, padding: 15 },
    { x: 500, y: 170, w: 70, speed: 0.36, padding: 15 },
    { x: 1050, y: 200, w: 70, speed: 0.38, padding: 15 },
  ],
  playerSpawn: { x: 640, y: 600 },
};
