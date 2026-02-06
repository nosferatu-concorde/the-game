import Phaser from 'phaser';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    // Example game object: black rectangle with white fill and black border
    const rect = this.add.rectangle(640, 360, 100, 100, 0xffffff);
    rect.setStrokeStyle(2, 0x000000);
  }
}
