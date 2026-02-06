import Phaser from "phaser";

const fragShader = `
precision mediump float;

uniform sampler2D uMainSampler;
uniform vec2 uResolution;
uniform float uTime;

varying vec2 outTexCoord;

void main() {
    vec2 uv = outTexCoord;

    // Chromatic aberration
    float offset = 0.0010;
    float r = texture2D(uMainSampler, vec2(uv.x + offset, uv.y)).r;
    float g = texture2D(uMainSampler, uv).g;
    float b = texture2D(uMainSampler, vec2(uv.x - offset, uv.y)).b;
    vec3 color = vec3(r, g, b);

    // Scanlines - multiply to darken every other line (visible on white)
    float pixelY = uv.y * uResolution.y;
    float scanline = 0.92 + 0.08 * sin(pixelY * 3.14159);
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
