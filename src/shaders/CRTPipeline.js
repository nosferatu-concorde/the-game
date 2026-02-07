import Phaser from "phaser";

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;

    // Chromatic aberration (2 lookups instead of 3)
    float offset = 0.0010;
    vec4 center = texture2D(uMainSampler, uv);
    float r = texture2D(uMainSampler, vec2(uv.x + offset, uv.y)).r;
    vec3 color = vec3(r, center.g, center.b);

    // Scanlines - multiply to darken every other line (visible on white)
    float pixelY = uv.y * uResolution.y;
    float scanline = 0.92 + 0.08 * sin(pixelY * 1.5);
    color *= scanline;


    gl_FragColor = vec4(color, 1.0);
}
`;

export class CRTPipeline
  extends Phaser.Renderer.WebGL.Pipelines.PostFXPipeline
{
  constructor(game) {
    super({
      game,
      name: "CRTPipeline",
      fragShader,
    });
  }

  onPreRender() {
    this.set2f("uResolution", this.renderer.width, this.renderer.height);
    this.set1f("uTime", this.game.loop.time / 1000);
  }
}
