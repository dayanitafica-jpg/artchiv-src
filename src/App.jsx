import { useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import CentralHall from './scenes/CentralHall.jsx';
import Corridor, { WALL_X } from './scenes/Corridor.jsx';
import CameraRig from './scenes/CameraRig.jsx';
import { ARCHIVE_DOCS, ARCHIVE_CATEGORIES, LIBRARY_DOCS, LIBRARY_CATEGORIES } from './data/content.js';
import { Header, Breadcrumb, Filters, Hint, DetailPanel, ReturnPrompt, LoadingScreen } from './components/UI.jsx';

const CORRIDOR_LENGTH = 36;
const CENTER_Z = -(CORRIDOR_LENGTH / 2 - 1);

const ARCHIVE_LOOSE_SPOTS = [
  { x: -WALL_X - 0.05, y: 3.7, z: -1.5 },
  { x: WALL_X + 0.05, y: 0.7, z: -8 },
  { x: -WALL_X - 0.05, y: 4.1, z: -15 },
  { x: WALL_X + 0.05, y: 3.4, z: -19 },
  { x: -WALL_X - 0.05, y: 0.85, z: -24 },
  { x: WALL_X + 0.05, y: 4.3, z: -29 }
];

const LIBRARY_LOOSE_SPOTS = [
  { x: WALL_X + 0.05, y: 3.6, z: -2 },
  { x: -WALL_X - 0.05, y: 0.8, z: -9 },
  { x: WALL_X + 0.05, y: 4.0, z: -16 },
  { x: -WALL_X - 0.05, y: 3.3, z: -20 },
  { x: WALL_X + 0.05, y: 0.9, z: -25 },
  { x: -WALL_X - 0.05, y: 4.2, z: -30 }
];

const ARCHIVE_STACKS = [{ x: -0.5, z: -1.4 }, { x: 0.65, z: -2.4 }];
const LIBRARY_STACKS = [{ x: 0.5, z: -1.6 }, { x: -0.6, z: -2.6 }];

export default function App() {
  const [view, setView] = useState('hall'); // 'hall' | 'library' | 'archive'
  const [loading, setLoading] = useState(true);
  const [hintHidden, setHintHidden] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [archiveFilter, setArchiveFilter] = useState('Todos');
  const [libraryFilter, setLibraryFilter] = useState('Todos');

  const scrollTarget = useRef(0);
  const mouseNDC = useRef({ x: 0, y: 0 });
  const panelOpenRef = useRef(false);

  useEffect(() => {
    panelOpenRef.current = Boolean(selectedDoc);
  }, [selectedDoc]);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 850);
    return () => clearTimeout(t);
  }, []);

  // Reinicia el scroll del pasillo cada vez que cambiamos de sala.
  useEffect(() => {
    scrollTarget.current = 0;
  }, [view]);

  const handleNavigate = useCallback((next) => {
    setSelectedDoc(null);
    setView(next);
    setHintHidden(false);
  }, []);

  const handleOpenRandomDoc = useCallback(() => {
    const all = [...LIBRARY_DOCS, ...ARCHIVE_DOCS];
    const pick = all[Math.floor(Math.random() * all.length)];
    setSelectedDoc(pick);
  }, []);

  const hideHint = useCallback(() => {
    setHintHidden(true);
  }, []);

  useEffect(() => {
    function onWheel(e) {
      if (panelOpenRef.current) return;
      if (view === 'hall') return;
      e.preventDefault();
      const maxScroll = CORRIDOR_LENGTH - 4;
      scrollTarget.current = Math.max(0, Math.min(maxScroll, scrollTarget.current + e.deltaY * 0.012));
      hideHint();
    }

    let lastTouchY = 0;
    function onTouchStart(e) {
      lastTouchY = e.touches[0].clientY;
    }
    function onTouchMove(e) {
      if (panelOpenRef.current || view === 'hall') return;
      const dy = lastTouchY - e.touches[0].clientY;
      lastTouchY = e.touches[0].clientY;
      const maxScroll = CORRIDOR_LENGTH - 4;
      scrollTarget.current = Math.max(0, Math.min(maxScroll, scrollTarget.current + dy * 0.045));
      hideHint();
    }
    function onMouseMove(e) {
      mouseNDC.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseNDC.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') setSelectedDoc(null);
    }

    window.addEventListener('wheel', onWheel, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('wheel', onWheel);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [view, hideHint]);

  const activeFilter = view === 'library' ? libraryFilter : archiveFilter;
  const setActiveFilterFor = view === 'library' ? setLibraryFilter : setArchiveFilter;
  const categories = view === 'library' ? LIBRARY_CATEGORIES : ARCHIVE_CATEGORIES;

  const hintText =
    view === 'hall'
      ? 'elige un arco para entrar · click en un libro'
      : 'desplaza para avanzar · click en un documento';

  return (
    <>
      <LoadingScreen hidden={!loading} />

      <Canvas
        camera={{ fov: 58, near: 0.1, far: 100, position: [0, 1.7, 3.6] }}
        gl={{ antialias: true }}
        onCreated={({ gl, scene }) => {
          gl.setClearColor('#070707');
          scene.fog = new THREE.Fog(0x070707, 6, CORRIDOR_LENGTH + 2);
        }}
        onPointerMissed={() => {
          if (view !== 'hall') hideHint();
        }}
      >
        <ambientLight intensity={0.9} color="#3a3a3a" />
        <hemisphereLight args={['#4a4030', '#050505', 0.5]} />

        {view === 'hall' && (
          <CentralHall onEnterCorridor={handleNavigate} onOpenRandomDoc={handleOpenRandomDoc} />
        )}

        {view === 'library' && (
          <Corridor
            docs={LIBRARY_DOCS}
            looseSpots={LIBRARY_LOOSE_SPOTS}
            stackPositions={LIBRARY_STACKS}
            corridorLength={CORRIDOR_LENGTH}
            centerZ={CENTER_Z}
            wallStyle="library"
            glowColors={['rgba(255,224,170,1)', 'rgba(255,190,110,0.45)', 'rgba(255,190,110,0)']}
            lightColor="#ffd9a0"
            dustColor="#E0C285"
            activeFilter={libraryFilter}
            onSelectDoc={setSelectedDoc}
          />
        )}

        {view === 'archive' && (
          <Corridor
            docs={ARCHIVE_DOCS}
            looseSpots={ARCHIVE_LOOSE_SPOTS}
            stackPositions={ARCHIVE_STACKS}
            corridorLength={CORRIDOR_LENGTH}
            centerZ={CENTER_Z}
            wallStyle="archive"
            glowColors={['rgba(255,232,190,1)', 'rgba(255,205,140,0.45)', 'rgba(255,205,140,0)']}
            lightColor="#ffdca8"
            dustColor="#C9B98A"
            activeFilter={archiveFilter}
            onSelectDoc={setSelectedDoc}
          />
        )}

        <CameraRig view={view} scrollTarget={scrollTarget} mouseNDC={mouseNDC} corridorLength={CORRIDOR_LENGTH} />
      </Canvas>

      <div id="ui-root">
        <Header view={view} onNavigate={handleNavigate} />
        <Breadcrumb view={view} />
        {view !== 'hall' && (
          <Filters categories={categories} activeFilter={activeFilter} setActiveFilter={setActiveFilterFor} />
        )}
        <Hint text={hintText} hidden={hintHidden} />
        {view !== 'hall' && <ReturnPrompt onReturn={() => handleNavigate('hall')} />}
      </div>

      <DetailPanel doc={selectedDoc} onClose={() => setSelectedDoc(null)} />
    </>
  );
}
