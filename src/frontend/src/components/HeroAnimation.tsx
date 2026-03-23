import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
  alpha: number;
  alphaSpeed: number;
}

interface Ring {
  angle: number;
  tilt: number;
  radiusX: number;
  radiusY: number;
  thickness: number;
  color: string;
  rotationSpeed: number;
  bobOffset: number;
  bobSpeed: number;
  bobAmplitude: number;
}

const SAFFRON_COLORS = [
  "255, 153, 51",
  "255, 180, 80",
  "230, 120, 20",
  "255, 210, 100",
  "255, 240, 150",
];

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const PARTICLE_COUNT = 260;
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const color =
        SAFFRON_COLORS[Math.floor(Math.random() * SAFFRON_COLORS.length)];
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random(),
        vx: (Math.random() - 0.5) * 0.4,
        vy: -(Math.random() * 0.6 + 0.15),
        vz: (Math.random() - 0.5) * 0.002,
        radius: Math.random() * 2.5 + 0.5,
        color,
        alpha: Math.random() * 0.6 + 0.2,
        alphaSpeed: (Math.random() - 0.5) * 0.008,
      });
    }

    const makeRings = (w: number, h: number): Ring[] => [
      {
        angle: 0,
        tilt: 0.4,
        radiusX: Math.min(w, h) * 0.28,
        radiusY: Math.min(w, h) * 0.1,
        thickness: 4,
        color: "255, 153, 51",
        rotationSpeed: 0.006,
        bobOffset: 0,
        bobSpeed: 0.02,
        bobAmplitude: 12,
      },
      {
        angle: Math.PI * 0.5,
        tilt: 0.6,
        radiusX: Math.min(w, h) * 0.18,
        radiusY: Math.min(w, h) * 0.07,
        thickness: 2.5,
        color: "255, 200, 80",
        rotationSpeed: -0.009,
        bobOffset: 1.2,
        bobSpeed: 0.015,
        bobAmplitude: 8,
      },
      {
        angle: Math.PI,
        tilt: 0.25,
        radiusX: Math.min(w, h) * 0.38,
        radiusY: Math.min(w, h) * 0.13,
        thickness: 1.5,
        color: "230, 120, 20",
        rotationSpeed: 0.004,
        bobOffset: 2.4,
        bobSpeed: 0.025,
        bobAmplitude: 15,
      },
    ];

    let rings = makeRings(width, height);
    let t = 0;
    let animationFrameId: number;

    const drawRing = (ring: Ring, cx: number, cy: number) => {
      const bob =
        Math.sin(t * ring.bobSpeed + ring.bobOffset) * ring.bobAmplitude;
      const steps = 200;
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const theta = (i / steps) * Math.PI * 2 + ring.angle;
        const px = cx + Math.cos(theta) * ring.radiusX;
        const py =
          cy + bob + Math.sin(theta) * ring.radiusY * Math.cos(ring.tilt);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.shadowBlur = 20;
      ctx.shadowColor = `rgba(${ring.color}, 0.8)`;
      ctx.strokeStyle = `rgba(${ring.color}, 0.6)`;
      ctx.lineWidth = ring.thickness;
      ctx.stroke();
      ctx.shadowBlur = 0;
    };

    const draw = () => {
      t++;
      ctx.clearRect(0, 0, width, height);

      for (const ring of rings) {
        ring.angle += ring.rotationSpeed;
      }

      const cx = width * 0.72;
      const cy = height * 0.45;

      for (const ring of rings) {
        drawRing(ring, cx, cy);
      }

      for (const p of particles) {
        const depthScale = 0.5 + p.z * 0.5;
        const r = p.radius * depthScale;

        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3);
        gradient.addColorStop(0, `rgba(${p.color}, ${p.alpha})`);
        gradient.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = gradient;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${Math.min(p.alpha * 1.6, 1)})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        p.z = Math.max(0, Math.min(1, p.z));
        p.alpha += p.alphaSpeed;
        if (p.alpha > 0.85 || p.alpha < 0.1) p.alphaSpeed *= -1;

        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -20) p.x = width + 10;
        if (p.x > width + 20) p.x = -10;
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    const onResize = () => {
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      for (const p of particles) {
        p.x = Math.random() * width;
        p.y = Math.random() * height;
      }
      rings = makeRings(width, height);
    };

    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    />
  );
}
