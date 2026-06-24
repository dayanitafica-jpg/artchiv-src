import { useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import {
  makeInactiveTexture,
  makeActiveTexture,
  makeFloorTexture,
  makeShelfWallTexture,
  makeGlowTexture
} from './textures.js';

const WALL_X = 2.0;
const WALL_H = 5.2;

function DocumentPlane({ doc, hovered, setHovered, onSelect, activeFilter }) {
  const texture = useMemo(() => makeActiveTexture(doc), [doc]);
  const meshRef = useRef();
  const opacityRef = useRef(1);

  useFrame(() => {
    const match = activeFilter === 'Todos' || doc.category === activeFilter;
    const targetOpacity = match ? 1 : 0.1;
    opacityRef.current += (targetOpacity - opacityRef.current) * 0.1;
    if (meshRef.current) {
      meshRef.current.material.opacity = opacityRef.current;
      const targetScale = hovered === doc.id ? 1.07 : 1;
      const s = meshRef.current.scale.x + (targetScale - meshRef.current.scale.x) * 0.18;
      meshRef.current.scale.setScalar(s);
    }
  });

  const rotY = doc.x > 0 ? -0.32 : 0.32;

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[doc.x, doc.y, doc.z]}
        rotation={[0, rotY, 0]}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(doc.id);
        }}
        onPointerOut={() => setHovered(null)}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(doc);
        }}
      >
        <planeGeometry args={[1.3, 1.7]} />
        <meshStandardMaterial
          map={texture}
          emissiveMap={texture}
          emissive="#ffffff"
          emissiveIntensity={0.55}
          roughness={0.8}
          side={THREE.DoubleSide}
          transparent
          opacity={1}
        />
      </mesh>
      <mesh position={[doc.x, doc.y, doc.z - 0.03]} rotation={[0, rotY, 0]}>
        <planeGeometry args={[1.38, 1.78]} />
        <meshBasicMaterial color="#0a0a0a" />
      </mesh>
    </group>
  );
}

function LooseDocs({ spots }) {
  const textures = useMemo(() => spots.map(() => makeInactiveTexture()), [spots]);
  return (
    <>
      {spots.map((s, i) => (
        <mesh
          key={i}
          position={[s.x, s.y, s.z]}
          rotation={[0, s.x > 0 ? -0.34 : 0.34, (Math.random() - 0.5) * 0.18]}
        >
          <planeGeometry args={[0.85, 1.1]} />
          <meshLambertMaterial map={textures[i]} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </>
  );
}

function StackPile({ x, z }) {
  const textures = useMemo(() => Array.from({ length: 5 }, () => makeInactiveTexture()), []);
  return (
    <>
      {textures.map((tex, i) => (
        <mesh
          key={i}
          rotation={[-Math.PI / 2 + 0.12, 0, (Math.random() - 0.5) * 0.45]}
          position={[x + (Math.random() - 0.5) * 0.18, 0.02 + i * 0.05, z + (Math.random() - 0.5) * 0.18]}
        >
          <planeGeometry args={[1.0, 1.3]} />
          <meshLambertMaterial map={tex} />
        </mesh>
      ))}
    </>
  );
}

function DustField({ corridorLength, color, count = 220 }) {
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 3.6;
      arr[i * 3 + 1] = Math.random() * WALL_H;
      arr[i * 3 + 2] = -Math.random() * corridorLength;
    }
    return arr;
  }, [corridorLength, count]);

  const pointsRef = useRef();

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 1; i < pos.length; i += 3) {
      pos[i] += 0.0022;
      if (pos[i] > WALL_H) pos[i] = 0;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={color} size={0.016} transparent opacity={0.28} depthWrite={false} />
    </points>
  );
}

/**
 * Pasillo genérico. `palette` define el tono de luz ambiente y polvo;
 * `wallStyle` elige la variante de textura de estantería (archive | library).
 */
export default function Corridor({
  docs,
  looseSpots,
  stackPositions,
  corridorLength,
  centerZ,
  wallStyle = 'archive',
  glowColors,
  lightColor = '#ffdca8',
  dustColor = '#C9B98A',
  activeFilter,
  onSelectDoc,
  reducedMotion = false
}) {
  const [hovered, setHovered] = useState(null);

  const wallTexLeft = useMemo(() => {
    const tex = makeShelfWallTexture(wallStyle);
    const totalLen = corridorLength + 8;
    tex.repeat.set(totalLen / 8, 1);
    return tex;
  }, [wallStyle, corridorLength]);

  const wallTexRight = useMemo(() => {
    const tex = makeShelfWallTexture(wallStyle);
    const totalLen = corridorLength + 8;
    tex.repeat.set(totalLen / 8, 1);
    return tex;
  }, [wallStyle, corridorLength]);

  const floorTex = useMemo(() => makeFloorTexture(corridorLength), [corridorLength]);
  const glowTex = useMemo(() => makeGlowTexture(glowColors), [glowColors]);

  const lightPositions = useMemo(() => {
    const arr = [];
    const step = 8;
    for (let z = -2; z > -corridorLength; z -= step) arr.push(z);
    return arr;
  }, [corridorLength]);

  return (
    <group>
      {/* Suelo */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, centerZ]}>
        <planeGeometry args={[4.6, corridorLength + 10]} />
        <meshStandardMaterial map={floorTex} roughness={1} />
      </mesh>

      {/* Techo */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, WALL_H + 0.1, centerZ]}>
        <planeGeometry args={[4.6, corridorLength + 10]} />
        <meshStandardMaterial color="#0a0a0a" roughness={1} />
      </mesh>
      {[-0.55, 0.55].map((bx) => (
        <mesh key={bx} position={[bx, WALL_H, centerZ]}>
          <boxGeometry args={[0.08, 0.08, corridorLength + 10]} />
          <meshStandardMaterial color="#161616" roughness={0.7} metalness={0.25} />
        </mesh>
      ))}

      {/* Paredes de estantería */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-WALL_X, WALL_H / 2, centerZ]}>
        <planeGeometry args={[corridorLength + 8, WALL_H]} />
        <meshStandardMaterial map={wallTexLeft} roughness={0.96} />
      </mesh>
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[WALL_X, WALL_H / 2, centerZ]}>
        <planeGeometry args={[corridorLength + 8, WALL_H]} />
        <meshStandardMaterial map={wallTexRight} roughness={0.96} />
      </mesh>

      {/* Tablas de estante (bandas horizontales) */}
      {[-WALL_X, WALL_X].map((xSide) =>
        [1, 2, 3, 4].map((i) => (
          <mesh
            key={`${xSide}-${i}`}
            position={[xSide + (xSide > 0 ? 0.07 : -0.07), WALL_H - (WALL_H / 5) * i, centerZ]}
          >
            <boxGeometry args={[0.12, 0.05, corridorLength + 8]} />
            <meshStandardMaterial color="#171410" roughness={0.95} />
          </mesh>
        ))
      )}

      {/* Luces cálidas distribuidas por el pasillo */}
      {lightPositions.map((z) => (
        <pointLight key={z} position={[0, WALL_H - 0.6, z]} color={lightColor} intensity={20} distance={14} decay={1.6} />
      ))}

      {/* Luz de relleno pareja a lo largo de todo el pasillo, para que no queden
          tramos completamente negros entre una lámpara y otra. */}
      <pointLight position={[0, 1.4, centerZ]} color={lightColor} intensity={3} distance={corridorLength + 14} decay={0.6} />

      {/* Resplandor al final del pasillo */}
      <sprite position={[0, 2.5, -(corridorLength + 4)]} scale={[9, 9, 1]}>
        <spriteMaterial map={glowTex} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <pointLight position={[0, 2.6, -(corridorLength + 2)]} color={lightColor} intensity={10} distance={26} decay={1.4} />

      <LooseDocs spots={looseSpots} />
      {stackPositions.map((p, i) => (
        <StackPile key={i} x={p.x} z={p.z} />
      ))}

      {docs.map((doc) => (
        <DocumentPlane
          key={doc.id}
          doc={doc}
          hovered={hovered}
          setHovered={setHovered}
          onSelect={onSelectDoc}
          activeFilter={activeFilter}
        />
      ))}

      {!reducedMotion && <DustField corridorLength={corridorLength} color={dustColor} />}
    </group>
  );
}

export { WALL_X, WALL_H };
