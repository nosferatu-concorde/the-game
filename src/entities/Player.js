import Phaser from 'phaser';

export class Player {
  constructor(scene, x, y) {
    this.scene = scene;

    this.sprite = scene.add.rectangle(x, y, 32, 48, 0xffffff);
    this.sprite.setStrokeStyle(2, 0x000000);
    scene.physics.add.existing(this.sprite);
    this.sprite.body.setCollideWorldBounds(true);

    this.cursors = scene.input.keyboard.createCursorKeys();
    this.keys = scene.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      enter: Phaser.Input.Keyboard.KeyCodes.ENTER,
    });
  }

  update() {
    const body = this.sprite.body;

    if (this.cursors.left.isDown || this.keys.a.isDown) {
      body.setVelocityX(-200);
    } else if (this.cursors.right.isDown || this.keys.d.isDown) {
      body.setVelocityX(200);
    } else {
      body.setVelocityX(0);
    }

    const jumpPressed = this.cursors.up.isDown || this.keys.w.isDown || this.keys.space.isDown || this.keys.enter.isDown;
    if (jumpPressed && body.blocked.down) {
      body.setVelocityY(-400);
    }
  }
}
