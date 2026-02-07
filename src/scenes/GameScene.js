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
import { LEVEL_1, LEVEL_2 } from "../constants/levels.js";
import { SpeechBubble } from "../ui/SpeechBubble.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("goal", "goal.png");
    this.load.image("saw", "saw.png");
    this.load.image("player", "player.png");

    // Pre-generate robot blood particle texture
    const gfx = this.add.graphics();
    gfx.fillStyle(0x000000);
    gfx.lineStyle(1, 0x000000);
    gfx.fillRect(0, 0, 6, 6);
    gfx.strokeRect(0, 0, 6, 6);
    gfx.generateTexture("robot_blood", 6, 6);
    gfx.destroy();
  }

  init(data) {
    this.currentLevel = data.level || 1;
  }

  create() {
    this.isDead = false;
    this.goalReached = false;
    this.goalLanded = false;
    this.spinActivated = false;
    this.wasGrounded = false;
    this.sawDeath = null;
    this.sawDeathTimer = 0;
    this.chaseShakeCooldown = 0;

    const LEVELS = { 1: LEVEL_1, 2: LEVEL_2 };
    const levelData = LEVELS[this.currentLevel] || LEVEL_1;

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
    this.platBubbles = [];
    for (let i = 0; i < levelData.platforms.length; i++) {
      const p = levelData.platforms[i];
      const plat = this.add.rectangle(
        p.x,
        p.y,
        p.w,
        PLATFORM_HEIGHT,
        COLORS.FILL,
      );
      plat.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
      platforms.add(plat);
      const bubble = new SpeechBubble(this, plat, "", { minWidth: p.w });
      this.platBubbles.push(bubble);
    }
    this.currentPlatBubble = 0;
    this.platBubbles[0].setText("console.log(PLATFORM)");

    // Spinning platform (solid, not drop-through)
    const sp = levelData.spinPlatform;
    this.spinPlat = this.add.rectangle(sp.x, sp.y, sp.w, PLATFORM_HEIGHT, COLORS.FILL);
    this.spinPlat.setStrokeStyle(STROKE_WIDTH, COLORS.STROKE);
    this.physics.add.existing(this.spinPlat, true);

    // Goal sits on spinning platform (dynamic but frozen until spin)
    const g = levelData.goal;
    this.goalObj = this.add.sprite(g.x, g.y, "goal");
    this.goalObj.setDisplaySize(g.w, g.h);
    this.physics.add.existing(this.goalObj, false);
    this.goalObj.body.setAllowGravity(false);
    this.goalObj.body.setImmovable(true);

    this.player = new Player(
      this,
      levelData.playerSpawn.x,
      levelData.playerSpawn.y,
    );

    // Enemies - base enemies plus extras based on level
    this.enemies = levelData.enemies.map(
      (e) => new Enemy(this, e.x, e.y, e.patrolMin, e.patrolMax),
    );

    // Add extra enemies based on level number
    const extraEnemies = this.currentLevel - 1;
    for (let i = 0; i < extraEnemies; i++) {
      const sectionWidth = GAME_WIDTH / (extraEnemies + 1);
      const x = sectionWidth * (i + 0.5);
      const patrolMin = Math.max(50, x - 150);
      const patrolMax = Math.min(GAME_WIDTH - 50, x + 150);
      this.enemies.push(new Enemy(this, x, 680, patrolMin, patrolMax));
    }

    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(
      this.player.sprite,
      platforms,
      () => {
        if (this.player.sprite.body.blocked.up) {
          this.cameras.main.shake(150, 0.002, false);
        }
      },
      () => {
        return !this.player.isDropping;
      },
    );

    // Player bumps spinning platform from below
    this.physics.add.collider(this.player.sprite, this.spinPlat, () => {
      if (this.player.sprite.body.velocity.y < 0 && !this.spinActivated) {
        this._activateSpinPlatform();
      }
    });

    // Goal collides with ground and platforms when it falls
    const goalLanded = () => {
      if (this.spinActivated && !this.goalLanded) {
        this.goalLanded = true;
        this.cameras.main.shake(200, 0.003, false);
      }
    };
    this.physics.add.collider(this.goalObj, ground, goalLanded);
    this.physics.add.collider(this.goalObj, platforms, goalLanded);

    // Goal overlap with player
    this.physics.add.overlap(this.player.sprite, this.goalObj, () => {
      if (!this.goalReached) {
        this.goalReached = true;
        this._levelComplete();
      }
    });

    // Circular saws (move in rectangle around platform)
    this.saws = levelData.saws.map((s) => {
      const sawRadius = 42;
      const pad = s.padding + sawRadius;
      const hw = s.w / 2 + pad;
      const hh = PLATFORM_HEIGHT / 2 + pad;
      const rectW = hw * 2;
      const rectH = hh * 2;
      const perimeter = (rectW + rectH) * 2;

      const sawImage = this.add.image(s.x - hw, s.y - hh, "saw");
      sawImage.setDisplaySize(84, 84);

      const sawZone = this.add.zone(s.x - hw, s.y - hh, 84, 84);
      this.physics.add.existing(sawZone, false);
      sawZone.body.setAllowGravity(false);
      sawZone.body.moves = false;
      sawZone.body.setCircle(42);

      const bubble = new SpeechBubble(this, sawImage, "while(true)\n  keep_going()");
      this.physics.add.overlap(this.player.sprite, sawZone, () => {
        this._playerSawDie(sawImage);
      });
      return {
        sprite: sawImage,
        hitbox: sawZone,
        bubble,
        bubbleCooldown: 0,
        dist: 0,
        cx: s.x,
        cy: s.y,
        hw,
        hh,
        rectW,
        rectH,
        perimeter,
        speed: s.speed,
      };
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
        this._playerDie();
      });
    }

    // All speech bubbles are standable (top-only, with carry)
    this.allBubbles = [
      this.player.bubble,
      ...this.platBubbles,
      ...this.enemies.map((e) => e.bubble),
      ...this.saws.map((s) => s.bubble),
    ];
    for (const bubble of this.allBubbles) {
      this.physics.add.collider(
        this.player.sprite,
        bubble.collider,
        () => {
          this.player.sprite.x += bubble.deltaX;
        },
        () => {
          const playerBottom = this.player.sprite.body.bottom;
          const bubbleTop = bubble.collider.body.top;
          return this.player.sprite.body.velocity.y >= 0 && playerBottom <= bubbleTop + 8;
        },
      );
    }
  }

  update(time, delta) {
    if (this.sawDeath) {
      this.sawDeathTimer -= delta;
      this.sawDeath.rotation += 0.03 * delta;
      this.cameras.main.shake(100, 0.008, false);

      const px = this.player.sprite.x;
      const py = this.player.sprite.y;
      const sx = this.sawDeath.x;
      const sy = this.sawDeath.y;
      const t = 2 * delta / 1000;
      this.player.sprite.x += (sx - px) * t;
      this.player.sprite.y += (sy - py) * t;
      const pcY = this.player.sprite.y - this.player.sprite.displayHeight * this.player.sprite.originY + this.player.sprite.displayHeight / 2;
      this.sawParticles.setPosition(this.player.sprite.x, pcY);

      if (this.sawDeathTimer <= 0) {
        this._playerDie();
      }
      return;
    }

    const grounded = this.player.sprite.body.blocked.down;
    if (!this.wasGrounded && grounded) {
      this.cameras.main.shake(150, 0.002, false);
    }
    this.wasGrounded = grounded;
    this.player.update(time, delta);
    const anyChasing = this.enemies.some((e) => e.chasing);
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    // Platform speech bubble chain (loops)
    const current = this.platBubbles[this.currentPlatBubble];
    current.update(delta);
    if (!current.visible && !current.blinking) {
      this.currentPlatBubble = (this.currentPlatBubble + 1) % this.platBubbles.length;
      this.platBubbles[this.currentPlatBubble].setText("console.log(PLATFORM)");
    }

    // Slight screen shake while any enemy is chasing
    this.chaseShakeCooldown -= delta;
    if (anyChasing && this.chaseShakeCooldown <= 0) {
      this.cameras.main.shake(200, 0.001, false);
      this.chaseShakeCooldown = 200;
    }

    // Update saws (rectangular path around platform)
    for (const saw of this.saws) {
      saw.dist = (saw.dist + saw.speed * delta) % saw.perimeter;
      const d = saw.dist;
      let x, y;
      if (d < saw.rectW) {
        // Top edge: left to right
        x = saw.cx - saw.hw + d;
        y = saw.cy - saw.hh;
      } else if (d < saw.rectW + saw.rectH) {
        // Right edge: top to bottom
        x = saw.cx + saw.hw;
        y = saw.cy - saw.hh + (d - saw.rectW);
      } else if (d < saw.rectW * 2 + saw.rectH) {
        // Bottom edge: right to left
        x = saw.cx + saw.hw - (d - saw.rectW - saw.rectH);
        y = saw.cy + saw.hh;
      } else {
        // Left edge: bottom to top
        x = saw.cx - saw.hw;
        y = saw.cy + saw.hh - (d - saw.rectW * 2 - saw.rectH);
      }
      saw.sprite.x = x;
      saw.sprite.y = y;
      saw.hitbox.x = x;
      saw.hitbox.y = y;
      saw.sprite.rotation += 0.01 * delta;
      if (!saw.bubble.visible) {
        saw.bubbleCooldown -= delta;
        if (saw.bubbleCooldown <= 0) {
          saw.bubble.setText("while(true)\n  keep_going()");
          saw.bubbleCooldown = 2000;
        }
      }
      saw.bubble.update(delta);
    }

    // Push bubbles out of platforms
    const playerBubbleHit = this._clampBubble(this.player.bubble, true);
    if (playerBubbleHit && this.player.sprite.body.velocity.y < 0) {
      this.player.sprite.body.velocity.y = 0;
      this.player.sprite.y += playerBubbleHit;
      this.cameras.main.shake(150, 0.002, false);
    }
    for (const enemy of this.enemies) {
      this._clampBubble(enemy.bubble);
    }
  }

  _playerSawDie(sawSprite) {
    if (this.isDead) return;
    this.isDead = true;
    this.physics.pause();
    this.sawDeath = sawSprite;
    this.sawDeathTimer = 1000;
    this.player.sprite.setDepth(25);

    const playerCenterY = this.player.sprite.y - this.player.sprite.displayHeight * this.player.sprite.originY + this.player.sprite.displayHeight / 2;
    this.sawParticles = this.add.particles(this.player.sprite.x, playerCenterY, "robot_blood", {
      speedX: { onEmit: () => { const s = Phaser.Math.Between(50, 400); return Math.random() < 0.5 ? -s : s; } },
      speedY: { onEmit: () => { const s = Phaser.Math.Between(50, 400); return Math.random() < 0.5 ? -s : s; } },
      emitZone: { type: 'random', source: new Phaser.Geom.Circle(0, 0, 50) },
      scale: { start: 1.5, end: 0.2 },
      alpha: 1,
      lifespan: { min: 500, max: 1000 },
      frequency: 10,
      quantity: 8,
      rotate: { min: 0, max: 360 },
      accelerationY: 200,
    });
    this.sawParticles.setDepth(5);
    this.sawDeath.setDepth(20);

    const cam = this.cameras.main;
    cam.pan(sawSprite.x, sawSprite.y, 800, 'Sine.easeInOut');
    cam.zoomTo(3, 800, 'Sine.easeInOut');

    for (const bubble of this.allBubbles) {
      bubble._setVisible(false);
    }
  }

  _playerDie() {
    if (this.isDead && !this.sawDeath) return;
    this.isDead = true;
    if (this.sawParticles) {
      this.sawParticles.destroy();
      this.sawParticles = null;
    }
    this.sawDeath = null;
    this.physics.pause();

    const cam = this.cameras.main;
    cam.stopFollow();
    cam.pan(CENTER_X, CENTER_Y, 0);
    cam.zoomTo(1, 0);

    const overlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000);
    overlay.setDepth(99);

    const deathText = this.add.text(CENTER_X, CENTER_Y, "IF DEAD DEAD", {
      fontFamily: "monospace",
      fontSize: "120px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    deathText.setOrigin(0.5);
    deathText.setDepth(100);

    this.time.delayedCall(200, () => {
      this.scene.restart({ level: this.currentLevel });
    });
  }

  _levelComplete() {
    this.physics.pause();

    const overlay = this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, 0x000000);
    overlay.setDepth(99);

    const nextLevel = this.currentLevel + 1;
    const levelText = this.add.text(CENTER_X, CENTER_Y, String(nextLevel), {
      fontFamily: "monospace",
      fontSize: "500px",
      color: "#ffffff",
      fontStyle: "bold",
    });
    levelText.setOrigin(0.5);
    levelText.setDepth(100);

    this.time.delayedCall(200, () => {
      this.scene.restart({ level: nextLevel });
    });
  }

  _activateSpinPlatform() {
    this.spinActivated = true;
    this.cameras.main.shake(200, 0.003, false);

    // Disable platform collision
    this.spinPlat.body.enable = false;

    // Spin the platform visual
    this.tweens.add({
      targets: this.spinPlat,
      rotation: Math.PI * 4,
      duration: 2000,
      ease: "Cubic.easeOut",
    });

    // Release the goal — let it fall
    this.goalObj.body.setAllowGravity(true);
    this.goalObj.body.setImmovable(false);
  }

  _clampBubble(bubble, triggerSpin = false) {
    if (!bubble.visible) return 0;
    const b = bubble.getBounds();

    // Check spinning platform
    if (!this.spinActivated && this.spinPlat.body.enable) {
      const p = this.spinPlat.body;
      if (b.right > p.left && b.left < p.right && b.top < p.bottom && b.bottom > p.top) {
        const offset = p.bottom - b.top;
        bubble.applyOffset(0, offset);
        if (triggerSpin) {
          this._activateSpinPlatform();
        }
        return offset;
      }
    }

    // Check regular platforms
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
