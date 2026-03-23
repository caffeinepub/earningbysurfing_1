import { useLoader } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

// NASA Blue Marble texture (via unpkg CDN — three-globe package)
const NASA_TEXTURE_URL =
  "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg";
const NASA_CLOUDS_URL =
  "https://unpkg.com/three-globe/example/img/earth-clouds.png";

// ─── Wave Ocean ────────────────────────────────────────────────────────────────
function WaveOcean() {
  const meshRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const mesh = meshRef.current;
    if (!mesh) return;
    const geo = mesh.geometry as THREE.BufferGeometry;
    const pos = geo.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      const y =
        Math.sin(x * 0.4 + t * 0.8) * 0.6 + Math.sin(z * 0.3 + t * 0.6) * 0.4;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[80, 40, 50, 25]} />
      <meshStandardMaterial
        color="#FF9933"
        metalness={0.3}
        roughness={0.6}
        transparent
        opacity={0.55}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// ─── Surfboard ─────────────────────────────────────────────────────────────────
function Surfboard() {
  const boardRef = useRef<THREE.Mesh>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    const t = timeRef.current;
    const board = boardRef.current;
    if (!board) return;
    board.position.y = 1.2 + Math.sin(t * 1.1) * 0.25;
    board.rotation.y += 0.003;
    board.rotation.x = Math.sin(t * 0.7) * 0.08;
  });

  return (
    <mesh ref={boardRef} position={[0, 1.2, 0]} scale={[1, 0.18, 1]}>
      <capsuleGeometry args={[0.4, 3.5, 8, 16]} />
      <meshStandardMaterial
        color="#FFD700"
        metalness={0.9}
        roughness={0.1}
        emissive="#FF9933"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// ─── NASA Globe (with satellite texture from CDN) ─────────────────────────────
function NASAGlobe() {
  const earthTexture = useLoader(THREE.TextureLoader, NASA_TEXTURE_URL);
  const cloudTexture = useLoader(THREE.TextureLoader, NASA_CLOUDS_URL);
  const globeRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (globeRef.current) globeRef.current.rotation.y += delta * 0.2;
    if (cloudsRef.current) cloudsRef.current.rotation.y += delta * 0.25;
  });

  return (
    <>
      {/* Atmosphere outer glow */}
      <mesh position={[6, 3, -5]} scale={1.08}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial
          color="#6aafff"
          transparent
          opacity={0.07}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Earth sphere with NASA texture */}
      <mesh ref={globeRef} position={[6, 3, -5]}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshPhongMaterial
          map={earthTexture}
          specular={new THREE.Color(0x333333)}
          shininess={18}
        />
      </mesh>

      {/* Cloud layer */}
      <mesh ref={cloudsRef} position={[6, 3, -5]} scale={1.015}>
        <sphereGeometry args={[3, 48, 48]} />
        <meshPhongMaterial
          map={cloudTexture}
          transparent
          opacity={0.4}
          depthWrite={false}
        />
      </mesh>

      {/* Sunlight from top-right */}
      <pointLight
        position={[14, 8, 2]}
        color="#fff5e0"
        intensity={60}
        distance={30}
      />
    </>
  );
}

// ─── Fallback Globe (canvas-painted, shown while texture loads) ───────────────
function FallbackGlobe() {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#1a4d8f";
    ctx.fillRect(0, 0, 512, 256);
    ctx.fillStyle = "#2d7a3c";
    // Basic continent blobs
    ctx.beginPath();
    ctx.ellipse(170, 110, 60, 55, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(280, 90, 110, 45, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(80, 80, 55, 40, 0.1, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(105, 145, 30, 45, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(390, 155, 45, 30, 0.2, 0, Math.PI * 2);
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
  }, []);

  useFrame((_, delta) => {
    if (meshRef.current) meshRef.current.rotation.y += delta * 0.2;
  });

  return (
    <mesh ref={meshRef} position={[6, 3, -5]}>
      <sphereGeometry args={[3, 48, 48]} />
      <meshStandardMaterial map={texture} metalness={0.1} roughness={0.7} />
    </mesh>
  );
}

// ─── Currency Texture ──────────────────────────────────────────────────────────
function makeCurrencyTexture(symbol: string, color = "#FFD700"): THREE.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  // Metallic disc
  const grad = ctx.createRadialGradient(48, 44, 4, 64, 64, 58);
  grad.addColorStop(0, color === "#FFD700" ? "#fff7a0" : "#f0f0f0");
  grad.addColorStop(0.5, color);
  grad.addColorStop(1, color === "#FFD700" ? "#a07000" : "#888888");

  ctx.beginPath();
  ctx.arc(64, 64, 56, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();

  // Rim
  ctx.strokeStyle = color === "#FFD700" ? "#c09000" : "#666666";
  ctx.lineWidth = 3;
  ctx.stroke();

  // Symbol — use smaller font for multi-char symbols like د.إ
  const isMultiChar = [...symbol].length > 1;
  ctx.font = `bold ${isMultiChar ? 36 : 52}px Arial, sans-serif`;
  ctx.fillStyle = "rgba(0,0,0,0.7)";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(symbol, 64, 68);

  return new THREE.CanvasTexture(canvas);
}

// ─── Orbiting Currency Tokens ─────────────────────────────────────────────────
const ORBIT_CONFIG = [
  {
    symbol: "\u20b9",
    color: "#FFD700",
    radius: 4.5,
    speed: 0.7,
    phase: 0,
    tilt: 0.3,
  },
  {
    symbol: "\u062f.\u0625",
    color: "#FFD700",
    radius: 5.0,
    speed: 0.55,
    phase: 1.05,
    tilt: 0.45,
  },
  {
    symbol: "$",
    color: "#C0C0C0",
    radius: 5.2,
    speed: 0.5,
    phase: 2.09,
    tilt: -0.4,
  },
  {
    symbol: "\u20ac",
    color: "#FFD700",
    radius: 4.8,
    speed: 0.8,
    phase: 3.14,
    tilt: 0.6,
  },
  {
    symbol: "\u00a3",
    color: "#C0C0C0",
    radius: 5.5,
    speed: 0.6,
    phase: 4.19,
    tilt: -0.2,
  },
  {
    symbol: "\u00a5",
    color: "#FFD700",
    radius: 4.2,
    speed: 0.9,
    phase: 5.24,
    tilt: 0.5,
  },
];

const GLOBE_CENTER = new THREE.Vector3(6, 3, -5);

function OrbitingToken({
  symbol,
  color,
  radius,
  speed,
  phase,
  tilt,
}: {
  symbol: string;
  color: string;
  radius: number;
  speed: number;
  phase: number;
  tilt: number;
}) {
  const spriteRef = useRef<THREE.Sprite>(null);
  const timeRef = useRef(phase);
  const texture = useMemo(
    () => makeCurrencyTexture(symbol, color),
    [symbol, color],
  );

  useFrame((_, delta) => {
    timeRef.current += delta * speed;
    const t = timeRef.current;
    const x = GLOBE_CENTER.x + Math.cos(t) * radius;
    const y = GLOBE_CENTER.y + Math.sin(t) * Math.sin(tilt) * radius * 0.5;
    const z = GLOBE_CENTER.z + Math.sin(t) * radius * Math.cos(tilt);
    if (spriteRef.current) spriteRef.current.position.set(x, y, z);
  });

  return (
    <sprite ref={spriteRef} scale={[1.2, 1.2, 1.2]}>
      <spriteMaterial
        map={texture}
        transparent
        opacity={0.92}
        depthWrite={false}
      />
    </sprite>
  );
}

function OrbitingCurrencyTokens() {
  return (
    <>
      {ORBIT_CONFIG.map((cfg) => (
        <OrbitingToken key={cfg.symbol} {...cfg} />
      ))}
    </>
  );
}

// ─── Data Streams ──────────────────────────────────────────────────────────────
const STREAM_CONFIG = [
  { x: -8, z: -5 },
  { x: -14, z: 2 },
  { x: 5, z: -8 },
  { x: 12, z: -3 },
  { x: -3, z: 4 },
  { x: 9, z: 6 },
];

function DataStream({
  x,
  z,
  offset,
}: { x: number; z: number; offset: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const timeRef = useRef(offset);

  useFrame((_, delta) => {
    timeRef.current += delta * 0.5;
    const mesh = ref.current;
    if (!mesh) return;
    mesh.position.y = ((timeRef.current % 8) - 4) * 1.2;
  });

  return (
    <mesh ref={ref} position={[x, 0, z]}>
      <cylinderGeometry args={[0.012, 0.012, 6, 6]} />
      <meshBasicMaterial color="#FF9933" transparent opacity={0.5} />
    </mesh>
  );
}

function DataStreams() {
  return (
    <>
      {STREAM_CONFIG.map((cfg, i) => (
        <DataStream
          key={`stream-${cfg.x}-${cfg.z}`}
          x={cfg.x}
          z={cfg.z}
          offset={i * 1.3}
        />
      ))}
    </>
  );
}

// ─── Scene ─────────────────────────────────────────────────────────────────────
function Scene() {
  return (
    <>
      <fog attach="fog" args={["#1a0a00", 18, 45]} />
      <ambientLight intensity={0.5} />
      <pointLight
        position={[5, 8, 3]}
        color="#FF9933"
        intensity={60}
        distance={30}
      />
      <pointLight
        position={[-6, 5, -2]}
        color="#FFD700"
        intensity={40}
        distance={25}
      />
      <pointLight
        position={[0, 3, 8]}
        color="#ffffff"
        intensity={20}
        distance={20}
      />
      <WaveOcean />
      <Surfboard />
      <Suspense fallback={<FallbackGlobe />}>
        <NASAGlobe />
      </Suspense>
      <OrbitingCurrencyTokens />
      <DataStreams />
    </>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function HeroAnimation() {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 5, 14], fov: 55 }}
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
