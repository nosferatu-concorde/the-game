/**
 * Spawn a burst of particles at a position.
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {string} texture - texture key to use for particles
 * @param {{ scale?: object, tint?: number[] }} opts
 * @returns {Phaser.GameObjects.Particles.ParticleEmitter}
 */
export function particleBurst(scene, x, y, texture, opts = {}) {
  const { scale = { start: 1.5, end: 0.2 }, tint } = opts;

  const config = {
    speedX: {
      onEmit: () => {
        const s = Phaser.Math.Between(50, 400);
        return Math.random() < 0.5 ? -s : s;
      },
    },
    speedY: {
      onEmit: () => {
        const s = Phaser.Math.Between(50, 400);
        return Math.random() < 0.5 ? -s : s;
      },
    },
    emitZone: { type: "random", source: new Phaser.Geom.Circle(0, 0, 50) },
    scale,
    alpha: 1,
    lifespan: { min: 500, max: 1000 },
    frequency: 10,
    quantity: 8,
    rotate: { min: 0, max: 360 },
    accelerationY: 200,
  };

  if (tint) {
    config.tint = tint;
  }

  return scene.add.particles(x, y, texture, config);
}
