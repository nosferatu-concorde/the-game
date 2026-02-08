import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../constants/config.js";
import { CRTPipeline } from "../shaders/CRTPipeline.js";
import { TITLE_TEXT, TITLE_PROMPT } from "../constants/dialogue.js";

export class TitleScene extends Phaser.Scene {
  constructor() {
    super("TitleScene");
  }

  preload() {
    this.load.image("start-screen", "start-screen.png");
    this.load.audio("song", "the-game-song.wav");
  }

  create() {
    this.add.image(CENTER_X, CENTER_Y, "start-screen").setDisplaySize(GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.setPostPipeline(CRTPipeline);

    const title = this.add
      .text(CENTER_X, CENTER_Y - 50, TITLE_TEXT, {
        fontFamily: "monospace",
        fontSize: "90px",
        color: "#ffffff",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      })
      .setOrigin(0.5);

    const prompt = this.add
      .text(CENTER_X, CENTER_Y + 30, TITLE_PROMPT, {
        fontFamily: "monospace",
        fontSize: "16px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 3,
        align: "center",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: [title, prompt],
      scale: { from: 1, to: 1.05 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.titleSong = this.sound.add("song", { loop: true, volume: 0.2 });
    this.titleSong.play({ rate: 0.3 });

    this.input.keyboard.once("keydown-SPACE", () => {
      this.titleSong.stop();
      this.scene.start("TutorialScene");
    });
  }

}
