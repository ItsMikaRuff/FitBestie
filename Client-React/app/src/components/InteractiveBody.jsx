/* eslint-disable react/no-unknown-property */
import React, { useRef, useState } from 'react';
import { useGLTF } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

const InteractiveBody = ({ onMuscleClick }) => {
    const group = useRef();
    const female = useGLTF('/models/female.gltf');
    const [hovered, setHovered] = useState(null);

    useFrame(() => {
        if (group.current) {
            // ניתן להפעיל סיבוב אם רוצים
            // group.current.rotation.y += 0.002;
        }
    });

    const clickableZones = [
        {
            name: 'abs',
            position: [0, 0.4, 0.15], // מרכז הבטן
            size: [0.35, 0.5, 0.15],
        },
        {
            name: 'quadriceps',
            position: [0.25, -0.2, 0.15], // רגל ימין קדמית
            size: [0.3, 0.7, 0.15],
        },
        {
            name: 'hamstrings',
            position: [-0.25, -0.2, 0.15], // רגל שמאל קדמית
            size: [0.3, 0.7, 0.15],
        },
        {
            name: 'pectoralis',
            position: [0, 1.05, 0.2], // חזה
            size: [0.5, 0.25, 0.15],
        },
        {
            name: 'biceps',
            position: [0.45, 0.9, 0.1], // יד ימין
            size: [0.2, 0.5, 0.15],
        },
        {
            name: 'triceps',
            position: [-0.45, 0.9, 0.1], // יד שמאל
            size: [0.2, 0.5, 0.15],
        },
    ];

    return (
        <group
            ref={group}
            scale={[6, 6, 6]}
            position={[0, -5.5, 0]}
            rotation={[0, Math.PI, 0]}
        >
            <primitive object={female.scene} />

            {clickableZones.map((zone) => (
                <mesh
                    key={zone.name}
                    position={zone.position}
                    onClick={() => onMuscleClick(zone.name)}
                    onPointerOver={() => setHovered(zone.name)}
                    onPointerOut={() => setHovered(null)}
                >
                    <boxGeometry args={zone.size} />
                    <meshStandardMaterial
                        color={hovered === zone.name ? 'red' : 'white'}
                        transparent
                        opacity={hovered === zone.name ? 0.3 : 0.01}
                    />
                </mesh>
            ))}
        </group>
    );
};

export default InteractiveBody;
