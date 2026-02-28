'use client';

import { useRef, useState, useEffect } from 'react';
import { Billboard } from '@react-three/drei';
import { useFrame, useLoader } from '@react-three/fiber';
import * as THREE from 'three';
import { Movie } from '@/lib/types';

interface PosterProps {
    movie: Movie;
    position: THREE.Vector3;
    onClick: (movie: Movie, position: THREE.Vector3) => void;
}

export default function Poster({ movie, position, onClick }: PosterProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);
    const [texture, setTexture] = useState<THREE.Texture | null>(null);
    const [loaded, setLoaded] = useState(false);
    const scaleRef = useRef(0);

    // Load texture manually with error handling
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
                setLoaded(true);
            },
            undefined,
            (err) => {
                console.warn(`Failed to load poster for ${movie.title}`, err);
                setLoaded(true); // Mark as loaded even on error so we don't block
            }
        );

        return () => {
            if (texture) {
                texture.dispose();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [movie.posterPath, movie.title]);

    // Animate scale - smooth pop-in when loaded, hover effect
    useFrame(() => {
        if (!meshRef.current) return;
        const baseTarget = loaded ? 1 : 0;
        const targetScale = hovered ? baseTarget * 1.15 : baseTarget;
        scaleRef.current += (targetScale - scaleRef.current) * 0.08;
        meshRef.current.scale.setScalar(scaleRef.current);
    });

    if (!movie.posterPath) return null;

    return (
        <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick(movie, position);
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
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
                        side={THREE.DoubleSide}
                        emissive={hovered ? new THREE.Color(0.15, 0.15, 0.25) : new THREE.Color(0, 0, 0)}
                        emissiveIntensity={hovered ? 1 : 0}
                    />
                ) : (
                    <meshStandardMaterial
                        color="#1a1a2e"
                        transparent
                        opacity={0.5}
                        side={THREE.DoubleSide}
                    />
                )}
            </mesh>
        </Billboard>
    );
}
