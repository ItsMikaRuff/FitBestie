//WorkoutVideos.jsx

import React, { useState, useRef} from 'react';
import styled from 'styled-components';
import HumanBody from '../components/HumanBody';

const Container = styled.div`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
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
  max-width: 600px;
  background: #f5f5f5;
  border-radius: 10px;
  margin-bottom: 2rem;
`;

const VideoGallery = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box
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

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%; /* יחס של 16:9 */
  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: auto;
  }
`;

const WorkoutVideos = () => {
  const videoSectionRef = useRef(null);
  const [selectedMuscle, setSelectedMuscle] = useState(null);

  const videos = {
    'front-arm-left': [
      { id: 1, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/sLGKDQAESGo?start=1' },
      { id: 2, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/zdmZYCGkCgU?start=1' },
      { id: 3, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k' },
      { id: 4, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/eJMy9LglyF0' }
    ],
    'front-arm-right': [
      { id: 74, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/sLGKDQAESGo?start=1' },
      { id: 75, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/zdmZYCGkCgU?start=1' },
      { id: 76, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k' },
      { id: 77, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/eJMy9LglyF0' }
    ],
    'front-shoulder-left': [
      { id: 9, title: 'אימון כתפיים', url: ' https://www.youtube.com/embed/47sFXBoSx8M?start=1' },
      { id: 10, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/2Xzx51BJVys?start=2' },
      { id: 11, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' },
    ],
    'front-shoulder-right':[
      { id: 12, title: 'אימון כתפיים', url: ' https://www.youtube.com/embed/47sFXBoSx8M?start=1' },
      { id: 13, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/2Xzx51BJVys?start=2' },
      { id: 14, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' },
    ],
    'chest': [
      { id: 15, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/B8EfL9JNmM4?start=6' },
      { id: 16, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/V9lvyOIDAII?start=110' },
      { id: 17, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/1phjKdK18lA' },
      { id: 18, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/wUOBow4rsSY' },
      { id: 19, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/qKxpVD8K3zY?start=1' },
    ],
    'abs': [
      { id: 20, title: 'אימון בטן', url: 'https://www.youtube.com/embed/2pLT-olgUJs?start=1' },
      { id: 21, title: 'אימון בטן', url: 'https://www.youtube.com/embed/zGITL_k1D2U?start=1' },
      { id: 22, title: 'אימון בטן', url: 'https://www.youtube.com/embed/FQbnzb6IIbY' },
      { id: 23, title: 'אימון בטן', url: 'https://www.youtube.com/embed/1f8yoFFdkcY?start=1' },
      { id: 24, title: 'אימון בטן', url: 'https://www.youtube.com/embed/x33O9qGN_us' },
      { id: 25, title: 'אימון בטן', url: 'https://www.youtube.com/embed/YQPrLZIxosA?start=2' },

    ],
    'oblique-left': [
      { id: 26, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/FQbnzb6IIbY' },
      { id: 27, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/TF9-zVUQoSI' },
      { id: 28, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/KWSkT74zJ5U' },
    ],
    'oblique-right': [
      { id: 29, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/FQbnzb6IIbY' },
      { id: 30, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/TF9-zVUQoSI' },
      { id: 31, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/KWSkT74zJ5U' },
    ],
    'front-thigh-left': [
      { id: 32, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/p7mswiVqSaU?start=1' },
      { id: 33, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/Bs0FmuqUzwU?start=44' },
      { id: 34, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/3VvZkGvrBKY?start=236' },
      { id: 35, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/a2UnibbfW7s?start=1' },
      { id: 36, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/vO9Pig-9Xzc' },
      { id: 37, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/MZWq7Kx-5FQ?start=14' },
    ],
    'front-thigh-right':[
      { id: 38, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/p7mswiVqSaU?start=1' },
      { id: 39, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/Bs0FmuqUzwU?start=44' },
      { id: 40, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/3VvZkGvrBKY?start=236' },
      { id: 41, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/a2UnibbfW7s?start=1' },
      { id: 42, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/vO9Pig-9Xzc' },
      { id: 43, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/MZWq7Kx-5FQ?start=14' },
    ],
    'front-inner-thighs':[
      { id: 44, title: 'תרגילי ירך פנימית', url: 'https://www.youtube.com/embed/o8_BR3AWvRM' },
      { id: 45, title: 'תרגילי ירך פנימית', url: 'https://www.youtube.com/embed/pT8YHR0G_CU' },
      { id: 46, title: 'תרגילי ירך פנימית', url: 'https://www.youtube.com/embed/3mm5pMNFLr4' },
    ],
    'calf-right':[
      { id: 47, title: 'תרגילי ארבע ראשי', url: 'https://www.youtube.com/embed/XhlpzVXpbiE' },
      { id: 48, title: 'תרגילי ארבע ראשי', url: 'https://www.youtube.com/embed/AK1LLP_d1Mk' },
      { id: 49, title: 'תרגילי ארבע ראשי', url: 'https://www.youtube.com/embed/BePwGQkTq2U' },
    ],
    'calf-left':[
      { id: 50, title: 'תרגילי ארבע ראשי', url: 'https://www.youtube.com/embed/XhlpzVXpbiE' },
      { id: 51, title: 'תרגילי ארבע ראשי', url: 'https://www.youtube.com/embed/AK1LLP_d1Mk' },
      { id: 52, title: 'תרגילי ארבע ראשי', url: 'https://www.youtube.com/embed/BePwGQkTq2U' },
    ],
    'back-thigh-left': [
      { id: 53, title: 'תרגילי ירך אחורית', url: 'https://www.youtube.com/embed/4GjFXO0iXCc' },
      { id: 54, title: 'תרגילי ירך אחורית', url: 'https://www.youtube.com/embed/0vyCrSd1sqw' },
      { id: 55, title: 'תרגילי ירך אחורית', url: 'https://www.youtube.com/embed/8_1enCMxNnI' },
      ],
'back-thigh-right': [
      { id: 56, title: 'תרגילי ירך אחורית', url: 'https://www.youtube.com/embed/4GjFXO0iXCc' },
      { id: 57, title: 'תרגילי ירך אחורית', url: 'https://www.youtube.com/embed/0vyCrSd1sqw' },
      { id: 58, title: 'תרגילי ירך אחורית', url: 'https://www.youtube.com/embed/8_1enCMxNnI' },
    ],
    'glutes': [
      { id: 59, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/4GvXn4u2P_M' },
      { id: 60, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/5yYll5MHqOE' },
      { id: 61, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/U6qUoloR8T8' },
      { id: 62, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/vO9Pig-9Xzc' },
      { id: 63, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/RaJO71A4E6I' },
      { id: 64, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/dCHQr5c0efs' },
    ],
    
    back: [
      { id: 65, title: 'אימון גב', url: 'https://www.youtube.com/embed/8VdwJWLGa5k' },
      { id: 66, title: 'אימון גב', url: 'https://www.youtube.com/embed/t8EjI-R0pcQ' },
      { id: 67, title: 'אימון גב', url: 'https://www.youtube.com/embed/o062bxRT1EA' },
    ],
    'back-arm-left': [
      { id: 68, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/2Xzx51BJVys' },
      { id: 69, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/gJe9ECgDrkk' },
      { id: 70, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/njWxT1A7XrY' },
    ],
    'back-arm-right': [
      { id: 71, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/2Xzx51BJVys' },
      { id: 72, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/gJe9ECgDrkk' },
      { id: 73, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/njWxT1A7XrY' },
    ],
  };

  const handleMuscleClick = (name) => {
    setSelectedMuscle(name);
  };

  setTimeout(() => {
    videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, 100);

  return (
    <Container>
     <Title>תרגילי כושר לפי חלקי גוף</Title>
     <h2>לחצי על אזור מסוים בגוף כדי לצפות בסרטוני אימון מותאמים</h2>

      <ModelContainer>
        <HumanBody onMuscleClick={handleMuscleClick} />
      </ModelContainer>

      {selectedMuscle && (
         <div ref={videoSectionRef}>
        <>
          <SelectedMuscle>תרגילים:</SelectedMuscle>
          {videos[selectedMuscle]?.length > 0 ? (
            <VideoGallery>
              {videos[selectedMuscle].map((video) => (
                <VideoCard key={video.id}>
                  <VideoWrapper>
                  <iframe
                    width="100%"
                    height="200"
                    src={video.url}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  </VideoWrapper>
                  <VideoTitle>{video.title}</VideoTitle>
                </VideoCard>
              ))}
            </VideoGallery>
          ) : (
            <p>No videos available for this muscle group yet.</p>
          )}
        </>
        </div>
      )}
    </Container>
  );
};

export default WorkoutVideos;



















