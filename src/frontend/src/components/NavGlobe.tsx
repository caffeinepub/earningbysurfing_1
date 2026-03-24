import { useEffect, useRef } from "react";

const CURRENCIES = ["₹", "د.إ", "$", "€", "£", "¥"];

interface Particle {
  symbol: string;
  angle: number;
  speed: number;
  rx: number;
  ry: number;
  offsetY: number;
}

interface NavGlobeProps {
  size?: number;
}

export default function NavGlobe({ size = 80 }: NavGlobeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const globeAngleRef = useRef(0);
  const hoveredRef = useRef(false);
  const particlesRef = useRef<Particle[]>(
    CURRENCIES.map((sym, i) => ({
      symbol: sym,
      angle: (i / CURRENCIES.length) * Math.PI * 2,
      speed: i % 2 === 0 ? 0.008 : 0.006,
      rx: i < 3 ? 36 : 30,
      ry: i < 3 ? 14 : 10,
      offsetY: i < 3 ? -8 : 12,
    })),
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const SIZE = 80;
    const cx = SIZE / 2;
    const cy = SIZE / 2;
    const R = 28;

    function drawGlobe(rotAngle: number) {
      ctx!.clearRect(0, 0, SIZE, SIZE);

      // Atmosphere glow
      const glow = ctx!.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.3);
      glow.addColorStop(0, "rgba(68,136,255,0)");
      glow.addColorStop(1, "rgba(68,136,255,0.18)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, R * 1.3, 0, Math.PI * 2);
      ctx!.fillStyle = glow;
      ctx!.fill();

      // Clip to globe circle
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.clip();

      // Ocean base
      const oceanGrad = ctx!.createRadialGradient(cx - 6, cy - 6, 2, cx, cy, R);
      oceanGrad.addColorStop(0, "#3a8fdf");
      oceanGrad.addColorStop(0.5, "#1a6fbf");
      oceanGrad.addColorStop(1, "#0d4a8a");
      ctx!.fillStyle = oceanGrad;
      ctx!.fillRect(cx - R, cy - R, R * 2, R * 2);

      // Latitude lines
      ctx!.strokeStyle = "rgba(100,180,255,0.35)";
      ctx!.lineWidth = 0.7;
      for (let lat = -3; lat <= 3; lat++) {
        const latY = cy + (lat / 3.5) * R;
        const latR = Math.sqrt(Math.max(0, R * R - (latY - cy) ** 2));
        if (latR > 0) {
          ctx!.beginPath();
          ctx!.ellipse(cx, latY, latR, latR * 0.18, 0, 0, Math.PI * 2);
          ctx!.stroke();
        }
      }

      // Longitude lines (animated by rotAngle)
      for (let i = 0; i < 8; i++) {
        const lng = (i / 8) * Math.PI * 2 + rotAngle;
        const x = cx + Math.sin(lng) * R;
        ctx!.beginPath();
        ctx!.ellipse(
          x,
          cy,
          Math.abs(Math.cos(lng)) * R * 0.25,
          R,
          0,
          0,
          Math.PI * 2,
        );
        ctx!.stroke();
      }

      // Continent blobs
      ctx!.fillStyle = "rgba(60,160,80,0.55)";
      const continents = [
        { dx: 0.1, dy: 0.1, rx: 0.28, ry: 0.4 },
        { dx: 0.35, dy: -0.25, rx: 0.38, ry: 0.3 },
        { dx: -0.45, dy: -0.1, rx: 0.22, ry: 0.32 },
        { dx: 0.5, dy: 0.3, rx: 0.18, ry: 0.2 },
      ];
      for (const { dx, dy, rx, ry } of continents) {
        const bx = cx + dx * Math.cos(rotAngle) * R;
        const by = cy + dy * R;
        ctx!.beginPath();
        ctx!.ellipse(
          bx,
          by,
          rx * R * 0.5,
          ry * R * 0.5,
          rotAngle * 0.3,
          0,
          Math.PI * 2,
        );
        ctx!.fill();
      }

      ctx!.restore();

      // Globe edge highlight
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(100,180,255,0.6)";
      ctx!.lineWidth = 1.5;
      ctx!.stroke();

      // Specular highlight
      const spec = ctx!.createRadialGradient(
        cx - R * 0.3,
        cy - R * 0.35,
        1,
        cx - R * 0.15,
        cy - R * 0.2,
        R * 0.45,
      );
      spec.addColorStop(0, "rgba(255,255,255,0.45)");
      spec.addColorStop(1, "rgba(255,255,255,0)");
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.fillStyle = spec;
      ctx!.fill();
    }

    function drawParticles() {
      for (const p of particlesRef.current) {
        const x = cx + p.rx * Math.cos(-p.angle);
        const y = cy + p.offsetY + p.ry * Math.sin(-p.angle);

        ctx!.beginPath();
        ctx!.arc(x, y, 9, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(255,255,255,0.92)";
        ctx!.shadowColor = "rgba(255,255,255,0.8)";
        ctx!.shadowBlur = 6;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        const isLong = [...p.symbol].length > 1;
        ctx!.font = `bold ${isLong ? 6 : 9}px Arial, sans-serif`;
        ctx!.fillStyle = "#1a1a1a";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(p.symbol, x, y + 0.5);
      }
    }

    function tick() {
      const speedMult = hoveredRef.current ? 2 : 1;
      globeAngleRef.current += 0.008 * speedMult;
      for (const p of particlesRef.current) {
        p.angle += p.speed * speedMult;
      }

      drawGlobe(globeAngleRef.current);
      drawParticles();
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={80}
      height={80}
      style={{
        display: "block",
        cursor: "pointer",
        flexShrink: 0,
        width: `${size}px`,
        height: `${size}px`,
      }}
      onMouseEnter={() => {
        hoveredRef.current = true;
      }}
      onMouseLeave={() => {
        hoveredRef.current = false;
      }}
      title="One World One Future"
    />
  );
}
