import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

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

// ─── Glowing Particles ─────────────────────────────────────────────────────────
const PARTICLE_COUNT = 180;

function GlowParticles() {
  const instancedRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particleData = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }, () => ({
      x: (Math.random() - 0.5) * 40,
      y: Math.random() * 5 - 1,
      z: Math.random() * 20 - 15,
      speed: 0.015 + Math.random() * 0.03,
    }));
  }, []);

  useFrame(() => {
    const mesh = instancedRef.current;
    if (!mesh) return;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = particleData[i];
      p.y += p.speed;
      if (p.y > 5) {
        p.y = -1;
        p.x = (Math.random() - 0.5) * 40;
        p.z = Math.random() * 20 - 15;
      }
      dummy.position.set(p.x, p.y, p.z);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh
      ref={instancedRef}
      args={[undefined, undefined, PARTICLE_COUNT]}
    >
      <sphereGeometry args={[0.06, 6, 6]} />
      <meshBasicMaterial color="#FFCC44" />
    </instancedMesh>
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
      <ambientLight intensity={0.4} />
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
      <GlowParticles />
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
