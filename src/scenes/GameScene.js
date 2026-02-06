import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
  GROUND_Y,
  PLATFORM_HEIGHT,
} from "../constants/config.js";
import { COLORS, STROKE_WIDTH } from "../constants/styles.js";
import { LEVEL_1 } from "../constants/levels.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  create() {
    this.cameras.main.setPostPipeline("CRTPipeline");

    // White background (needed for PostFX pipeline)
    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, COLORS.BG);

    // Ground (always solid)
    const ground = this.add.rectangle(
      CENTER_X,
      GROUND_Y,
      GAME_WIDTH,
      PLATFORM_HEIGHT,
      COLORS.FILL,
    );
    ground.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
    this.physics.add.existing(ground, true);

    // Platforms (drop-through)
    const platforms = this.physics.add.staticGroup();
    for (const p of LEVEL_1.platforms) {
      const plat = this.add.rectangle(
        p.x,
        p.y,
        p.w,
        PLATFORM_HEIGHT,
        COLORS.FILL,
      );
      plat.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
      platforms.add(plat);
    }

    // Goal area
    const goal = this.add.rectangle(
      LEVEL_1.goal.x,
      LEVEL_1.goal.y,
      LEVEL_1.goal.w,
      LEVEL_1.goal.h,
      COLORS.GOAL_FILL,
    );
    goal.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
    this.physics.add.existing(goal, true);

    this.player = new Player(
      this,
      LEVEL_1.playerSpawn.x,
      LEVEL_1.playerSpawn.y,
    );

    // Enemies
    this.enemies = LEVEL_1.enemies.map(
      (e) => new Enemy(this, e.x, e.y, e.patrolMin, e.patrolMax),
    );

    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(
      this.player.sprite,
      platforms,
      () => {
        if (this.player.sprite.body.blocked.up) {
          this.cameras.main.shake(200, 0.004, false);
        }
      },
      () => {
        return !this.player.isDropping;
      },
    );

    // Goal overlap
    this.physics.add.overlap(this.player.sprite, goal, () => {
      if (!this.goalReached) {
        this.goalReached = true;
        this.player.bubble.setText("LEVEL\nCOMPLETE!");
      }
    });

    // Store platforms for bubble collision checking
    this.platformGroup = platforms;

    // Give enemies a reference to the player
    for (const enemy of this.enemies) {
      enemy.setPlayer(this.player);
    }

    // Enemy colliders
    for (const enemy of this.enemies) {
      this.physics.add.collider(enemy.sprite, ground);
      this.physics.add.collider(enemy.sprite, platforms);
      this.physics.add.overlap(this.player.sprite, enemy.sprite, () => {
        enemy.onPlayerContact();
        this.scene.restart();
      });
      this.physics.add.collider(
        this.player.sprite,
        enemy.bubble.collider,
        () => {
          // Carry player along with the moving bubble
          this.player.sprite.x += enemy.bubble.deltaX;
        },
        () => {
          // Only collide when player is above the bubble (landing on top)
          const playerBottom = this.player.sprite.body.bottom;
          const bubbleTop = enemy.bubble.collider.body.top;
          return this.player.sprite.body.velocity.y >= 0 && playerBottom <= bubbleTop + 8;
        },
      );
    }
  }

  update(time, delta) {
    const grounded = this.player.sprite.body.blocked.down;
    if (!this.wasGrounded && grounded) {
      this.cameras.main.shake(200, 0.004, false);
    }
    this.wasGrounded = grounded;
    this.player.update(time, delta);
    const anyChasing = this.enemies.some((e) => e.chasing);
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    // Slight screen shake while any enemy is chasing
    if (anyChasing) {
      this.cameras.main.shake(100, 0.002, false);
    }

    // Push bubbles out of platforms
    const playerBubbleHit = this._clampBubble(this.player.bubble);
    if (playerBubbleHit && this.player.sprite.body.velocity.y < 0) {
      this.player.sprite.body.velocity.y = 0;
      this.player.sprite.y += playerBubbleHit;
      this.cameras.main.shake(200, 0.004, false);
    }
    for (const enemy of this.enemies) {
      this._clampBubble(enemy.bubble);
    }
  }

  _clampBubble(bubble) {
    if (!bubble.visible) return 0;
    const b = bubble.getBounds();
    for (const plat of this.platformGroup.getChildren()) {
      const p = plat.body;
      if (b.right > p.left && b.left < p.right && b.top < p.bottom && b.bottom > p.top) {
        const offset = p.bottom - b.top;
        bubble.applyOffset(0, offset);
        return offset;
      }
    }
    return 0;
  }
}
