"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Scoped WebGL shader background.
 * - Renders into a canvas that fills its POSITIONED parent (absolute, not fixed),
 *   so it stays inside its section instead of covering the page.
 * - Pauses the render loop when offscreen (IntersectionObserver) or when the tab
 *   is hidden (visibilitychange) — one WebGL context, no wasted GPU.
 * - prefers-reduced-motion: renders a single static frame, no animation loop.
 */
export function WebGLShader({ className = "" }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const vertexShader = `
      attribute vec3 position;
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 resolution;
      uniform float time;
      uniform float xScale;
      uniform float yScale;
      uniform float distortion;

      void main() {
        vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

        float d = length(p) * distortion;

        float rx = p.x * (1.0 + d);
        float gx = p.x;
        float bx = p.x * (1.0 - d);

        float r = 0.05 / abs(p.y + sin((rx + time) * xScale) * yScale);
        float g = 0.05 / abs(p.y + sin((gx + time) * xScale) * yScale);
        float b = 0.05 / abs(p.y + sin((bx + time) * xScale) * yScale);

        // Spike brand tint: suppress red, emphasize teal/cyan (#22D3B0 / #5BD0F2)
        float tr = r * 0.10;
        float tg = g * 0.82 + b * 0.10;
        float tb = b * 1.12 + g * 0.12;

        gl_FragColor = vec4(tr, tg, tb, 1.0);
      }
    `;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(new THREE.Color(0x000000));

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1);

    const uniforms = {
      resolution: { value: new THREE.Vector2(1, 1) },
      time: { value: 0.0 },
      xScale: { value: 1.0 },
      yScale: { value: 0.5 },
      distortion: { value: 0.05 },
    };

    const position = [
      -1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0,
      0.0, 1.0, 1.0, 0.0,
    ];
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(position), 3)
    );

    const material = new THREE.RawShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      side: THREE.DoubleSide,
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const resize = () => {
      const w = canvas.clientWidth || canvas.parentElement?.clientWidth || 1;
      const h = canvas.clientHeight || canvas.parentElement?.clientHeight || 1;
      renderer.setSize(w, h, false);
      uniforms.resolution.value.set(
        w * renderer.getPixelRatio(),
        h * renderer.getPixelRatio()
      );
    };
    resize();

    const renderOnce = () => renderer.render(scene, camera);

    let rafId: number | null = null;
    let onScreen = true;
    let running = false;

    const tick = () => {
      uniforms.time.value += 0.01;
      renderOnce();
      rafId = requestAnimationFrame(tick);
    };
    const start = () => {
      if (running || prefersReduced) return;
      running = true;
      rafId = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };
    const evaluate = () => {
      if (onScreen && !document.hidden) start();
      else stop();
    };

    if (prefersReduced) {
      // Static, pleasant frame — no animation loop.
      uniforms.time.value = 1.6;
      renderOnce();
    } else {
      evaluate();
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (prefersReduced || !running) renderOnce();
    });
    ro.observe(canvas);

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false;
        if (!prefersReduced) evaluate();
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (!prefersReduced) evaluate();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
      io.disconnect();
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`block h-full w-full ${className}`}
    />
  );
}
