import Phaser from "phaser";
import { SpeechBubble } from "../ui/SpeechBubble.js";
import { PLAYER_IDLE } from "../constants/dialogue.js";

const WIDTH = 44;
const HEIGHT = 126;
const MOVE_SPEED = 360;
const JUMP_VELOCITY = -700;
const COYOTE_TIME = 100; // ms after leaving ground where jump is still allowed
const IDLE_DELAY = 1000; // ms before idle starts
const IDLE_FRAME_DURATION = 400; // ms per frame
const LEAN_ANGLE = 0.28; // ~10 degrees
const LEAN_SPEED = 8; // lerp speed


export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.coyoteTimer = 0;
    this.isDropping = false;
    this.idle = false;
    this.stillTimer = 0;
    this.idleAnimTimer = 0;
    this.idleFrame = 0;

    this.sprite = scene.add.image(x, y, "player");
    this.sprite.setOrigin(0.5, 1);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });

    this.bubble = new SpeechBubble(scene, this.sprite);
  }

  update(time, delta) {
    const body = this.sprite.body;

    let targetLean = 0;
    if (this.cursors.left.isDown || this.keys.a.isDown) {
      body.setVelocityX(-MOVE_SPEED);
      this.sprite.setFlipX(true);
      targetLean = -LEAN_ANGLE;
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      body.setVelocityX(MOVE_SPEED);
      this.sprite.setFlipX(false);
      targetLean = LEAN_ANGLE;
    } else {
      body.setVelocityX(0);
    }

    const t = Math.min(1, LEAN_SPEED * delta / 1000);
    this.sprite.rotation += (targetLean - this.sprite.rotation) * t;

    const dropPressed = this.cursors.down.isDown || this.keys.s.isDown;
    if (dropPressed && body.blocked.down) {
      this.isDropping = true;
      body.setVelocityY(50);
    }
    if (!body.blocked.down && !dropPressed) {
      this.isDropping = false;
    }

    if (body.blocked.down) {
      this.coyoteTimer = COYOTE_TIME;
    } else {
      this.coyoteTimer -= delta;
    }

    const jumpPressed =
      this.cursors.up.isDown ||
      this.keys.w.isDown ||
      this.keys.space.isDown ||
      this.keys.enter.isDown;
    if (jumpPressed && this.coyoteTimer > 0) {
      body.setVelocityY(JUMP_VELOCITY);
      this.coyoteTimer = 0;
      this.scene.sound.play("jump", { rate: 0.6, detune: -600, volume: 0.45 });
    }

    const wasIdle = this.idle;
    const still =
      body.blocked.down && body.velocity.x === 0 && body.velocity.y === 0;

    if (still) {
      this.stillTimer += delta;
    } else {
      this.stillTimer = 0;
    }

    this.idle = still && this.stillTimer >= IDLE_DELAY;
    if (this.idle && !wasIdle) {
      this.bubble.setText(PLAYER_IDLE);
    }

    if (this.idle) {
      this.idleAnimTimer += delta;
      const newFrame = Math.floor(this.idleAnimTimer / IDLE_FRAME_DURATION) % 2;
      if (newFrame !== this.idleFrame) {
        this.idleFrame = newFrame;
        const baseScale = 1;
        if (this.idleFrame === 1) {
          this.sprite.setScale(baseScale + 4 / this.sprite.width, baseScale - 4 / this.sprite.height);
        } else {
          this.sprite.setScale(baseScale);
        }
      }
    } else if (wasIdle) {
      this.sprite.setScale(1);
      this.idleAnimTimer = 0;
      this.idleFrame = 0;
    }

    this.bubble.update(delta);
  }
}
