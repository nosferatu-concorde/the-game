import { SpeechBubble } from "../ui/SpeechBubble.js";

const WIDTH = 32;
const HEIGHT = 32;
const SCALE = 1.25;
const PATROL_SPEED = 100;
const CHASE_SPEED = 260;
const Y_TOLERANCE = 40; // max vertical difference to count as "same level"

export class Enemy {
  constructor(scene, x, y, patrolMin, patrolMax) {
    this.scene = scene;
    this.player = null;
    this.patrolMin = patrolMin;
    this.patrolMax = patrolMax;
    this.direction = "right";
    this.chasing = false;
    this.touching = false;
    this.patrolFrame = 0;
    this.patrolFrameTimer = 0;

    this.sprite = scene.add.image(x, y, "enemy_patrol1");
    this.sprite.setScale(SCALE);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.setVelocityX(PATROL_SPEED);

    this.bubble = new SpeechBubble(scene, this.sprite);
    this.bubble.setLooping(this._getBubbleText(), 2000);
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

  _setTexture(key) {
    this.sprite.setTexture(key);
  }

  update(delta) {
    const body = this.sprite.body;
    const wasChasing = this.chasing;
    const wasTouching = this.touching;
    let newDirection = this.direction;

    this.chasing = this._isFacingPlayer();

    if (this.chasing) {
      const speed = CHASE_SPEED;
      if (this.player.sprite.x < this.sprite.x) {
        body.setVelocityX(-speed);
        newDirection = "left";
      } else {
        body.setVelocityX(speed);
        newDirection = "right";
      }
    } else {
      if (this.sprite.x >= this.patrolMax) {
        body.setVelocityX(-PATROL_SPEED);
        newDirection = "left";
      } else if (this.sprite.x <= this.patrolMin) {
        body.setVelocityX(PATROL_SPEED);
        newDirection = "right";
      }
    }

    // Clamp to patrol bounds so enemies don't walk off platforms
    if (this.sprite.x <= this.patrolMin) {
      this.sprite.x = this.patrolMin;
      body.setVelocityX(Math.abs(body.velocity.x));
      newDirection = "right";
    } else if (this.sprite.x >= this.patrolMax) {
      this.sprite.x = this.patrolMax;
      body.setVelocityX(-Math.abs(body.velocity.x));
      newDirection = "left";
    }

    if (
      newDirection !== this.direction ||
      wasChasing !== this.chasing ||
      wasTouching !== this.touching
    ) {
      this.direction = newDirection;
      this.bubble.setLooping(this._getBubbleText(), 2000);
    }

    // Immediately switch textures when chase state changes
    if (wasChasing !== this.chasing) {
      this.patrolFrameTimer = 0;
      this.patrolFrame = 0;
      this._setTexture(this.chasing ? "enemy_attack1" : "enemy_patrol1");
    }

    // Animate frames
    this.patrolFrameTimer += delta;
    if (this.patrolFrameTimer >= 150) {
      this.patrolFrameTimer = 0;
      this.patrolFrame = 1 - this.patrolFrame;
      if (this.chasing) {
        this._setTexture(this.patrolFrame === 0 ? "enemy_attack1" : "enemy_attack2");
      } else {
        this._setTexture(this.patrolFrame === 0 ? "enemy_patrol1" : "enemy_patrol2");
      }
    }

    this.sprite.setFlipX(this.direction === "left");
    this.bubble.update(delta);
    this.touching = false;
  }
}
