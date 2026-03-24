import { useEffect, useRef } from "react";

const CURRENCIES = [
  "\u20b9",
  "\u062f.\u0625",
  "$",
  "\u20ac",
  "\u00a3",
  "\u00a5",
];

// Preload globe image at module level for zero-delay first frame
const GLOBE_SRC =
  "/assets/uploads/ebs_globe-019d1de7-16d6-70e9-95f4-2431f34098ec-1.png";
const preloadedImg = new Image();
preloadedImg.src = GLOBE_SRC;

interface Particle {
  symbol: string;
  angle: number;
  speed: number;
  rx: number;
  ry: number;
  offsetY: number;
}

interface EBSGlobeRightProps {
  size?: number;
}

export default function EBSGlobeRight({ size = 72 }: EBSGlobeRightProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>(0);
  const rotAngleRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);

  // Extra canvas padding so large symbol dots aren't clipped at orbit edges
  const PADDING = Math.round(size * 0.28);
  const CANVAS = size + PADDING * 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // All geometry derived from size inside the effect
    const S = size;
    const CSIZE = S + Math.round(S * 0.28) * 2;
    const cx = CSIZE / 2;
    const cy = CSIZE / 2;
    const R = S * 0.42;

    // ---- Symbol sizes: tripled vs old code (was 9px dot / 6-8px font) ----
    const DOT_R = S > 60 ? 27 : 21;
    const FONT_SINGLE = DOT_R - 1; // ~26px at size=250
    const FONT_MULTI = Math.round(DOT_R * 0.72); // multi-char (د.إ)

    // Build particles
    particlesRef.current = CURRENCIES.map((sym, i) => ({
      symbol: sym,
      angle: (i / CURRENCIES.length) * Math.PI * 2,
      speed: i % 2 === 0 ? 0.009 : 0.007,
      rx: Math.round(S * 0.52) + (i % 2) * 4,
      ry: Math.round(S * 0.18) + (i % 3) * 2,
      offsetY: i < 3 ? -Math.round(S * 0.12) : Math.round(S * 0.14),
    }));

    function drawGlobe() {
      ctx!.clearRect(0, 0, CSIZE, CSIZE);
      ctx!.save();
      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.clip();

      if (preloadedImg.complete && preloadedImg.naturalWidth > 0) {
        ctx!.translate(cx, cy);
        ctx!.rotate(rotAngleRef.current);
        ctx!.drawImage(preloadedImg, -R, -R, R * 2, R * 2);
      } else {
        // Instant blue fallback
        const grad = ctx!.createRadialGradient(
          cx - R * 0.2,
          cy - R * 0.2,
          2,
          cx,
          cy,
          R,
        );
        grad.addColorStop(0, "#4ea8de");
        grad.addColorStop(1, "#1a6fbf");
        ctx!.fillStyle = grad;
        ctx!.fillRect(cx - R, cy - R, R * 2, R * 2);
      }
      ctx!.restore();

      ctx!.beginPath();
      ctx!.arc(cx, cy, R, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(255,153,51,0.5)";
      ctx!.lineWidth = 2;
      ctx!.stroke();

      ctx!.beginPath();
      ctx!.arc(cx, cy, R + 3, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(255,153,51,0.15)";
      ctx!.lineWidth = 4;
      ctx!.stroke();
    }

    function drawParticles() {
      for (const p of particlesRef.current) {
        const x = cx + p.rx * Math.cos(-p.angle);
        const y = cy + p.offsetY + p.ry * Math.sin(-p.angle);

        // Large white circle
        ctx!.beginPath();
        ctx!.arc(x, y, DOT_R, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(255,255,255,0.97)";
        ctx!.shadowColor = "rgba(255,255,255,0.95)";
        ctx!.shadowBlur = 10;
        ctx!.fill();
        ctx!.shadowBlur = 0;

        // Bold dark symbol
        const isMulti = [...p.symbol].length > 1;
        ctx!.font = `bold ${isMulti ? FONT_MULTI : FONT_SINGLE}px Arial, sans-serif`;
        ctx!.fillStyle = "#111111";
        ctx!.textAlign = "center";
        ctx!.textBaseline = "middle";
        ctx!.fillText(p.symbol, x, y + 0.5);
      }
    }

    function tick() {
      rotAngleRef.current += 0.006;
      for (const p of particlesRef.current) {
        p.angle += p.speed; // clockwise orbit
      }
      drawGlobe();
      drawParticles();
      rafRef.current = requestAnimationFrame(tick);
    }

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  return (
    <div
      style={{
        position: "relative",
        width: `${CANVAS}px`,
        height: `${CANVAS}px`,
        flexShrink: 0,
      }}
      title="One World One Future"
    >
      <canvas
        ref={canvasRef}
        width={CANVAS}
        height={CANVAS}
        style={{
          display: "block",
          width: `${CANVAS}px`,
          height: `${CANVAS}px`,
        }}
      />
    </div>
  );
}
