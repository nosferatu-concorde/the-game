import Phaser from "phaser";
import { SpeechBubble } from "../ui/SpeechBubble.js";

const WIDTH = 32;
const HEIGHT = 48;
const MOVE_SPEED = 360;
const JUMP_VELOCITY = -700;
const STROKE_WIDTH = 2;
const COYOTE_TIME = 100; // ms after leaving ground where jump is still allowed
const IDLE_DELAY = 1000; // ms before idle starts
const IDLE_FRAME_DURATION = 400; // ms per frame
const SQUISH_WIDTH = WIDTH + 2;
const SQUISH_HEIGHT = HEIGHT - 4;
const FILL_COLOR = 0xffffff;
const STROKE_COLOR = 0x000000;

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.coyoteTimer = 0;
    this.isDropping = false;
    this.idle = false;
    this.stillTimer = 0;
    this.idleAnimTimer = 0;
    this.idleFrame = 0;

    this.sprite = scene.add.rectangle(x, y, WIDTH, HEIGHT, FILL_COLOR);
    this.sprite.setStrokeStyle(STROKE_WIDTH, STROKE_COLOR);
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

    if (this.cursors.left.isDown || this.keys.a.isDown) {
      body.setVelocityX(-MOVE_SPEED);
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      body.setVelocityX(MOVE_SPEED);
    } else {
      body.setVelocityX(0);
    }

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
      this.bubble.setText("IF (idle)\n  start.idling()");
    }

    // Idle squish animation
    if (this.idle) {
      this.idleAnimTimer += delta;
      const newFrame = Math.floor(this.idleAnimTimer / IDLE_FRAME_DURATION) % 2;
      if (newFrame !== this.idleFrame) {
        this.idleFrame = newFrame;
        if (this.idleFrame === 1) {
          this.sprite.setSize(SQUISH_WIDTH, SQUISH_HEIGHT);
          this.sprite.y += (HEIGHT - SQUISH_HEIGHT) / 2;
          body.setSize(SQUISH_WIDTH, SQUISH_HEIGHT);
        } else {
          this.sprite.y -= (HEIGHT - SQUISH_HEIGHT) / 2;
          this.sprite.setSize(WIDTH, HEIGHT);
          body.setSize(WIDTH, HEIGHT);
        }
      }
    } else if (wasIdle) {
      if (this.idleFrame === 1) {
        this.sprite.y -= (HEIGHT - SQUISH_HEIGHT) / 2;
      }
      this.sprite.setSize(WIDTH, HEIGHT);
      body.setSize(WIDTH, HEIGHT);
      this.idleAnimTimer = 0;
      this.idleFrame = 0;
    }

    this.bubble.update(delta);
  }
}
