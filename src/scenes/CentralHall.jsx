import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { makeBookCoverTexture, makeGlowTexture } from './textures.js';

const BOOK_COUNT = 14;

function FloatingBook({ index, onClick }) {
  const texture = useMemo(() => makeBookCoverTexture(index), [index]);
  const ref = useRef();
  const [hovered, setHovered] = useState(false);

  // Cada libro orbita en una elipse propia, con su propia fase y altura —
  // esto evita el patrón sincronizado que delataría una animación genérica.
  const params = useMemo(() => {
    const angle0 = (index / BOOK_COUNT) * Math.PI * 2 + Math.random() * 0.6;
    return {
      radiusX: 1.0 + Math.random() * 0.9,
      radiusZ: 0.8 + Math.random() * 0.7,
      baseY: 1.3 + Math.random() * 1.7,
      speed: 0.08 + Math.random() * 0.07,
      angle0,
      bobAmp: 0.08 + Math.random() * 0.1,
      bobSpeed: 0.4 + Math.random() * 0.5,
      tiltX: (Math.random() - 0.5) * 0.6,
      tiltZ: (Math.random() - 0.5) * 0.6,
      spinSpeed: (Math.random() - 0.5) * 0.25
    };
  }, [index]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const ang = params.angle0 + t * params.speed;
    const x = Math.cos(ang) * params.radiusX;
    const z = Math.sin(ang) * params.radiusZ;
    const y = params.baseY + Math.sin(t * params.bobSpeed + params.angle0) * params.bobAmp;
    if (ref.current) {
      ref.current.position.set(x, y, z);
      ref.current.rotation.x = params.tiltX + Math.sin(t * 0.3 + params.angle0) * 0.15;
      ref.current.rotation.z = params.tiltZ + Math.cos(t * 0.25 + params.angle0) * 0.15;
      ref.current.rotation.y = t * params.spinSpeed;
      const targetScale = hovered ? 1.35 : 1;
      const s = ref.current.scale.x + (targetScale - ref.current.scale.x) * 0.2;
      ref.current.scale.setScalar(s);
    }
  });

  return (
    <mesh
      ref={ref}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = 'pointer';
      }}
      onPointerOut={() => {
        setHovered(false);
        document.body.style.cursor = 'default';
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <boxGeometry args={[0.34, 0.05, 0.46]} />
      <meshLambertMaterial map={texture} emissive={hovered ? '#553311' : '#000000'} />
    </mesh>
  );
}

function Archway({ side, label, tone, onEnter }) {
  const x = side === 'left' ? -3.1 : 3.1;
  const rotY = side === 'left' ? Math.PI / 5 : -Math.PI / 5;
  const [hovered, setHovered] = useState(false);

  return (
    <group position={[x, 0, -1.6]} rotation={[0, rotY, 0]}>
      {/* Marco del arco: dos columnas + dintel */}
      <mesh position={[-0.62, 1.1, 0]}>
        <boxGeometry args={[0.16, 2.2, 0.16]} />
        <meshStandardMaterial color="#171410" roughness={0.85} />
      </mesh>
      <mesh position={[0.62, 1.1, 0]}>
        <boxGeometry args={[0.16, 2.2, 0.16]} />
        <meshStandardMaterial color="#171410" roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.22, 0]}>
        <boxGeometry args={[1.4, 0.16, 0.16]} />
        <meshStandardMaterial color="#171410" roughness={0.85} />
      </mesh>

      {/* Umbral luminoso dentro del arco: insinúa el pasillo sin renderizarlo completo */}
      <mesh position={[0, 1.1, -0.08]}>
        <planeGeometry args={[1.24, 2.04]} />
        <meshBasicMaterial color={tone} transparent opacity={hovered ? 0.5 : 0.32} />
      </mesh>

      {/* Zona clickeable, algo más grande que el marco para facilitar el hover */}
      <mesh
        position={[0, 1.1, 0.05]}
        visible={false}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={() => setHovered(false)}
        onClick={(e) => {
          e.stopPropagation();
          onEnter();
        }}
      >
        <boxGeometry args={[1.6, 2.4, 0.6]} />
      </mesh>

      <pointLight position={[0, 1.3, 0.3]} color={tone} intensity={hovered ? 6 : 3} distance={4} decay={2} />

      {/* Letrero */}
      <Html position={[0, 2.55, 0]} center distanceFactor={8} style={{ pointerEvents: 'none' }}>
        <div
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: hovered ? '#fff' : '#999',
            whiteSpace: 'nowrap',
            transition: 'color .2s'
          }}
        >
          {label} →
        </div>
      </Html>
    </group>
  );
}

function TableLamp() {
  return (
    <group position={[0, 0, 0]}>
      {/* Mesa redonda */}
      <mesh position={[0, 0.42, 0]}>
        <cylinderGeometry args={[0.62, 0.66, 0.06, 32]} />
        <meshStandardMaterial color="#1c140c" roughness={0.55} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.21, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.42, 12]} />
        <meshStandardMaterial color="#10100e" roughness={0.6} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.03, 32]} />
        <meshStandardMaterial color="#10100e" roughness={0.6} />
      </mesh>

      {/* Lámpara */}
      <mesh position={[0.18, 0.5, 0.1]}>
        <cylinderGeometry args={[0.012, 0.012, 0.32, 8]} />
        <meshStandardMaterial color="#2b2018" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[0.18, 0.67, 0.1]}>
        <coneGeometry args={[0.16, 0.2, 16, 1, true]} />
        <meshLambertMaterial color="#ffe2b0" emissive="#ffcd8c" emissiveIntensity={1.4} side={THREE.DoubleSide} />
      </mesh>
      <pointLight position={[0.18, 0.62, 0.1]} color="#ffcd8c" intensity={3.2} distance={6} decay={2} />
    </group>
  );
}

export default function CentralHall({ radius = 5.4, height = 6, onEnterCorridor, onOpenRandomDoc }) {
  const glowTex = useMemo(
    () => makeGlowTexture(['rgba(255,205,140,0.9)', 'rgba(255,160,90,0.3)', 'rgba(255,160,90,0)']),
    []
  );

  const floorTex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 512;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#0c0a08';
    ctx.fillRect(0, 0, 512, 512);
    const grad = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    grad.addColorStop(0, 'rgba(80,55,30,0.35)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
  }, []);

  return (
    <group>
      {/* Suelo circular */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <circleGeometry args={[radius, 48]} />
        <meshStandardMaterial map={floorTex} roughness={1} />
      </mesh>

      {/* Cúpula tenue */}
      <mesh position={[0, 0, 0]}>
        <sphereGeometry args={[radius + 1, 20, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshBasicMaterial color="#0a0908" side={THREE.BackSide} />
      </mesh>

      <TableLamp />

      {Array.from({ length: BOOK_COUNT }, (_, i) => (
        <FloatingBook key={i} index={i} onClick={onOpenRandomDoc} />
      ))}

      <Archway side="left" label="Biblioteca" tone="#ffcd8c" onEnter={() => onEnterCorridor('library')} />
      <Archway side="right" label="Archivo" tone="#e0506a" onEnter={() => onEnterCorridor('archive')} />

      {/* Resplandor ambiental cálido sobre la sala */}
      <sprite position={[0, 2.2, 0]} scale={[6, 6, 1]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
    </group>
  );
}
