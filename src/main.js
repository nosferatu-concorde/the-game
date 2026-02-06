import Phaser from 'phaser';
import { TitleScene } from './scenes/TitleScene.js';
import { GameScene } from './scenes/GameScene.js';
import { CRTPipeline } from './shaders/CRTPipeline.js';
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from './constants/config.js';

const config = {
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  pipeline: { CRTPipeline },
  scene: [TitleScene, GameScene],
};

new Phaser.Game(config);
