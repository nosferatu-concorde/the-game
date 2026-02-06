import { Player } from '../entities/Player.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    const ground = this.add.rectangle(640, 710, 1280, 20, 0xffffff);
    ground.setStrokeStyle(2, 0x000000);
    this.physics.add.existing(ground, true);

    this.player = new Player(this, 640, 600);

    this.physics.add.collider(this.player.sprite, ground);
  }

  update() {
    this.player.update();
  }
}
