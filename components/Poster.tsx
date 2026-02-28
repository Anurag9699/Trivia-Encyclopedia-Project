'use client';

import { useRef, useState, useEffect } from 'react';
import { Billboard } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Movie } from '@/lib/types';

interface PosterProps {
    movie: Movie;
    position: THREE.Vector3;
    onClick: (movie: Movie, position: THREE.Vector3) => void;
    dimmed?: boolean;
}

export default function Poster({ movie, position, onClick, dimmed = false }: PosterProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const glowRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [loaded, setLoaded] = useState(false);
    const scaleRef = useRef(0);
    const glowIntensityRef = useRef(0);
    const pulseRef = useRef(Math.random() * Math.PI * 2); // Random phase for breathing

    // Load texture
    useEffect(() => {
        if (!movie.posterPath) return;

        const loader = new THREE.TextureLoader();
        loader.crossOrigin = 'anonymous';

        loader.load(
            `https://image.tmdb.org/t/p/w342${movie.posterPath}`,
            (tex) => {
                tex.minFilter = THREE.LinearFilter;
                tex.magFilter = THREE.LinearFilter;
                tex.colorSpace = THREE.SRGBColorSpace;
                setTexture(tex);
                // Staggered pop-in with random delay
                setTimeout(() => setLoaded(true), Math.random() * 1500);
            },
            undefined,
            () => {
                setLoaded(true);
            }
        );

        return () => {
            if (texture) texture.dispose();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movie.posterPath]);

    // Animate scale, glow, and breathing
    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        // Target scale: spring pop-in + hover scale + dimmed effect
        const baseScale = loaded ? (dimmed ? 0.6 : 1) : 0;
        const breathe = loaded && !hovered ? Math.sin(time * 0.5 + pulseRef.current) * 0.02 : 0;
        const targetScale = (hovered ? baseScale * 1.2 : baseScale) + breathe;

        // Spring-like easing
        scaleRef.current += (targetScale - scaleRef.current) * 0.08;
        meshRef.current.scale.setScalar(scaleRef.current);

        // Glow intensity animation
        const targetGlow = hovered ? 1 : 0;
        glowIntensityRef.current += (targetGlow - glowIntensityRef.current) * 0.1;

        if (glowRef.current) {
            const mat = glowRef.current.material as THREE.MeshBasicMaterial;
            mat.opacity = glowIntensityRef.current * 0.3;
            glowRef.current.scale.setScalar(scaleRef.current * 1.08);
        }
    });

    if (!movie.posterPath) return null;

    return (
        <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
            {/* Glow border behind poster */}
            <mesh ref={glowRef}>
                <planeGeometry args={[2.1, 3.0]} />
                <meshBasicMaterial
                    color="#8b5cf6"
                    transparent
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>

            {/* Main poster */}
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    if (!dimmed) onClick(movie, position);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    if (!dimmed) {
                        setHovered(true);
                        document.body.style.cursor = 'pointer';
                    }
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                <planeGeometry args={[1.8, 2.7]} />
                {texture ? (
                    <meshStandardMaterial
                        map={texture}
                        transparent
                        opacity={dimmed ? 0.3 : 1}
                        side={THREE.DoubleSide}
                        emissive={hovered ? new THREE.Color(0.2, 0.15, 0.35) : new THREE.Color(0, 0, 0)}
                        emissiveIntensity={hovered ? 1.5 : 0}
                    />
                ) : (
                    <meshStandardMaterial
                        color="#1a1a2e"
                        transparent
                        opacity={0.3}
                        side={THREE.DoubleSide}
                    />
                )}
            </mesh>
        </Billboard>
    );
}
