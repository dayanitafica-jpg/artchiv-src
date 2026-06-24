import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';

const reducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * view = 'hall' | 'library' | 'archive'
 * En 'hall': la cámara orbita lentamente mirando hacia el centro; el mouse
 * agrega paralaje. En los pasillos: dolly hacia adelante controlado por scroll.
 */
export default function CameraRig({ view, scrollTarget, mouseNDC, corridorLength }) {
  const { camera } = useThree();
  const scrollCurrent = useRef(0);
  const hallAngle = useRef(0);
  const transitionT = useRef(0);
  const prevView = useRef(view);

  useEffect(() => {
    if (prevView.current !== view) {
      transitionT.current = 0;
      prevView.current = view;
    }
  }, [view]);

  useFrame((state, delta) => {
    transitionT.current = Math.min(1, transitionT.current + delta * 1.6);
    const ease = 1 - Math.pow(1 - transitionT.current, 3);

    if (view === 'hall') {
      hallAngle.current += reducedMotion ? 0 : delta * 0.05;
      const r = 3.4;
      const targetX = Math.sin(hallAngle.current) * r * 0.15 + mouseNDC.current.x * 0.4;
      const targetZ = 3.6 + Math.cos(hallAngle.current) * 0.1;
      const targetY = 1.7 + mouseNDC.current.y * 0.15;

      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.position.z += (targetZ - camera.position.z) * 0.05;
      camera.lookAt(0, 1.5, 0);
    } else {
      const maxScroll = corridorLength - 4;
      scrollCurrent.current += (scrollTarget.current - scrollCurrent.current) * 0.07;
      const clamped = Math.min(maxScroll, scrollCurrent.current);

      const baseX = 0;
      const baseY = 1.7;
      const parX = mouseNDC.current.x * 0.35;
      const parY = mouseNDC.current.y * 0.16;
      const bob = reducedMotion ? 0 : Math.sin(state.clock.getElapsedTime() * 0.5) * 0.03;

      // Punto de entrada del pasillo: arranca cerca de la sala central (z≈4)
      // y se desliza con ease-out al entrar, para que la transición no sea un salto.
      const entryZ = 4 * (1 - ease);

      camera.position.x += (baseX + parX - camera.position.x) * 0.06;
      camera.position.y += (baseY + parY + bob - camera.position.y) * 0.06;
      camera.position.z = 6 - clamped + entryZ;
      camera.lookAt(camera.position.x * 0.4, 1.55, camera.position.z - 12);
    }
  });

  return null;
}
