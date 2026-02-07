import { CENTER_X, CENTER_Y } from "../constants/config.js";

/**
 * Zoom the camera toward a target position.
 * @param {Phaser.Cameras.Scene2D.Camera} cam
 * @param {number} x
 * @param {number} y
 * @param {{ zoom?: number, duration?: number, ease?: string }} opts
 */
export function zoomTo(cam, x, y, opts = {}) {
  const { zoom = 3, duration = 800, ease = "Sine.easeInOut" } = opts;
  cam.pan(x, y, duration, ease);
  cam.zoomTo(zoom, duration, ease);
}

/**
 * Instantly reset the camera to default center & zoom.
 * @param {Phaser.Cameras.Scene2D.Camera} cam
 */
export function zoomReset(cam) {
  cam.stopFollow();
  cam.pan(CENTER_X, CENTER_Y, 0);
  cam.zoomTo(1, 0);
}
