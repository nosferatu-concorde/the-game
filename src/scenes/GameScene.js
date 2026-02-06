import { Player } from '../entities/Player.js';
import { Enemy } from '../entities/Enemy.js';
import { GAME_WIDTH, GAME_HEIGHT, CENTER_X, CENTER_Y, GROUND_Y, PLATFORM_HEIGHT } from '../constants/config.js';
import { COLORS, STROKE_WIDTH } from '../constants/styles.js';
import { LEVEL_1 } from '../constants/levels.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setPostPipeline('CRTPipeline');

    // White background (needed for PostFX pipeline)
    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, COLORS.BG);

    // Ground (always solid)
    const ground = this.add.rectangle(CENTER_X, GROUND_Y, GAME_WIDTH, PLATFORM_HEIGHT, COLORS.FILL);
    ground.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
    this.physics.add.existing(ground, true);

    // Platforms (drop-through)
    const platforms = this.physics.add.staticGroup();
    for (const p of LEVEL_1.platforms) {
      const plat = this.add.rectangle(p.x, p.y, p.w, PLATFORM_HEIGHT, COLORS.FILL);
      plat.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
      platforms.add(plat);
    }

    this.player = new Player(this, LEVEL_1.playerSpawn.x, LEVEL_1.playerSpawn.y);

    // Enemies
    this.enemies = LEVEL_1.enemies.map(
      (e) => new Enemy(this, e.x, e.y, e.patrolMin, e.patrolMax)
    );

    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(this.player.sprite, platforms, null, () => {
      return !this.player.isDropping;
    });

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
      });
      this.physics.add.collider(this.player.sprite, enemy.bubble.collider, () => {
        // Carry player along with the moving bubble
        this.player.sprite.x += enemy.bubble.deltaX;
      });
    }
  }

  update(time, delta) {
    this.player.update(time, delta);
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }
  }
}
