import React, { useState } from 'react';
import styled from 'styled-components';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import HumanBody from '../components/HumanBody';

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
  width: 100%;
  height: 500px;
  background: white;
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

  // Mock video data - replace with actual API call
  const videos = {
    biceps: [
      { id: 1, title: 'Bicep Curls Tutorial', url: 'https://www.youtube.com/embed/ykJmrZ5v0Oo' },
      { id: 2, title: 'Hammer Curls Guide', url: 'https://www.youtube.com/embed/TwD-YGVP4Bk' },
    ],
    triceps: [
      { id: 3, title: 'Tricep Pushdowns', url: 'https://www.youtube.com/embed/2-LAMcpzODU' },
      { id: 4, title: 'Skull Crushers', url: 'https://www.youtube.com/embed/d_KZxkY_0cM' },
    ],
    // Add more muscle groups and their corresponding videos
  };

  const handleMuscleClick = (muscleName) => {
    setSelectedMuscle(muscleName);
  };

  const handleMuscleHover = (muscleName) => {
    // We'll keep this function for future use
    console.log('Hovered muscle:', muscleName);
  };

  return (
    <Container>
      <Title>Workout Videos</Title>
      <ModelContainer>
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight attach="light" intensity={0.5} />
          <spotLight 
            attach="light"
            position={[10, 10, 10]} 
            angle={0.15} 
            penumbra={1} 
          />
          <HumanBody onMuscleClick={handleMuscleClick} onMuscleHover={handleMuscleHover} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
          <Environment preset="city" />
        </Canvas>
      </ModelContainer>

      {selectedMuscle && (
        <>
          <SelectedMuscle>
            Selected Muscle: {selectedMuscle}
          </SelectedMuscle>
          <VideoGallery>
            {videos[selectedMuscle]?.map((video) => (
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
        </>
      )}
    </Container>
  );
};

export default WorkoutVideos; 