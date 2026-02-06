import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene.js';
import { CRTPipeline } from './shaders/CRTPipeline.js';

const config = {
  type: Phaser.WEBGL,
  width: 1280,
  height: 720,
  backgroundColor: '#ffffff',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 1200 },
      debug: false,
    },
  },
  pipeline: { CRTPipeline },
  scene: [GameScene],
};

new Phaser.Game(config);
