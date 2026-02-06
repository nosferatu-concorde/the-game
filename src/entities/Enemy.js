import { SpeechBubble } from "../ui/SpeechBubble.js";
import { COLORS, STROKE_WIDTH } from "../constants/styles.js";

const WIDTH = 32;
const HEIGHT = 32;
const PATROL_SPEED = 100;
const CHASE_SPEED = 260;
const Y_TOLERANCE = 20; // max vertical difference to count as "same level"
const CHASE_SPIN_SPEED = 0.02; // radians per ms

export class Enemy {
  constructor(scene, x, y, patrolMin, patrolMax) {
    this.scene = scene;
    this.player = null;
    this.patrolMin = patrolMin;
    this.patrolMax = patrolMax;
    this.direction = "right";
    this.chasing = false;
    this.touching = false;

    this.sprite = scene.add.rectangle(x, y, WIDTH, HEIGHT, COLORS.ENEMY_FILL);
    this.sprite.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.setVelocityX(PATROL_SPEED);

    // Direction indicator text
    this.indicator = scene.add.text(x, y, ">", {
      fontFamily: "monospace",
      fontSize: "20px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    this.indicator.setOrigin(0.5, 0.5);

    this.bubble = new SpeechBubble(scene, this.sprite, this._getBubbleText());
  }

  setPlayer(player) {
    this.player = player;
  }

  _isFacingPlayer() {
    if (!this.player) return false;
    const playerX = this.player.sprite.x;
    const playerY = this.player.sprite.y;
    const sameLevel = Math.abs(playerY - this.sprite.y) < Y_TOLERANCE;
    if (!sameLevel) return false;
    if (this.direction === "left" && playerX < this.sprite.x) return true;
    if (this.direction === "right" && playerX > this.sprite.x) return true;
    return false;
  }

  onPlayerContact() {
    this.touching = true;
  }

  _getBubbleText() {
    if (this.touching) {
      return "KILL, KILL, KILL!";
    }
    if (this.chasing) {
      return "computer_overlords\nKILL KILL KILL";
    }
    if (this.direction === "left") {
      return "patrol_left()";
    }
    return "patrol_right()";
  }

  _updateIndicator() {
    this.indicator.setPosition(this.sprite.x, this.sprite.y);
    this.indicator.setText(this.direction === "right" ? ">" : "<");
  }

  update(delta) {
    const body = this.sprite.body;
    const wasChasing = this.chasing;
    const wasTouching = this.touching;
    let newDirection = this.direction;

    this.chasing = this._isFacingPlayer();

    if (this.chasing) {
      // Chase the player
      const speed = CHASE_SPEED;
      if (this.player.sprite.x < this.sprite.x) {
        body.setVelocityX(-speed);
        newDirection = "left";
      } else {
        body.setVelocityX(speed);
        newDirection = "right";
      }
    } else {
      // Patrol
      if (this.sprite.x >= this.patrolMax) {
        body.setVelocityX(-PATROL_SPEED);
        newDirection = "left";
      } else if (this.sprite.x <= this.patrolMin) {
        body.setVelocityX(PATROL_SPEED);
        newDirection = "right";
      }
    }

    if (
      newDirection !== this.direction ||
      wasChasing !== this.chasing ||
      wasTouching !== this.touching
    ) {
      this.direction = newDirection;
      this.bubble.setText(this._getBubbleText());
    }

    // Spin when chasing, reset when patrolling
    if (this.chasing) {
      this.sprite.rotation += CHASE_SPIN_SPEED * delta;
    } else if (this.sprite.rotation !== 0) {
      this.sprite.rotation = 0;
    }

    this._updateIndicator();
    this.bubble.update(delta);

    // Reset touching after bubble text has been updated
    this.touching = false;
  }
}
