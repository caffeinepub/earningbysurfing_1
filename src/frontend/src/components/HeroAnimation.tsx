import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import { TextureLoader } from "three";

const GLOBE_RADIUS = 3.2;

// ─── Textured Blue Earth Globe (local asset, instant load) ───
function EarthGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  const texture = useLoader(
    TextureLoader,
    "/assets/generated/earth-texture-map.dim_2048x1024.jpg",
  );

  // Clockwise from viewer (camera at +Z): positive Y rotation
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere with texture */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 64, 64]} />
        <meshStandardMaterial map={texture} roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Subtle atmosphere glow */}
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS * 1.04, 32, 32]} />
        <meshBasicMaterial
          color="#4488ff"
          transparent
          opacity={0.06}
          side={THREE.BackSide}
        />
      </mesh>
    </group>
  );
}

// Fallback wireframe globe shown while texture loads
function WireframeGlobe() {
  const groupRef = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (groupRef.current) groupRef.current.rotation.y += delta * 0.2;
  });
  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[GLOBE_RADIUS, 32, 32]} />
        <meshBasicMaterial color="#1a6fbf" wireframe />
      </mesh>
    </group>
  );
}

// ─── Currency text sprite — Clean White/Silver palette ───
function makeCurrencySprite(symbol: string): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  // White/silver clean circle
  const grad = ctx.createRadialGradient(64, 64, 10, 64, 64, 55);
  grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
  grad.addColorStop(0.55, "rgba(220, 220, 220, 0.80)");
  grad.addColorStop(1, "rgba(200, 200, 200, 0)");
  ctx.beginPath();
  ctx.arc(64, 64, 55, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  const isLong = [...symbol].length > 1;
  ctx.font = `bold ${isLong ? 34 : 52}px Arial, sans-serif`;
  ctx.fillStyle = "#1a1a1a"; // dark text for contrast on white
  ctx.shadowColor = "rgba(0,0,0,0.3)";
  ctx.shadowBlur = 8;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbol, 64, 66);

  return new THREE.CanvasTexture(canvas);
}

// Three orbital plane tilts
const ORBIT_TILTS = [
  { rx: 0.3, rz: 0.1, r: GLOBE_RADIUS + 1.1 },
  { rx: -0.4, rz: 0.5, r: GLOBE_RADIUS + 1.4 },
  { rx: 1.0, rz: -0.3, r: GLOBE_RADIUS + 1.0 },
];

const CURRENCIES: {
  id: string;
  symbol: string;
  orbit: number;
  phase: number;
  speed: number;
  size: number;
}[] = [
  { id: "inr", symbol: "\u20b9", orbit: 0, phase: 0, speed: 0.48, size: 1.3 },
  {
    id: "aed",
    symbol: "\u062f.\u0625",
    orbit: 1,
    phase: 0.8,
    speed: 0.38,
    size: 1.2,
  },
  { id: "usd", symbol: "$", orbit: 2, phase: 1.6, speed: 0.44, size: 1.1 },
  {
    id: "eur",
    symbol: "\u20ac",
    orbit: 0,
    phase: Math.PI,
    speed: 0.48,
    size: 1.1,
  },
  {
    id: "jpy",
    symbol: "\u00a5",
    orbit: 1,
    phase: Math.PI + 0.8,
    speed: 0.38,
    size: 1.1,
  },
  {
    id: "gbp",
    symbol: "\u00a3",
    orbit: 2,
    phase: Math.PI + 1.6,
    speed: 0.44,
    size: 1.1,
  },
];

function FloatingCurrency({
  symbol,
  orbit,
  phase,
  speed,
  size,
}: {
  symbol: string;
  orbit: number;
  phase: number;
  speed: number;
  size: number;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  // Clockwise orbits: angle DECREASES so the particle moves right→down→left→up
  const angleRef = useRef(phase);
  const texture = useMemo(() => makeCurrencySprite(symbol), [symbol]);
  const tilt = ORBIT_TILTS[orbit];

  useFrame((_, delta) => {
    // Subtract angle for clockwise orbit (from viewer perspective)
    angleRef.current -= delta * speed;
    const a = angleRef.current;
    const r = tilt.r;

    let x = r * Math.cos(a);
    let y = r * Math.sin(a);
    let z = 0;

    const y1 = y * Math.cos(tilt.rx) - z * Math.sin(tilt.rx);
    const z1 = y * Math.sin(tilt.rx) + z * Math.cos(tilt.rx);
    y = y1;
    z = z1;

    const x2 = x * Math.cos(tilt.rz) - y * Math.sin(tilt.rz);
    const y2 = x * Math.sin(tilt.rz) + y * Math.cos(tilt.rz);
    x = x2;
    y = y2;

    if (spriteRef.current) spriteRef.current.position.set(x, y, z);
  });

  return (
    <sprite ref={spriteRef} scale={[size, size, size]}>
      <spriteMaterial map={texture} transparent depthWrite={false} />
    </sprite>
  );
}

function CurrencyParticles() {
  return (
    <>
      {CURRENCIES.map((cfg) => (
        <FloatingCurrency key={cfg.id} {...cfg} />
      ))}
    </>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[8, 6, 8]} color="#ffffff" intensity={2.5} />
      <pointLight
        position={[-6, 4, 5]}
        color="#ffffff"
        intensity={6}
        distance={30}
      />
      {/* Suspense wraps EarthGlobe which suspends via useLoader */}
      <Suspense fallback={<WireframeGlobe />}>
        <EarthGlobe />
      </Suspense>
      <CurrencyParticles />
    </>
  );
}

export default function HeroAnimation() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 1.5, 11], fov: 50 }}
      gl={{ alpha: true, antialias: false }}
      frameloop="always"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
      }}
    >
      <Scene />
    </Canvas>
  );
}
