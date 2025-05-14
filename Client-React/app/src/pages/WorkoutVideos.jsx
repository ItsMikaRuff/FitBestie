/* eslint-disable react/no-unknown-property */

import React, { useState } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import InteractiveBody from '../components/InteractiveBody';


const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  min-height: 100vh;
  background: #f5f5f5;
`;

const Title = styled.h1`
  color: #333;
  margin-bottom: 2rem;
  text-align: center;
`;

const ModelContainer = styled.div`
  width: 70%;
  height: 700px;
  background: #f0f0f0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const VideoGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 100%;
  max-width: 1200px;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-5px);
  }
`;

const VideoTitle = styled.h3`
  padding: 1rem;
  margin: 0;
  color: #333;
`;

const SelectedMuscle = styled.div`
  font-size: 1.2rem;
  color: #666;
  margin-bottom: 1rem;
  text-align: center;
`;

const WorkoutVideos = () => {
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const mapMuscleName = (meshName) => {
    const lower = meshName.toLowerCase();

    if (lower.includes("arm") || lower.includes("bicep")) return "biceps";
    if (lower.includes("tricep")) return "triceps";
    if (lower.includes("spine") || lower.includes("chest")) return "pectoralis";
    if (lower.includes("head")) return "neck";
    if (lower.includes("leg") || lower.includes("quad")) return "quadriceps";
    if (lower.includes("hamstring")) return "hamstrings";
    if (lower.includes("abs")) return "abs";
    if (lower.includes("oblique")) return "obliques";
    if (lower.includes("back") || lower.includes("lat")) return "latissimus";
    if (lower.includes("trap")) return "trapezius";

    return null;
  };


  // Mock video data - replace with actual API call
  const videos = {
    fullbody: [
      { id: 100, title: 'Full Body HIIT', url: 'https://www.youtube.com/embed/ml6cT4AZdqI' },
      { id: 101, title: 'Total Body Strength', url: 'https://www.youtube.com/embed/UItWltVZZmE' },
    ],
    biceps: [
      { id: 1, title: 'Bicep Curls Tutorial', url: 'https://www.youtube.com/embed/ykJmrZ5v0Oo' },
      { id: 2, title: 'Hammer Curls Guide', url: 'https://www.youtube.com/embed/TwD-YGVP4Bk' },
    ],
    triceps: [
      { id: 3, title: 'Tricep Pushdowns', url: 'https://www.youtube.com/embed/2-LAMcpzODU' },
      { id: 4, title: 'Skull Crushers', url: 'https://www.youtube.com/embed/d_KZxkY_0cM' },
    ],
    abs: [
      { id: 5, title: 'Abs Workout', url: 'https://www.youtube.com/embed/1919eTCoESo' },
    ],
    obliques: [
      { id: 6, title: 'Oblique Burn', url: 'https://www.youtube.com/embed/DcWqXUuO6Zk' },
    ],
    quadriceps: [
      { id: 7, title: 'Quad Exercises', url: 'https://www.youtube.com/embed/VmB1G1K7v94' },
    ],
    hamstrings: [
      { id: 8, title: 'Hamstring Workout', url: 'https://www.youtube.com/embed/1Tq3QdYUuHs' },
    ],
    pectoralis: [
      { id: 9, title: 'Chest Workout', url: 'https://www.youtube.com/embed/fkUsX9vJVMs' },
    ],
    latissimus: [
      { id: 10, title: 'Lat Workout', url: 'https://www.youtube.com/embed/EF0f4yCMiDU' },
    ],
    trapezius: [
      { id: 11, title: 'Trapezius Shrugs', url: 'https://www.youtube.com/embed/qEwKCR5JCog' },
    ],

    // Add more muscle groups and their corresponding videos
  };

  const handleMuscleClick = (muscleName) => {
    const mapped = mapMuscleName(muscleName);
    if (mapped) setSelectedMuscle(mapped);
    else setSelectedMuscle(null);
  };

  // לחיצה במקום ריק בתוך ה־Canvas -> Full Body
  const handleFullBodyClick = () => {
    setSelectedMuscle('fullbody');
  };

  const handleMuscleHover = (muscleName) => {
    console.log("Hovered muscle:", muscleName);
  };


  return (
    <Container>
      <Title>Workout Videos</Title>
      <ModelContainer>
        <Canvas camera={{ position: [0, 2, 19], fov: 40 }}>
          onPointerMissed={handleFullBodyClick}
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          <InteractiveBody
            onMuscleClick={handleMuscleClick}
            onMuscleHover={handleMuscleHover}
          />
          <OrbitControls makeDefault enablePan enableZoom enableRotate />

          <Environment preset="city" />
        </Canvas>
      </ModelContainer>

      {selectedMuscle && (
        <>
          <SelectedMuscle>
            Selected Muscle: {selectedMuscle}
          </SelectedMuscle>
          {videos[selectedMuscle]?.length > 0 ? (
            <VideoGallery>
              {videos[selectedMuscle].map((video) => (
                <VideoCard key={video.id}>
                  <iframe
                    width="100%"
                    height="200"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  <VideoTitle>{video.title}</VideoTitle>
                </VideoCard>
              ))}
            </VideoGallery>
          ) : (
            <p>No videos available for this muscle group yet.</p>
          )}
        </>
      )}

    </Container>
  );
};

export default WorkoutVideos; 