import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
} from "../constants/config.js";
import { CRTPipeline } from "../shaders/CRTPipeline.js";
import {
  TUTORIAL_HEADER,
  TUTORIAL_ELEMENTS_HEADER,
  TUTORIAL_PROMPT,
} from "../constants/dialogue.js";

const TEXT_STYLE = {
  fontFamily: "monospace",
  fontSize: "22px",
  color: "#000000",
};

const HEADER_STYLE = {
  ...TEXT_STYLE,
  fontSize: "32px",
  fontStyle: "bold",
};

const KEY_STYLE = {
  fontFamily: "monospace",
  fontSize: "18px",
  color: "#000000",
  fontStyle: "bold",
  align: "center",
};

export class TutorialScene extends Phaser.Scene {
  constructor() {
    super("TutorialScene");
  }

  preload() {
    this.load.image("player", "player.png");
    this.load.image("enemy_attack1", "enemy_attack1.png");
    this.load.image("enemy_attack2", "enemy_attack2.png");
    this.load.image("saw", "saw.png");
    this.load.image("goal", "heart.png");
  }

  create() {
    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0xfffdca);
    this.cameras.main.setPostPipeline(CRTPipeline);

    const leftCol = 280;
    const rightCol = 620;
    let y = 70;

    // -- Header --
    this.add.text(CENTER_X, y, TUTORIAL_HEADER, HEADER_STYLE).setOrigin(0.5);
    y += 60;

    // -- Controls Section --
    const controls = [
      { keys: ["←", "→", "A", "D"], label: "move()" },
      { keys: ["↑", "W", "SPACE"], label: "jump()" },
      { keys: ["↓", "S"], label: "dropThrough()" },
    ];

    for (const ctrl of controls) {
      this._drawKeys(leftCol, y, ctrl.keys);
      this.add.text(rightCol, y, ctrl.label, TEXT_STYLE).setOrigin(0, 0.5);
      y += 55;
    }

    // -- Player idle demo (upper right) --
    const playerX = 1020;
    const playerY = 200;
    const playerSprite = this.add.image(playerX, playerY, "player");
    playerSprite.setScale(1.5);
    playerSprite.setDepth(5);
    const baseW = playerSprite.width;
    const baseH = playerSprite.height;
    this.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        this._playerIdleFrame = 1 - (this._playerIdleFrame || 0);
        if (this._playerIdleFrame === 1) {
          playerSprite.setScale(1.5 * (1 + 4 / baseW), 1.5 * (1 - 4 / baseH));
        } else {
          playerSprite.setScale(1.5);
        }
      },
    });

    // Speech bubble (always visible)
    this._createBubble(playerX, playerY - 90, "IF (idle)\n  start.idling()");

    this.add
      .text(playerX, playerY + 75, "idle() // bump platforms\n// beware: limits jump()", {
        ...TEXT_STYLE,
        fontSize: "16px",
        align: "center",
      })
      .setOrigin(0.5, 0)
      .setDepth(12);

    // -- Elements Header --
    y += 20;
    this.add
      .text(CENTER_X, y, TUTORIAL_ELEMENTS_HEADER, HEADER_STYLE)
      .setOrigin(0.5);
    y += 60;

    // -- Game Elements --
    // Enemy with chase animation
    const enemySprite = this.add.image(leftCol, y, "enemy_attack1");
    enemySprite.setScale(2);
    this.add.text(rightCol, y, "IF (sameLevel) chase(player)", TEXT_STYLE).setOrigin(0, 0.5);
    this.enemyFrame = 0;
    this.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        this.enemyFrame = 1 - this.enemyFrame;
        enemySprite.setTexture(this.enemyFrame === 0 ? "enemy_attack1" : "enemy_attack2");
      },
    });
    y += 65;

    // Saw
    const sawSprite = this.add.image(leftCol, y, "saw");
    sawSprite.setScale(0.8);
    this.add.text(rightCol, y, "while(true) kill()", TEXT_STYLE).setOrigin(0, 0.5);
    y += 65;

    // Heart
    const heartSprite = this.add.image(leftCol, y, "goal");
    heartSprite.setScale(0.6);
    heartSprite.setTint(0xff1493);
    this.add.text(rightCol, y, "collect(heart) // to advance", TEXT_STYLE).setOrigin(0, 0.5);
    y += 65;

    // -- Prompt --
    const prompt = this.add
      .text(CENTER_X, GAME_HEIGHT - 60, TUTORIAL_PROMPT, {
        ...TEXT_STYLE,
        fontSize: "24px",
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: prompt,
      alpha: { from: 1, to: 0.3 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    // -- Transition --
    this.input.keyboard.once("keydown-SPACE", () => {
      this.scene.start("GameScene", { level: 1 });
    });
  }

  _drawKeys(centerX, y, keys) {
    const keySize = 36;
    const gap = 6;

    // Calculate total width accounting for wider keys
    let totalWidth = -gap;
    for (const key of keys) {
      const w = key.length > 1 ? keySize * 2.2 : keySize;
      totalWidth += w + gap;
    }
    let x = centerX - totalWidth / 2;

    for (const key of keys) {
      const w = key.length > 1 ? keySize * 2.2 : keySize;

      // Key background
      const bg = this.add.rectangle(x + w / 2, y, w, keySize, 0xffffff, 0.9);
      bg.setStrokeStyle(2, 0x000000);

      // Key label
      this.add
        .text(x + w / 2, y, key, KEY_STYLE)
        .setOrigin(0.5);

      x += w + gap;
    }
  }

  _createBubble(x, y, text) {
    const padding = 12;
    const tailSize = 8;
    const label = this.add.text(0, 0, text, {
      fontFamily: "monospace",
      fontSize: "14px",
      color: "#000000",
    });
    label.setOrigin(0.5, 1);

    const w = label.width + padding * 2;
    const h = label.height + padding * 2;

    const bg = this.add.graphics();
    bg.fillStyle(0xffffff, 1);
    bg.lineStyle(2, 0x000000, 1);
    bg.fillRoundedRect(-w / 2, -h, w, h, 4);
    bg.strokeRoundedRect(-w / 2, -h, w, h, 4);

    const tail = this.add.graphics();
    tail.fillStyle(0xffffff, 1);
    tail.lineStyle(2, 0x000000, 1);
    tail.fillTriangle(-tailSize, 0, tailSize, 0, 0, tailSize);
    tail.lineBetween(-tailSize, 0, 0, tailSize);
    tail.lineBetween(tailSize, 0, 0, tailSize);

    bg.setDepth(10);
    tail.setDepth(10);
    label.setDepth(11);

    bg.setPosition(x, y);
    tail.setPosition(x, y);
    label.setPosition(x, y - padding);

    return { bg, tail, label };
  }

}
