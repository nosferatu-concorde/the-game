import { SpeechBubble } from '../ui/SpeechBubble.js';

const WIDTH = 32;
const HEIGHT = 32;
const PATROL_SPEED = 100;
const CHASE_SPEED = 160;
const STROKE_WIDTH = 2;
const FILL_COLOR = 0xff0000;
const STROKE_COLOR = 0x000000;
const INDICATOR_SIZE = 6;
const Y_TOLERANCE = 20; // max vertical difference to count as "same level"

export class Enemy {
  constructor(scene, x, y, patrolMin, patrolMax) {
    this.scene = scene;
    this.player = null;
    this.patrolMin = patrolMin;
    this.patrolMax = patrolMax;
    this.direction = 'right';
    this.chasing = false;

    this.sprite = scene.add.rectangle(x, y, WIDTH, HEIGHT, FILL_COLOR);
    this.sprite.setStrokeStyle(STROKE_WIDTH, STROKE_COLOR);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);
    this.sprite.body.setVelocityX(PATROL_SPEED);

    // Direction indicator triangle
    this.indicator = scene.add.triangle(0, 0, 0, 0, INDICATOR_SIZE * 2, INDICATOR_SIZE, 0, INDICATOR_SIZE * 2, STROKE_COLOR);
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
    if (this.direction === 'left' && playerX < this.sprite.x) return true;
    if (this.direction === 'right' && playerX > this.sprite.x) return true;
    return false;
  }

  _getBubbleText() {
    if (this.chasing) {
      return 'IF player.visible\nTHEN chase()';
    }
    if (this.direction === 'left') {
      return 'patrol_left()';
    }
    return 'patrol_right()';
  }

  _updateIndicator() {
    const offsetX = this.direction === 'right' ? WIDTH / 2 + INDICATOR_SIZE + 2 : -(WIDTH / 2 + INDICATOR_SIZE + 2);
    this.indicator.setPosition(this.sprite.x + offsetX, this.sprite.y);
    // Point triangle in movement direction
    this.indicator.setAngle(this.direction === 'right' ? 90 : -90);
  }

  update(delta) {
    const body = this.sprite.body;
    const wasChasing = this.chasing;
    let newDirection = this.direction;

    this.chasing = this._isFacingPlayer();

    if (this.chasing) {
      // Chase the player
      const speed = CHASE_SPEED;
      if (this.player.sprite.x < this.sprite.x) {
        body.setVelocityX(-speed);
        newDirection = 'left';
      } else {
        body.setVelocityX(speed);
        newDirection = 'right';
      }
    } else {
      // Patrol
      if (this.sprite.x >= this.patrolMax) {
        body.setVelocityX(-PATROL_SPEED);
        newDirection = 'left';
      } else if (this.sprite.x <= this.patrolMin) {
        body.setVelocityX(PATROL_SPEED);
        newDirection = 'right';
      }
    }

    if (newDirection !== this.direction || wasChasing !== this.chasing) {
      this.direction = newDirection;
      this.bubble.setText(this._getBubbleText());
    }

    this._updateIndicator();
    this.bubble.update(delta);
  }
}
