'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function Particles({ count = 80 }: { count?: number }) {
    const meshRef = useRef<THREE.InstancedMesh>(null);
    const dummy = useMemo(() => new THREE.Object3D(), []);

    // Generate random particle positions and speeds
    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < count; i++) {
            temp.push({
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
                z: (Math.random() - 0.5) * 50,
                speed: 0.002 + Math.random() * 0.005,
                scale: 0.02 + Math.random() * 0.04,
                offset: Math.random() * Math.PI * 2,
            });
        }
        return temp;
    }, [count]);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();

        particles.forEach((particle, i) => {
            // Floating upward drift with sine wave
            const y = ((particle.y + time * particle.speed * 10) % 50) - 25;
            const x = particle.x + Math.sin(time * 0.3 + particle.offset) * 0.5;
            const z = particle.z + Math.cos(time * 0.2 + particle.offset) * 0.5;

            dummy.position.set(x, y, z);
            dummy.scale.setScalar(particle.scale);
            dummy.updateMatrix();
            meshRef.current!.setMatrixAt(i, dummy.matrix);
        });

        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <sphereGeometry args={[1, 6, 6]} />
            <meshBasicMaterial
                color="#8b7cf6"
                transparent
                opacity={0.4}
                depthWrite={false}
            />
        </instancedMesh>
    );
}
