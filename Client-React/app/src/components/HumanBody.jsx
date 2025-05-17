import React, { useState } from 'react';
import styled from 'styled-components';

import bodyFront from '../Images/bodyFront.png';
import bodyBack from '../Images/bodyBack.png';

const Container = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: auto;
`;

const Img = styled.img`
  width: 100%;
  display: block;
`;

const Hotspot = styled.div`
  position: absolute;
  cursor: pointer;
  border-radius: 50%;
  background-color: ${({ $hovered }) => ($hovered ? 'rgba(255, 0, 0, 0.4)' : 'transparent')};
  border: ${({ $hovered }) => ($hovered ? '2px solid red' : 'none')};
  width: ${({ size }) => size || '8%'};
  height: ${({ size }) => size || '8%'};
  transform: translate(-50%, -50%);
`;

const ToggleView = styled.button`
  margin: 10px auto;
  display: block;
  padding: 0.5rem 1rem;
  font-weight: bold;
  border: none;
  background: #333;
  color: white;
  border-radius: 5px;
  cursor: pointer;
`;

const hotspotsFront = [
  { name: 'front-shoulder-left', top: '22%', left: '38%' },
  { name: 'front-shoulder-right', top: '22%', left: '62%' },
  { name: 'front-arm-left', top: '30%', left: '30%' },
  { name: 'front-arm-right', top: '30%', left: '70%' },
  { name: 'chest', top: '30%', left: '50%' },
  { name: 'abs', top: '43%', left: '50%' },
  { name: 'oblique-left', top: '43%', left: '39%' },
  { name: 'oblique-right', top: '43%', left: '60%' },
  { name: 'front-thigh-left', top: '60%', left: '40%' },
  { name: 'front-thigh-right', top: '60%', left: '60%' },
  { name: 'front-knee-left', top: '70%', left: '42%' },
  { name: 'front-knee-right', top: '70%', left: '58%' },
  { name: 'front-foot-left', top: '90%', left: '40%' },
  { name: 'front-foot-right', top: '90%', left: '60%' },
];

const hotspotsBack = [
  { name: 'back-shoulder-left', top: '12%', left: '28%' },
  { name: 'back-shoulder-right', top: '12%', left: '72%' },
  { name: 'back-arm-left', top: '25%', left: '20%' },
  { name: 'back-arm-right', top: '25%', left: '80%' },
  { name: 'back', top: '20%', left: '50%' },
  { name: 'glutes', top: '42%', left: '50%' },
  { name: 'back-thigh-left', top: '60%', left: '40%' },
  { name: 'back-thigh-right', top: '60%', left: '60%' },
  { name: 'back-knee-left', top: '70%', left: '40%' },
  { name: 'back-knee-right', top: '70%', left: '60%' },
  { name: 'calf-left', top: '80%', left: '40%' },
  { name: 'calf-right', top: '80%', left: '60%' },
  { name: 'back-foot-left', top: '90%', left: '40%' },
  { name: 'back-foot-right', top: '90%', left: '60%' },
];

const HumanBody = ({ onMuscleHover = () => {}, onMuscleClick = () => {} }) => {
  const [view, setView] = useState('front');
  const [hovered, setHovered] = useState(null);

  const hotspots = view === 'front' ? hotspotsFront : hotspotsBack;

  return (
    <>
      <ToggleView onClick={() => setView(view === 'front' ? 'back' : 'front')}>
        {view === 'front' ? 'הצג גב' : 'הצג קדימה'}
      </ToggleView>

      <Container>
        <Img src={view === 'front' ? bodyFront : bodyBack} alt="Human body" />

        {hotspots.map((spot, idx) => (
          <Hotspot
            key={`${view}-${spot.name}-${idx}`}
            size={spot.size}
            style={{ top: spot.top, left: spot.left }}
            $hovered={hovered === `${spot.name}-${idx}`}
            onMouseEnter={() => {
              setHovered(`${spot.name}-${idx}`);
              onMuscleHover(spot.name);
            }}
            onMouseLeave={() => {
              setHovered(null);
              onMuscleHover(null);
            }}
            onClick={() => onMuscleClick(spot.name)}
          />
        ))}
      </Container>
    </>
  );
};

export default HumanBody;
