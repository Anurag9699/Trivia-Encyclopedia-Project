'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { Movie } from '@/lib/types';
import Poster from './Poster';
import Particles from './Particles';

interface SphereLayoutProps {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
    dimmedIds?: Set<number>;
}

// Fibonacci sphere distribution
function fibonacciSphere(count: number, radius: number): THREE.Vector3[] {
    const points: THREE.Vector3[] = [];
    const goldenRatio = (1 + Math.sqrt(5)) / 2;
    const angleIncrement = Math.PI * 2 * goldenRatio;

    for (let i = 0; i < count; i++) {
        const t = i / count;
        const inclination = Math.acos(1 - 2 * t);
        const azimuth = angleIncrement * i;

        const x = Math.sin(inclination) * Math.cos(azimuth) * radius;
        const y = Math.sin(inclination) * Math.sin(azimuth) * radius;
        const z = Math.cos(inclination) * radius;

        points.push(new THREE.Vector3(x, y, z));
    }

    return points;
}

function CameraController({
    target,
    isAnimating,
    onAnimationComplete,
}: {
    target: THREE.Vector3 | null;
    isAnimating: boolean;
    onAnimationComplete: () => void;
}) {
    const { camera } = useThree();
    const animationProgress = useRef(0);
    const startPosition = useRef(new THREE.Vector3());
    const hasStarted = useRef(false);

    useFrame(() => {
        if (!isAnimating || !target) {
            hasStarted.current = false;
            animationProgress.current = 0;
            return;
        }

        if (!hasStarted.current) {
            startPosition.current.copy(camera.position);
            hasStarted.current = true;
            animationProgress.current = 0;
        }

        animationProgress.current += 0.015;
        const t = Math.min(animationProgress.current, 1);
        // Smooth ease-out cubic
        const eased = 1 - Math.pow(1 - t, 3);

        const targetPos = target.clone().multiplyScalar(0.4);
        camera.position.lerpVectors(startPosition.current, targetPos, eased);
        camera.lookAt(target);

        if (t >= 1) {
            onAnimationComplete();
            hasStarted.current = false;
            animationProgress.current = 0;
        }
    });

    return null;
}

// Subtle mouse parallax when idle
function ParallaxController() {
    const { camera } = useThree();
    const baseRotation = useRef({ x: 0, y: 0 });

    useFrame((state) => {
        const { mouse } = state;
        baseRotation.current.x += (mouse.y * 0.02 - baseRotation.current.x) * 0.02;
        baseRotation.current.y += (mouse.x * 0.02 - baseRotation.current.y) * 0.02;
        camera.rotation.x += baseRotation.current.x * 0.1;
        camera.rotation.y += baseRotation.current.y * 0.1;
    });

    return null;
}

function Scene({
    movies,
    onSelectMovie,
    dimmedIds,
}: {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
    dimmedIds?: Set<number>;
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);
    const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hovering, setHovering] = useState(false);

    const positions = useMemo(
        () => fibonacciSphere(movies.length, 20),
        [movies.length]
    );

    const handlePosterClick = useCallback(
        (movie: Movie, position: THREE.Vector3) => {
            setCameraTarget(position);
            setIsAnimating(true);
            setTimeout(() => {
                onSelectMovie(movie);
            }, 900);
        },
        [onSelectMovie]
    );

    const handleAnimationComplete = useCallback(() => {
        setIsAnimating(false);
    }, []);

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1.2} color="#ffffff" />
            <pointLight position={[-10, -10, -10]} intensity={0.4} color="#8b7cf6" />
            <pointLight position={[0, 15, 0]} intensity={0.3} color="#3b82f6" />

            <CameraController
                target={cameraTarget}
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
            />

            <ParallaxController />

            <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.05}
                autoRotate
                autoRotateSpeed={hovering ? 0.1 : 0.4}
                enableZoom={true}
                minDistance={5}
                maxDistance={40}
                enabled={!isAnimating}
            />

            {/* Star field background */}
            <Stars
                radius={80}
                depth={60}
                count={2500}
                factor={4}
                saturation={0.2}
                fade
                speed={0.5}
            />

            {/* Floating particles */}
            <Particles count={60} />

            {movies.map((movie, index) => (
                <Poster
                    key={movie.id}
                    movie={movie}
                    position={positions[index]}
                    onClick={handlePosterClick}
                    dimmed={dimmedIds ? !dimmedIds.has(movie.id) && dimmedIds.size > 0 : false}
                />
            ))}

            {/* Post-processing effects */}
            <EffectComposer>
                <Bloom
                    intensity={0.8}
                    luminanceThreshold={0.6}
                    luminanceSmoothing={0.9}
                    mipmapBlur
                />
                <Vignette eskil={false} offset={0.1} darkness={0.8} />
            </EffectComposer>
        </>
    );
}

export default function SphereLayout({
    movies,
    onSelectMovie,
    dimmedIds,
}: SphereLayoutProps) {
    return (
        <div className="fixed inset-0 w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 0.1], fov: 75, near: 0.1, far: 200 }}
                gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                style={{ background: '#000000' }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={['#050510']} />
                <fog attach="fog" args={['#050510', 30, 50]} />
                <Scene movies={movies} onSelectMovie={onSelectMovie} dimmedIds={dimmedIds} />
            </Canvas>
        </div>
    );
}
