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
    float offset = 0.0005;
    vec4 center = texture2D(uMainSampler, uv);
    float r = texture2D(uMainSampler, vec2(uv.x + offset, uv.y)).r;
    vec3 color = vec3(r, center.g, center.b);

    // Scanlines - wide dark bands with gaps
    float pixelY = uv.y * uResolution.y;
    float scanline = 0.904 + 0.096 * step(0.5, fract(pixelY / 4.0));
    color *= scanline;

    // Saturation boost - make colors pop
    float gray = dot(color, vec3(0.299, 0.587, 0.114));
    color = mix(vec3(gray), color, 1.4);

    // Contrast boost + crush darks + lift lights
    color = (color - 0.5) * 1.15 + 0.5;
    color = pow(color, vec3(1.15));
    color = mix(color, smoothstep(0.0, 1.0, color), 0.2);

    // Vignette - darken corners
    vec2 vig = uv * (1.0 - uv);
    float vignette = pow(vig.x * vig.y * 10.0, 0.4);
    color *= vignette;

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
