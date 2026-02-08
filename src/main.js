import Phaser from "phaser";
import { TitleScene } from "./scenes/TitleScene.js";
import { TutorialScene } from "./scenes/TutorialScene.js";
import { GameScene } from "./scenes/GameScene.js";

import { GAME_WIDTH, GAME_HEIGHT, GRAVITY } from "./constants/config.js";
import { CRTPipeline } from "./shaders/CRTPipeline.js";

const config = {
  type: Phaser.WEBGL,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: "#FFFDCA",
  fps: {
    target: 60,
    limit: 60,
    forceSetTimeOut: false,
  },
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY },
      debug: false,
    },
  },
  audio: {
    disableWebAudio: false,
  },
  pipeline: [CRTPipeline],
  scene: [TitleScene, TutorialScene, GameScene],
};

new Phaser.Game(config);
