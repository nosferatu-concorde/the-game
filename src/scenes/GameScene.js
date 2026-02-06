import { Player } from '../entities/Player.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    this.cameras.main.setPostPipeline('CRTPipeline');

    // White background (needed for PostFX pipeline)
    this.add.rectangle(640, 360, 1280, 720, 0xffffff);

    // Ground (always solid)
    const ground = this.add.rectangle(640, 710, 1280, 20, 0xffffff);
    ground.setStrokeStyle(2, 0x000000);
    this.physics.add.existing(ground, true);

    // Platforms (drop-through)
    const platforms = this.physics.add.staticGroup();
    const platformData = [
      { x: 200, y: 550, w: 100 },
      { x: 500, y: 450, w: 200 },
      { x: 900, y: 350, w: 400 },
      { x: 300, y: 300, w: 200 },
      { x: 1050, y: 550, w: 100 },
    ];

    for (const p of platformData) {
      const plat = this.add.rectangle(p.x, p.y, p.w, 20, 0xffffff);
      plat.setStrokeStyle(2, 0x000000);
      platforms.add(plat);
    }

    this.player = new Player(this, 640, 600);

    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(this.player.sprite, platforms, null, (player, platform) => {
      return !this.player.isDropping;
    });
  }

  update(time, delta) {
    this.player.update(time, delta);
  }
}
