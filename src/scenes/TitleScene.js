import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../constants/config.js";
import { COLORS } from "../constants/styles.js";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  create() {
    this.cameras.main.setPostPipeline("CRTPipeline");

    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, COLORS.BG);

    this.add
      .text(
        CENTER_X,
        CENTER_Y - 40,
        "if (!AI) { return this.antiIntelligenceGame; }",
        {
          fontFamily: "monospace",
          fontSize: "32px",
          color: "#000000",
        },
      )
      .setOrigin(0.5);

    this.add
      .text(CENTER_X, CENTER_Y + 40, "Press SPACE to start", {
        fontFamily: "monospace",
        fontSize: "18px",
        color: "#000000",
      })
      .setOrigin(0.5);

    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene");
    });
  }
}
