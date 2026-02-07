import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../constants/config.js";
import { CRTPipeline } from "../shaders/CRTPipeline.js";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {


    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000);
    this.cameras.main.setPostPipeline(CRTPipeline);

    this.add
      .text(CENTER_X, CENTER_Y - 50, "if (!AI) THIS.GAME", {
        fontFamily: "monospace",
        fontSize: "90px",
        color: "#ffffff",
        fontStyle: "bold",
      })
      .setOrigin(0.5);

    this.add
      .text(CENTER_X, CENTER_Y + 30, "/* SPACE to begin (fix later) */", {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this._showLevelTransition();
    });
  }

  _showLevelTransition() {
    this.children.removeAll();

    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000);

    const levelText = this.add.text(CENTER_X, CENTER_Y, "1", {
      fontFamily: "monospace",
      fontSize: "500px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    levelText.setOrigin(0.5);

    this.time.delayedCall(200, () => {
      this.scene.start("GameScene", { level: 1 });
    });
  }
}
