import { Player } from "../entities/Player.js";
import { Enemy } from "../entities/Enemy.js";
import {
  GAME_WIDTH,
  GAME_HEIGHT,
  CENTER_X,
  CENTER_Y,
  GROUND_Y,
  PLATFORM_HEIGHT,
  GRAVITY,
} from "../constants/config.js";
import { COLORS, STROKE_WIDTH } from "../constants/styles.js";
import {
  LEVEL_1,
  LEVEL_2,
  LEVEL_3,
  LEVEL_4,
  LEVEL_5,
  LEVEL_6,
  LEVEL_7,
  LEVEL_8,
  LEVEL_9,
  LEVEL_10,
} from "../constants/levels.js";
import { SpeechBubble } from "../ui/SpeechBubble.js";
import { zoomTo, zoomReset } from "../utils/cameraZoom.js";
import { CRTPipeline } from "../shaders/CRTPipeline.js";
import { particleBurst } from "../utils/particleBurst.js";
import { SAW_LOOP, DEATH_TEXT, HALFWAY_MESSAGE, END_MESSAGE } from "../constants/dialogue.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene");
  }

  preload() {
    this.load.image("goal", "heart.png");
    this.load.image("saw", "saw.png");
    this.load.image("ground", "ground.png");
    this.load.image("player", "player.png");
    this.load.image("enemy_patrol1", "enemy_patrol1.png");
    this.load.image("enemy_patrol2", "enemy_patrol2.png");
    this.load.image("enemy_attack1", "enemy_attack1.png");
    this.load.image("enemy_attack2", "enemy_attack2.png");
    this.load.audio("saw_sfx", "saw.mp3");
    this.load.audio("error", "error.mp3");
    this.load.audio("falling_heart", "falling-heart.mp3");
    this.load.audio("impact", "impact.mp3");

    // Pre-generate robot blood particle texture
    const gfx = this.add.graphics();
    gfx.fillStyle(0x000000);
    gfx.lineStyle(1, 0x000000);
    gfx.fillRect(0, 0, 6, 6);
    gfx.strokeRect(0, 0, 6, 6);
    gfx.generateTexture("robot_blood", 6, 6);
    gfx.destroy();

    // Generate diagonal stripe texture for platforms
    const size = 32;
    const stripeGfx = this.add.graphics();
    // White background
    stripeGfx.fillStyle(0xffffff);
    stripeGfx.fillRect(0, 0, size, size);
    // Dark yellow candy stripes
    stripeGfx.lineStyle(4, 0xc4b060);
    for (let i = -size; i < size * 2; i += 10) {
      stripeGfx.lineBetween(i, 0, i + size, size);
    }
    stripeGfx.generateTexture("platform_stripes", size, size);
    stripeGfx.destroy();
  }

  init(data) {
    this.currentLevel = data.level || 1;
  }

  create() {
    this.sawSound?.stop();
    if (this.impactSound?.isPlaying) {
      this.tweens.add({
        targets: this.impactSound,
        volume: 0,
        duration: 700,
        onComplete: () => this.impactSound?.stop(),
      });
    }
    this.isDead = false;
    this.goalReached = false;
    this.spinActivated = false;
    this.wasGrounded = false;
    this.sawDeath = null;
    this.sawDeathTimer = 0;
    this.chaseShakeCooldown = 0;
    this.halfwayWaiting = false;
    this.sawSound = this.sound.add("saw_sfx");
    this.impactSound = this.sound.add("impact");
    this.errorSound = this.sound.add("error");
    this.fallingHeartSound = this.sound.add("falling_heart");

    const LEVELS = {
      1: LEVEL_1,
      2: LEVEL_2,
      3: LEVEL_3,
      4: LEVEL_4,
      5: LEVEL_5,
      6: LEVEL_6,
      7: LEVEL_7,
      8: LEVEL_8,
      9: LEVEL_9,
      10: LEVEL_10,
    };
    const levelData = LEVELS[this.currentLevel] || LEVEL_1;

    // Background (needed for PostFX pipeline)
    this.add.rectangle(CENTER_X, CENTER_Y, GAME_WIDTH, GAME_HEIGHT, COLORS.BG);
    this.cameras.main.setPostPipeline(CRTPipeline);

    // Ground (always solid)
    const ground = this.add
      .image(CENTER_X, GAME_HEIGHT, "ground")
      .setOrigin(0.5, 1);
    this.physics.add.existing(ground, true);

    // Platforms (drop-through)
    const platforms = this.physics.add.staticGroup();
    this.platformTileSprites = [];
    for (let i = 0; i < levelData.platforms.length; i++) {
      const p = levelData.platforms[i];
      const plat = this.add.tileSprite(
        p.x,
        p.y,
        p.w,
        PLATFORM_HEIGHT,
        "platform_stripes",
      );
      platforms.add(plat);
      this.platformTileSprites.push(plat);
      // Stroke border overlay
      const border = this.add.graphics();
      border.lineStyle(STROKE_WIDTH, COLORS.STROKE);
      border.strokeRect(p.x - p.w / 2, p.y - PLATFORM_HEIGHT / 2, p.w, PLATFORM_HEIGHT);
      plat._border = border;
    }

    // Spinning platform (solid, not drop-through)
    const sp = levelData.spinPlatform;
    this.spinPlat = this.add.tileSprite(
      sp.x,
      sp.y,
      sp.w,
      PLATFORM_HEIGHT,
      "platform_stripes",
    );
    this.physics.add.existing(this.spinPlat, true);
    this.platformTileSprites.push(this.spinPlat);
    // Stroke border for spin platform (as a child-like graphics that follows it)
    this.spinPlatBorder = this.add.graphics();
    this.spinPlatBorder.lineStyle(STROKE_WIDTH, COLORS.STROKE);
    this.spinPlatBorder.strokeRect(-sp.w / 2, -PLATFORM_HEIGHT / 2, sp.w, PLATFORM_HEIGHT);
    this.spinPlatBorder.setPosition(sp.x, sp.y);
    this.spinPlat._border = this.spinPlatBorder;

    // Goal bounces on surfaces, falls when airborne
    const g = levelData.goal;
    const GOAL_HOVER = 30;
    this.goalObj = this.add.sprite(g.x, g.y, "goal");
    this.goalObj.setTint(0xff1493);
    this.physics.add.existing(this.goalObj, false);
    this.goalObj.body.setSize(
      this.goalObj.width,
      this.goalObj.height + GOAL_HOVER,
    );
    this.goalObj.body.setGravityY(-GRAVITY * 0.8);

    this.player = new Player(
      this,
      levelData.playerSpawn.x,
      levelData.playerSpawn.y,
    );

    // Enemies - base enemies plus extras based on level
    this.enemies = levelData.enemies.map(
      (e) => new Enemy(this, e.x, e.y, e.patrolMin, e.patrolMax),
    );

    this.physics.add.collider(this.player.sprite, ground);
    this.physics.add.collider(
      this.player.sprite,
      platforms,
      (playerSprite, platform) => {
        if (this.player.sprite.body.blocked.up) {
          this.cameras.main.shake(150, 0.002, false);
          this.errorSound.play();
        }
        if (!this.wasGrounded) {
          this._platformBounce(platform);
        }
      },
      () => {
        return !this.player.isDropping;
      },
    );

    // Player bumps spinning platform from below
    this.physics.add.collider(this.player.sprite, this.spinPlat, () => {
      if (this.player.sprite.body.velocity.y < 0 && !this.spinActivated && this.player.sprite.body.blocked.up) {
        this._activateSpinPlatform();
        this.errorSound.play();
      }
      if (!this.wasGrounded) {
        this._platformBounce(this.spinPlat);
      }
    });

    // Goal bounces on any surface
    const goalBounceGravity = GRAVITY * 0.2;
    const bounceVel = -Math.sqrt(2 * goalBounceGravity * 10);
    const goalBounce = () => {
      this.goalObj.body.setGravityY(-GRAVITY * 0.8);
      this.goalObj.body.setVelocityY(bounceVel);
    };
    this.physics.add.collider(this.goalObj, ground, goalBounce);
    this.physics.add.collider(this.goalObj, platforms, goalBounce);
    this.physics.add.collider(this.goalObj, this.spinPlat, goalBounce);

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

      const bubble = new SpeechBubble(this, sawImage);
      bubble.setLooping(SAW_LOOP, 2000);
      this.physics.add.overlap(this.player.sprite, sawZone, () => {
        this._playerSawDie(sawImage);
      });
      return {
        sprite: sawImage,
        hitbox: sawZone,
        bubble,
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

    // Moving platforms (dynamic but immovable)
    this.movingPlatforms = (levelData.movingPlatforms || []).map((mp) => {
      const plat = this.add.tileSprite(
        mp.x,
        mp.y,
        mp.w,
        PLATFORM_HEIGHT,
        "platform_stripes",
      );
      this.physics.add.existing(plat, false);
      plat.body.setImmovable(true);
      plat.body.setAllowGravity(false);
      plat.body.setFriction(1);
      this.platformTileSprites.push(plat);
      // Stroke border that follows the moving platform
      const border = this.add.graphics();
      border.lineStyle(STROKE_WIDTH, COLORS.STROKE);
      border.strokeRect(-mp.w / 2, -PLATFORM_HEIGHT / 2, mp.w, PLATFORM_HEIGHT);
      border.setPosition(mp.x, mp.y);
      return {
        sprite: plat,
        border,
        minX: mp.minX,
        maxX: mp.maxX,
        speed: mp.speed,
        dir: 1,
      };
    });

    // Moving platform colliders
    for (const mp of this.movingPlatforms) {
      this.physics.add.collider(
        this.player.sprite,
        mp.sprite,
        () => {
          if (this.player.sprite.body.blocked.up) {
            this.cameras.main.shake(150, 0.002, false);
          }
          if (!this.wasGrounded) {
            this._platformBounce(mp.sprite);
          }
        },
        () => !this.player.isDropping,
      );
      this.physics.add.collider(this.goalObj, mp.sprite, goalBounce);
    }

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
      for (const mp of this.movingPlatforms) {
        this.physics.add.collider(enemy.sprite, mp.sprite);
      }
      this.physics.add.overlap(this.player.sprite, enemy.sprite, () => {
        enemy.onPlayerContact();
        this._playerEnemyDie(enemy.sprite);
      });
    }

    // Hearts UI (top right) — level progression
    this.hearts = [];
    for (let i = 0; i < 10; i++) {
      const heart = this.add.sprite(GAME_WIDTH - 30 - i * 30, 25, "goal");
      heart.setScale(0.5);
      heart.setDepth(200);
      heart.setScrollFactor(0);
      const levelNum = 10 - i;
      if (levelNum < this.currentLevel) {
        heart.setTint(0xff1493);
        heart.setAlpha(1);
      } else {
        heart.setAlpha(0.3);
      }
      this.hearts.push(heart);
    }

    // FPS counter (debug)
    this.fpsText = this.add.text(40, 20, "", {
      fontFamily: "monospace",
      fontSize: "12px",
      color: "#000000",
    });
    this.fpsText.setOrigin(0, 0);
    this.fpsText.setDepth(200);
    this.fpsText.setScrollFactor(0);

    // All speech bubbles are standable (top-only, with carry)
    this.allBubbles = [
      this.player.bubble,
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
          if (!bubble.visible) return false;
          const playerBottom = this.player.sprite.body.bottom;
          const bubbleTop = bubble.collider.body.top;
          return (
            this.player.sprite.body.velocity.y >= 0 &&
            playerBottom <= bubbleTop + 8
          );
        },
      );
    }
  }

  update(time, delta) {
    this.fpsText.setText(`${Math.round(this.game.loop.actualFps)} fps`);

    if (this.sawDeath) {
      this.sawDeathTimer -= delta;
      this.sawDeath.rotation += 0.03 * delta;
      this.cameras.main.shake(100, 0.008, false);

      const px = this.player.sprite.x;
      const py = this.player.sprite.y;
      const sx = this.sawDeath.x;
      const sy = this.sawDeath.y;
      const lerp = (2 * delta) / 1000;
      this.player.sprite.x += (sx - px) * lerp;
      this.player.sprite.y += (sy - py) * lerp;

      const dt = 1 - this.sawDeathTimer / 1000;
      this.player.sprite.setOrigin(0.5, 0.5);
      this.player.sprite.setScale(1 + dt * 1.5);
      this.player.sprite.rotation = dt * Math.PI * 2;
      const pcY =
        this.player.sprite.y -
        this.player.sprite.displayHeight * this.player.sprite.originY +
        this.player.sprite.displayHeight / 2;
      this.sawParticles.setPosition(this.player.sprite.x, pcY);

      if (this.sawDeathTimer <= 0) {
        this._playerDie();
      }
      return;
    }

    if (this.enemyDeath) {
      this.enemyDeathTimer -= delta;
      this.cameras.main.shake(100, 0.008, false);

      // Animate enemy attack frames
      this.enemyAttackTimer = (this.enemyAttackTimer || 0) + delta;
      if (this.enemyAttackTimer >= 150) {
        this.enemyAttackTimer = 0;
        this.enemyAttackFrame = 1 - (this.enemyAttackFrame || 0);
        this.enemyDeath.setTexture(
          this.enemyAttackFrame === 0 ? "enemy_attack1" : "enemy_attack2",
        );
      }

      const px = this.player.sprite.x;
      const py = this.player.sprite.y;
      const ex = this.enemyDeath.x;
      const ey = this.enemyDeath.y;
      const lerp = (2 * delta) / 1000;
      this.player.sprite.x += (ex - px) * lerp;
      this.player.sprite.y += (ey - py) * lerp;

      const dt = 1 - this.enemyDeathTimer / 1000;
      this.enemyDeath.setScale(1.25 + dt * 2);
      this.player.sprite.setOrigin(0.5, 0.5);
      this.player.sprite.setScale(1 + dt * 1.5);
      this.player.sprite.rotation = dt * Math.PI * 2;
      const pcY =
        this.player.sprite.y -
        this.player.sprite.displayHeight * this.player.sprite.originY +
        this.player.sprite.displayHeight / 2;
      this.enemyParticles.setPosition(this.player.sprite.x, pcY);

      if (this.enemyDeathTimer <= 0) {
        this._playerDie();
      }
      return;
    }

    if (this.halfwayWaiting) {
      return;
    }

    if (this.goalCelebrationTimer > 0) {
      this.goalCelebrationTimer -= delta;
      this.cameras.main.shake(100, 0.004, false);

      const t = 1 - this.goalCelebrationTimer / 1000;
      this.player.sprite.setOrigin(0.5, 0.5);
      this.player.sprite.setScale(1 + t * 1.5);
      this.player.sprite.rotation = t * Math.PI * 2;

      if (this.goalCelebrationTimer <= 0) {
        if (this.currentLevel === 5) {
          this._showHalfwayMessage(HALFWAY_MESSAGE);
        } else if (this.currentLevel === 10) {
          this._showHalfwayMessage(END_MESSAGE);
        } else {
          this._goalTransition();
        }
      }
      return;
    }

    this.wasGrounded = this.player.sprite.body.blocked.down;
    this.player.update(time, delta);
    for (const enemy of this.enemies) {
      enemy.update(delta);
    }

    // Animate platform stripe scrolling
    const stripeSpeed = 0.03;
    for (const ts of this.platformTileSprites) {
      ts.tilePositionX += delta * stripeSpeed;
      ts.tilePositionY += delta * stripeSpeed;
    }

    // Update moving platforms
    for (const mp of this.movingPlatforms) {
      const x = mp.sprite.x;
      if (x >= mp.maxX) mp.dir = -1;
      else if (x <= mp.minX) mp.dir = 1;
      mp.sprite.body.setVelocityX(mp.speed * mp.dir);
      // Keep border in sync with moving platform
      mp.border.setPosition(mp.sprite.x, mp.sprite.y);
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
      saw.bubble.update(delta);
    }

    // Push bubbles out of platforms
    const playerBubbleHit = this._clampBubble(this.player.bubble, true);
    if (playerBubbleHit && this.player.sprite.body.velocity.y < 0) {
      this.player.sprite.body.velocity.y = 0;
      this.player.sprite.y += playerBubbleHit;
      this.cameras.main.shake(150, 0.002, false);
      this.errorSound.play();
    }
    for (const enemy of this.enemies) {
      this._clampBubble(enemy.bubble);
    }
  }

  _playerEnemyDie(enemySprite) {
    if (this.isDead || this.goalReached) return;
    this.isDead = true;
    this.physics.pause();
    this.enemyDeath = enemySprite;
    this.enemyDeathTimer = 1000;
    this.player.sprite.setDepth(25);

    const playerCenterY =
      this.player.sprite.y -
      this.player.sprite.displayHeight * this.player.sprite.originY +
      this.player.sprite.displayHeight / 2;
    this.enemyParticles = particleBurst(
      this,
      this.player.sprite.x,
      playerCenterY,
      "robot_blood",
    );
    this.enemyParticles.setDepth(5);
    enemySprite.setDepth(25);
    this.player.sprite.setDepth(20);

    zoomTo(this.cameras.main, enemySprite.x, enemySprite.y);

    for (const bubble of this.allBubbles) {
      bubble._setVisible(false);
    }
  }

  _playerSawDie(sawSprite) {
    if (this.isDead || this.goalReached) return;
    this.isDead = true;
    this.sawSound.play();
    this.time.delayedCall(800, () => this.impactSound.play());
    this.physics.pause();
    this.sawDeath = sawSprite;
    this.sawDeathTimer = 1000;
    this.player.sprite.setDepth(25);

    const playerCenterY =
      this.player.sprite.y -
      this.player.sprite.displayHeight * this.player.sprite.originY +
      this.player.sprite.displayHeight / 2;
    this.sawParticles = particleBurst(
      this,
      this.player.sprite.x,
      playerCenterY,
      "robot_blood",
    );
    this.sawParticles.setDepth(5);
    this.sawDeath.setDepth(20);

    zoomTo(this.cameras.main, sawSprite.x, sawSprite.y);

    for (const bubble of this.allBubbles) {
      bubble._setVisible(false);
    }
  }

  _playerDie() {
    if (this.isDead && !this.sawDeath && !this.enemyDeath) return;
    this.isDead = true;
    if (this.sawParticles) {
      this.sawParticles.destroy();
      this.sawParticles = null;
    }
    if (this.enemyParticles) {
      this.enemyParticles.destroy();
      this.enemyParticles = null;
    }
    this.sawDeath = null;
    this.enemyDeath = null;
    this.sawSound?.stop();
    if (this.impactSound?.isPlaying) {
      this.tweens.add({
        targets: this.impactSound,
        volume: 0,
        duration: 700,
        onComplete: () => this.impactSound?.stop(),
      });
    }
    this.physics.pause();

    zoomReset(this.cameras.main);

    const overlay = this.add.rectangle(
      CENTER_X,
      CENTER_Y,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
    );
    overlay.setDepth(99);

    const deathText = this.add.text(CENTER_X, CENTER_Y, DEATH_TEXT, {
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
    this.goalCelebrationTimer = 1000;
    this.player.sprite.setDepth(25);

    // Light up the current level's heart
    const heartIndex = 10 - this.currentLevel;
    if (heartIndex >= 0 && heartIndex < this.hearts.length) {
      this.hearts[heartIndex].setTint(0xff69b4);
      this.hearts[heartIndex].setAlpha(1);
    }

    const gx = this.goalObj.x;
    const gy = this.goalObj.y;

    zoomTo(this.cameras.main, gx, gy);

    this.goalParticles = particleBurst(this, gx, gy, "goal", {
      scale: { min: 0.2, max: 1.5 },
      tint: [0xff0000, 0xff3366, 0xff6699, 0xcc0033],
    });
    this.goalParticles.setDepth(5);
    this.goalObj.setDepth(20);

    for (const bubble of this.allBubbles) {
      bubble._setVisible(false);
    }
  }

  _goalTransition() {
    if (this.goalParticles) {
      this.goalParticles.destroy();
      this.goalParticles = null;
    }
    this.sawSound?.stop();
    if (this.impactSound?.isPlaying) {
      this.tweens.add({
        targets: this.impactSound,
        volume: 0,
        duration: 700,
        onComplete: () => this.impactSound?.stop(),
      });
    }

    zoomReset(this.cameras.main);

    const overlay = this.add.rectangle(
      CENTER_X,
      CENTER_Y,
      GAME_WIDTH,
      GAME_HEIGHT,
      0x000000,
    );
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

  _showHalfwayMessage(message) {
    this.halfwayWaiting = true;

    const gx = this.goalObj.x;
    const gy = this.goalObj.y;
    const msgText = this.add.text(gx, gy + 40, message, {
      fontFamily: "monospace",
      fontSize: "10px",
      color: "#ffffff",
      align: "center",
      stroke: "#000000",
      strokeThickness: 3,
      wordWrap: { width: 200 },
    });
    msgText.setOrigin(0.5);
    msgText.setDepth(999);

    this.tweens.add({
      targets: msgText,
      scale: { from: 1, to: 1.15 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.easeInOut",
    });

    this.input.keyboard.once("keydown-SPACE", () => {
      msgText.destroy();
      if (this.currentLevel === 10) {
        this.scene.start("TitleScene");
      } else {
        this._goalTransition();
      }
    });
  }

  _activateSpinPlatform() {
    this.spinActivated = true;
    this.cameras.main.shake(200, 0.003, false);
    this.fallingHeartSound.play();

    // Disable platform collision, full gravity for the fall
    this.spinPlat.body.enable = false;
    this.goalObj.body.setGravityY(0);

    // Spin the platform visual (and its border)
    this.tweens.add({
      targets: [this.spinPlat, this.spinPlatBorder],
      rotation: Math.PI * 4,
      duration: 2000,
      ease: "Cubic.easeOut",
    });
  }

  _platformBounce(plat) {
    if (plat._bouncing) return;
    plat._bouncing = true;
    const targets = [plat];
    if (plat._border) targets.push(plat._border);
    this.tweens.add({
      targets,
      y: "+=3",
      duration: 80,
      yoyo: true,
      ease: "Sine.easeOut",
      onComplete: () => {
        plat._bouncing = false;
      },
    });
  }

  _clampBubble(bubble, triggerSpin = false) {
    if (!bubble.visible) return 0;
    const b = bubble.getBounds();

    // Check spinning platform
    if (!this.spinActivated && this.spinPlat.body.enable) {
      const p = this.spinPlat.body;
      if (
        b.right > p.left &&
        b.left < p.right &&
        b.top < p.bottom &&
        b.bottom > p.top
      ) {
        const offset = p.bottom - b.top;
        bubble.applyOffset(0, offset);
        if (triggerSpin) {
          this._activateSpinPlatform();
        }
        return offset;
      }
    }

    // Check moving platforms
    for (const mp of this.movingPlatforms) {
      const p = mp.sprite.body;
      if (
        b.right > p.left &&
        b.left < p.right &&
        b.top < p.bottom &&
        b.bottom > p.top
      ) {
        const offset = p.bottom - b.top;
        bubble.applyOffset(0, offset);
        return offset;
      }
    }

    // Check regular platforms
    for (const plat of this.platformGroup.getChildren()) {
      const p = plat.body;
      if (
        b.right > p.left &&
        b.left < p.right &&
        b.top < p.bottom &&
        b.bottom > p.top
      ) {
        const offset = p.bottom - b.top;
        bubble.applyOffset(0, offset);
        return offset;
      }
    }
    return 0;
  }
}
