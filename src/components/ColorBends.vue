<template>
  <div
    ref="container"
    :class="['w-full h-full relative overflow-hidden', className]"
    :style="styleProps"
  ></div>
</template>

<script lang="ts">
import { defineComponent, PropType, CSSProperties } from 'vue';
import * as THREE from 'three';

const MAX_COLORS = 8;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
uniform int uIterations;
uniform float uIntensity;
uniform float uBandWidth;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

  for (int j = 0; j < 5; j++) {
    if (j >= uIterations - 1) break;
    vec2 rr = sin(1.5 * (q.yx * uFrequency) + 2.0 * cos(q * uFrequency));
    q += (rr - q) * 0.15;
  }

  vec3 col = vec3(0.0);
  float a = 1.0;

  if (uColorCount > 0) {
    vec2 s = q;
    vec3 sumCol = vec3(0.0);
    float cover = 0.0;
    for (int i = 0; i < MAX_COLORS; ++i) {
      if (i >= uColorCount) break;
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3); 
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); 
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
      float m = mix(m0, m1, kMix);
      float w = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
      sumCol += uColors[i] * w;
      cover = max(cover, w);
    }
    col = clamp(sumCol, 0.0, 1.0);
    a = uTransparent > 0 ? cover : 1.0;
  } else {
    vec2 s = q;
    for (int k = 0; k < 3; ++k) {
      s -= 0.01;
      vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
      float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float kBelow = clamp(uWarpStrength, 0.0, 1.0);
      float kMix = pow(kBelow, 0.3);
      float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
      vec2 disp = (r - s) * kBelow;
      vec2 warped = s + disp * gain;
      float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
      float m = mix(m0, m1, kMix);
      col[k] = 1.0 - exp(-uBandWidth / exp(uBandWidth * m));
    }
    a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
  }

  col *= uIntensity;

  if (uNoise > 0.0001) {
    float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
    col += (n - 0.5) * uNoise;
    col = clamp(col, 0.0, 1.0);
  }

  vec3 rgb = (uTransparent > 0) ? col * a : col;
  gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export default defineComponent({
  name: 'ColorBends',
  props: {
    className: { type: String, default: '' },
    styleProps: { type: Object as PropType<CSSProperties>, default: () => ({}) },
    rotation: { type: Number, default: 90 },
    autoRotate: { type: Number, default: 0 },
    speed: { type: Number, default: 0.2 },
    colors: { type: Array as PropType<string[]>, default: () => [] },
    transparent: { type: Boolean, default: true },
    scale: { type: Number, default: 1 },
    frequency: { type: Number, default: 1 },
    warpStrength: { type: Number, default: 1 },
    mouseInfluence: { type: Number, default: 1 },
    parallax: { type: Number, default: 0.5 },
    noise: { type: Number, default: 0.15 },
    iterations: { type: Number, default: 1 },
    intensity: { type: Number, default: 1.5 },
    bandWidth: { type: Number, default: 6 },
  },
  data() {
    return {
      renderer: null as THREE.WebGLRenderer | null,
      rafId: null as number | null,
      material: null as THREE.ShaderMaterial | null,
      resizeObserver: null as ResizeObserver | null,
      pointerTarget: new THREE.Vector2(0, 0),
      pointerCurrent: new THREE.Vector2(0, 0),
      pointerSmooth: 8,
      cleanupFns: [] as Array<() => void>
    };
  },
  mounted() {
    this.init();
    this.applyProps();
  },
  beforeUnmount() {
    this.cleanupFns.forEach((fn) => fn());
  },
  watch: {
    $props: {
      deep: true,
      handler() {
        this.applyProps();
      }
    }
  },
  methods: {
    init() {
      const container = this.$refs.container as HTMLDivElement;
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

      const geometry = new THREE.PlaneGeometry(2, 2);
      const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
      
      const material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
          uCanvas: { value: new THREE.Vector2(1, 1) },
          uTime: { value: 0 },
          uSpeed: { value: this.speed },
          uRot: { value: new THREE.Vector2(1, 0) },
          uColorCount: { value: 0 },
          uColors: { value: uColorsArray },
          uTransparent: { value: this.transparent ? 1 : 0 },
          uScale: { value: this.scale },
          uFrequency: { value: this.frequency },
          uWarpStrength: { value: this.warpStrength },
          uPointer: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: this.mouseInfluence },
          uParallax: { value: this.parallax },
          uNoise: { value: this.noise },
          uIterations: { value: this.iterations },
          uIntensity: { value: this.intensity },
          uBandWidth: { value: this.bandWidth }
        },
        premultipliedAlpha: true,
        transparent: true
      });
      this.material = material;

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      const renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true
      });
      this.renderer = renderer;
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, this.transparent ? 0 : 1);
      renderer.domElement.style.width = '100%';
      renderer.domElement.style.height = '100%';
      renderer.domElement.style.display = 'block';
      container.appendChild(renderer.domElement);

      const clock = new THREE.Clock();

      const handleResize = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h, false);
        (material.uniforms.uCanvas.value as THREE.Vector2).set(w, h);
      };

      handleResize();

      if ('ResizeObserver' in window) {
        const ro = new ResizeObserver(handleResize);
        ro.observe(container);
        this.resizeObserver = ro;
      } else {
        (window as Window).addEventListener('resize', handleResize);
      }

      const loop = () => {
        const dt = clock.getDelta();
        const elapsed = clock.elapsedTime;
        material.uniforms.uTime.value = elapsed;

        const deg = (this.rotation % 360) + this.autoRotate * elapsed;
        const rad = (deg * Math.PI) / 180;
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        (material.uniforms.uRot.value as THREE.Vector2).set(c, s);

        const cur = this.pointerCurrent;
        const tgt = this.pointerTarget;
        const amt = Math.min(1, dt * this.pointerSmooth);
        cur.lerp(tgt, amt);
        (material.uniforms.uPointer.value as THREE.Vector2).copy(cur);
        
        renderer.render(scene, camera);
        this.rafId = requestAnimationFrame(loop);
      };
      this.rafId = requestAnimationFrame(loop);

      const handlePointerMove = (e: PointerEvent) => {
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
        const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
        this.pointerTarget.set(x, y);
      };

      container.addEventListener('pointermove', handlePointerMove);

      this.cleanupFns.push(() => {
        if (this.rafId !== null) cancelAnimationFrame(this.rafId);
        if (this.resizeObserver) this.resizeObserver.disconnect();
        else (window as Window).removeEventListener('resize', handleResize);
        geometry.dispose();
        material.dispose();
        renderer.dispose();
        renderer.forceContextLoss();
        if (renderer.domElement && renderer.domElement.parentElement === container) {
          container.removeChild(renderer.domElement);
        }
        container.removeEventListener('pointermove', handlePointerMove);
      });
    },
    
    applyProps() {
      const material = this.material;
      const renderer = this.renderer;
      if (!material) return;

      material.uniforms.uSpeed.value = this.speed;
      material.uniforms.uScale.value = this.scale;
      material.uniforms.uFrequency.value = this.frequency;
      material.uniforms.uWarpStrength.value = this.warpStrength;
      material.uniforms.uMouseInfluence.value = this.mouseInfluence;
      material.uniforms.uParallax.value = this.parallax;
      material.uniforms.uNoise.value = this.noise;
      material.uniforms.uIterations.value = this.iterations;
      material.uniforms.uIntensity.value = this.intensity;
      material.uniforms.uBandWidth.value = this.bandWidth;

      const toVec3 = (hex: string) => {
        const h = hex.replace('#', '').trim();
        const v =
          h.length === 3
            ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
            : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
        return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
      };

      const arr = (this.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
      for (let i = 0; i < MAX_COLORS; i++) {
        const vec = (material.uniforms.uColors.value as THREE.Vector3[])[i];
        if (i < arr.length) vec.copy(arr[i]);
        else vec.set(0, 0, 0);
      }
      material.uniforms.uColorCount.value = arr.length;

      material.uniforms.uTransparent.value = this.transparent ? 1 : 0;
      if (renderer) renderer.setClearColor(0x000000, this.transparent ? 0 : 1);
    }
  }
});
</script>
