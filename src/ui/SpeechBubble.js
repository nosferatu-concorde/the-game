import { COLORS, STROKE_WIDTH } from '../constants/styles.js';

const PADDING = 12;
const TAIL_SIZE = 8;
const FONT_SIZE = 14;
const DISPLAY_DURATION = 2000; // ms before blink starts
const BLINK_DURATION = 600; // ms of blinking before fully hidden
const BLINK_INTERVAL = 100; // ms per blink toggle

export class SpeechBubble {
  constructor(scene, target, text = '') {
    this.scene = scene;
    this.target = target;

    this.text = scene.add.text(0, 0, text, {
      fontFamily: 'monospace',
      fontSize: `${FONT_SIZE}px`,
      color: '#000000',
      wordWrap: { width: 250 },
    });
    this.text.setOrigin(0.5, 1);

    this.bg = scene.add.graphics();
    this.tail = scene.add.graphics();

    // Ensure text renders above bg
    this.bg.setDepth(10);
    this.tail.setDepth(10);
    this.text.setDepth(11);

    // Invisible collider rect for standing on
    this.collider = scene.add.rectangle(0, 0, 10, 10);
    this.collider.setVisible(false);
    scene.physics.add.existing(this.collider, true);

    this.prevX = 0;
    this.deltaX = 0;
    this.timer = 0;
    this.blinkTimer = 0;
    this.visible = false;
    this.blinking = false;

    if (text) {
      this.setText(text);
    } else {
      this._setVisible(false);
    }
  }

  setText(text) {
    this.text.setText(text);
    this._redraw();
    this.timer = DISPLAY_DURATION;
    this.blinkTimer = 0;
    this.blinking = false;
    this._setVisible(true);
  }

  _setVisible(val) {
    this.visible = val;
    this.bg.setVisible(val);
    this.tail.setVisible(val);
    this.text.setVisible(val);
    this.collider.body.enable = val;
  }

  _redraw() {
    const w = this.text.width + PADDING * 2;
    const h = this.text.height + PADDING * 2;

    this.bg.clear();
    this.bg.fillStyle(COLORS.FILL, 1);
    this.bg.lineStyle(STROKE_WIDTH, COLORS.STROKE, 1);
    this.bg.fillRoundedRect(-w / 2, -h, w, h, 4);
    this.bg.strokeRoundedRect(-w / 2, -h, w, h, 4);

    this.tail.clear();
    this.tail.fillStyle(COLORS.FILL, 1);
    this.tail.lineStyle(STROKE_WIDTH, COLORS.STROKE, 1);
    this.tail.fillTriangle(-TAIL_SIZE, 0, TAIL_SIZE, 0, 0, TAIL_SIZE);
    this.tail.lineBetween(-TAIL_SIZE, 0, 0, TAIL_SIZE);
    this.tail.lineBetween(TAIL_SIZE, 0, 0, TAIL_SIZE);

    // Update collider size to match bubble
    this.collider.setSize(w, h);
    this.collider.body.setSize(w, h);
  }

  update(delta) {
    const x = this.target.x;
    const y = this.target.y - this.target.height / 2 - TAIL_SIZE - 4;

    this.deltaX = x - this.prevX;
    this.prevX = x;

    if (this.timer > 0) {
      this.timer -= delta;
      if (this.timer <= 0) {
        this.blinking = true;
        this.blinkTimer = BLINK_DURATION;
      }
    }

    if (this.blinking) {
      this.blinkTimer -= delta;
      if (this.blinkTimer <= 0) {
        this.blinking = false;
        this._setVisible(false);
      } else {
        const on = Math.floor(this.blinkTimer / BLINK_INTERVAL) % 2 === 0;
        this._setVisible(on);
      }
    }

    this.bg.setPosition(x, y);
    this.tail.setPosition(x, y);
    this.text.setPosition(x, y - PADDING);

    // Position collider at center of bubble
    const h = this.text.height + PADDING * 2;
    this.collider.setPosition(x, y - h / 2);
    this.collider.body.reset(x, y - h / 2);
  }

  destroy() {
    this.bg.destroy();
    this.tail.destroy();
    this.text.destroy();
    this.collider.destroy();
  }
}
