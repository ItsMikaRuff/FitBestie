import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

const Muscle = ({ position, rotation, scale, name, color = '#4a90e2', onHover, onClick }) => {
  const meshRef = useRef();
  const [hovered, setHovered] = React.useState(false);

  useFrame(() => {
    if (hovered) {
      meshRef.current.material.color.set('#ff0000');
    } else {
      meshRef.current.material.color.set(color);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      rotation={rotation}
      scale={scale}
      name={name}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        onHover(name);
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        onHover(null);
      }}
      onClick={(e) => {
        e.stopPropagation();
        onClick(name);
      }}
    >
      <boxGeometry attach="geometry" args={[1, 1, 1]} />
      <meshStandardMaterial attach="material" color={color} />
    </mesh>
  );
};

const HumanBody = ({ onMuscleHover, onMuscleClick }) => {
  const groupRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    groupRef.current.rotation.y = Math.sin(t / 4) / 8;
  });

  return (
    <group ref={groupRef}>
      {/* Arms */}
      <Muscle
        position={[-1.5, 0, 0]}
        rotation={[0, 0, Math.PI / 4]}
        scale={[0.3, 1, 0.3]}
        name="biceps"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />
      <Muscle
        position={[1.5, 0, 0]}
        rotation={[0, 0, -Math.PI / 4]}
        scale={[0.3, 1, 0.3]}
        name="triceps"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />

      {/* Legs */}
      <Muscle
        position={[-0.5, -1.5, 0]}
        rotation={[0, 0, 0]}
        scale={[0.4, 1, 0.4]}
        name="quadriceps"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />
      <Muscle
        position={[0.5, -1.5, 0]}
        rotation={[0, 0, 0]}
        scale={[0.4, 1, 0.4]}
        name="hamstrings"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />

      {/* Core */}
      <Muscle
        position={[0, -0.5, 0]}
        rotation={[0, 0, 0]}
        scale={[0.8, 0.8, 0.3]}
        name="abs"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />
      <Muscle
        position={[0, -0.5, 0.3]}
        rotation={[0, 0, 0]}
        scale={[0.8, 0.8, 0.3]}
        name="obliques"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />

      {/* Chest */}
      <Muscle
        position={[0, 0.5, 0.3]}
        rotation={[0, 0, 0]}
        scale={[1, 0.6, 0.3]}
        name="pectoralis"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />

      {/* Back */}
      <Muscle
        position={[0, 0.5, -0.3]}
        rotation={[0, 0, 0]}
        scale={[1, 0.8, 0.3]}
        name="latissimus"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />
      <Muscle
        position={[0, 0.8, -0.3]}
        rotation={[0, 0, 0]}
        scale={[0.8, 0.4, 0.3]}
        name="trapezius"
        onHover={onMuscleHover}
        onClick={onMuscleClick}
      />
    </group>
  );
};

export default HumanBody; 