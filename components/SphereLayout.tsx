'use client';

import { useRef, useState, useCallback, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Movie } from '@/lib/types';
import Poster from './Poster';

interface SphereLayoutProps {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
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

        animationProgress.current += 0.02;
        const t = Math.min(animationProgress.current, 1);
        const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        // Move camera toward the target poster (stop at 40% of the way)
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

function Scene({
    movies,
    onSelectMovie,
}: {
    movies: Movie[];
    onSelectMovie: (movie: Movie) => void;
}) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const controlsRef = useRef<any>(null);
    const [cameraTarget, setCameraTarget] = useState<THREE.Vector3 | null>(null);
    const [isAnimating, setIsAnimating] = useState(false);

    const positions = useMemo(
        () => fibonacciSphere(movies.length, 18),
        [movies.length]
    );

    const handlePosterClick = useCallback(
        (movie: Movie, position: THREE.Vector3) => {
            setCameraTarget(position);
            setIsAnimating(true);
            // Open modal after a brief delay for zoom effect
            setTimeout(() => {
                onSelectMovie(movie);
            }, 800);
        },
        [onSelectMovie]
    );

    const handleAnimationComplete = useCallback(() => {
        setIsAnimating(false);
    }, []);

    return (
        <>
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <pointLight position={[-10, -10, -10]} intensity={0.5} />

            <CameraController
                target={cameraTarget}
                isAnimating={isAnimating}
                onAnimationComplete={handleAnimationComplete}
            />

            <OrbitControls
                ref={controlsRef}
                enableDamping
                dampingFactor={0.05}
                autoRotate
                autoRotateSpeed={0.3}
                enableZoom={true}
                minDistance={5}
                maxDistance={35}
                enabled={!isAnimating}
            />

            {movies.map((movie, index) => (
                <Poster
                    key={movie.id}
                    movie={movie}
                    position={positions[index]}
                    onClick={handlePosterClick}
                />
            ))}
        </>
    );
}

export default function SphereLayout({
    movies,
    onSelectMovie,
}: SphereLayoutProps) {
    return (
        <div className="fixed inset-0 w-full h-full">
            <Canvas
                camera={{ position: [0, 0, 0.1], fov: 75, near: 0.1, far: 100 }}
                gl={{ antialias: true, alpha: false }}
                style={{ background: '#000000' }}
                dpr={[1, 1.5]}
            >
                <color attach="background" args={['#000000']} />
                <fog attach="fog" args={['#000000', 25, 40]} />
                <Scene movies={movies} onSelectMovie={onSelectMovie} />
            </Canvas>
        </div>
    );
}
