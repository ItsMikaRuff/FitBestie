import React, { useState } from 'react';
import styled from 'styled-components';
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
  width: 70%;
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

  const videos = {
    'front-arm-left': [
      { id: 1, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/sLGKDQAESGo?start=1' },
      { id: 2, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/zdmZYCGkCgU?start=1' },
      { id: 3, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k' },
      { id: 4, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/eJMy9LglyF0' }
    ],
    'front-arm-right': [
      { id: 1, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/sLGKDQAESGo?start=1' },
      { id: 2, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/zdmZYCGkCgU?start=1' },
      { id: 3, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k' },
      { id: 4, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/eJMy9LglyF0' }
    ],
    'back-arm-left': [
      { id: 5, title: 'אימון זרוע אחורית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k' }
    ],
    'front-shoulder-left': [
      { id: 9, title: 'אימון כתפיים', url: ' https://www.youtube.com/embed/47sFXBoSx8M?start=1' },
      { id: 10, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/2Xzx51BJVys?start=2' },
      { id: 11, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' },
    ],
    'front-shoulder-right':[
      { id: 9, title: 'אימון כתפיים', url: ' https://www.youtube.com/embed/47sFXBoSx8M?start=1' },
      { id: 10, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/2Xzx51BJVys?start=2' },
      { id: 11, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' },
    ],
    'back-shoulder-left': [
      { id: 7, title: 'אימון כתפיים אחוריות', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' }
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
      { id: 32, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/p7mswiVqSaU?start=1' },
      { id: 33, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/Bs0FmuqUzwU?start=44' },
      { id: 34, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/3VvZkGvrBKY?start=236' },
      { id: 35, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/a2UnibbfW7s?start=1' },
      { id: 36, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/vO9Pig-9Xzc' },
      { id: 37, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/MZWq7Kx-5FQ?start=14' },
    ],
    'back-thigh-left': [
      { id: 12, title: 'תרגילי יריכיים אחוריות', url: 'https://www.youtube.com/embed/MZWq7Kx-5FQ?start=14' }
    ],
    'front-knee-left': [
      { id: 45, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/-vdtoAKDQWY?start=64' },
      { id: 46, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/mjNWpbTwiq4?start=171' },
      { id: 47, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/GU8d7NdWsZo?start=1' },
    ],
    'front-knee-right':[
      { id: 45, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/-vdtoAKDQWY?start=64' },
      { id: 46, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/mjNWpbTwiq4?start=171' },
      { id: 47, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/GU8d7NdWsZo?start=1' },
    ],
    'back-knee-left': [
      { id: 14, title: 'חיזוק ברכיים אחוריות', url: 'https://www.youtube.com/embed/GU8d7NdWsZo?start=1' }
    ],
    'front-foot-left': [
      { id: 51, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/xTUmZcxf_tI?start=1' },
      { id: 52, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/5k9k_tioGSo' },
      { id: 53, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/gwZqWjrYSNM' },
    ],
    'front-foot-right':[
      { id: 51, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/xTUmZcxf_tI?start=1' },
      { id: 52, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/5k9k_tioGSo' },
      { id: 53, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/gwZqWjrYSNM' },
    ],
    'back-foot-left': [
      { id: 16, title: 'כף רגל אחורית', url: 'https://www.youtube.com/embed/gwZqWjrYSNM' }
    ],
    back: [
      { id: 17, title: 'אימון גב', url: 'https://www.youtube.com/embed/EF0f4yCMiDU' }
    ],
    glutes: [
      { id: 18, title: 'אימון ישבן', url: 'https://www.youtube.com/embed/1BZM9U_EKZk' }
    ]
  };

  const handleMuscleClick = (name) => {
    setSelectedMuscle(name);
  };

  const handleMuscleHover = (name) => {
    console.log('Hovered:', name);
  };

  return (
    <Container>
      <Title>Workout Videos</Title>

      <ModelContainer>
        <HumanBody onMuscleClick={handleMuscleClick} onMuscleHover={handleMuscleHover} />
      </ModelContainer>

      {selectedMuscle && (
        <>
          <SelectedMuscle>תרגילים:</SelectedMuscle>
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



















// import React, { useState } from 'react';
// import styled from 'styled-components';
// import HumanBody from '../components/HumanBody';

// const Container = styled.div`
//   display: flex;
//   flex-direction: column;
//   align-items: center;
//   padding: 2rem;
//   min-height: 100vh;
//   background: #f5f5f5;
// `;

// const Title = styled.h1`
//   color: #333;
//   margin-bottom: 2rem;
//   text-align: center;
// `;

// const ModelContainer = styled.div`
//   width: 70%;
//   background: #f0f0f0;
//   border-radius: 10px;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   margin-bottom: 2rem;
// `;

// const VideoGallery = styled.div`
//   display: grid;
//   grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
//   gap: 2rem;
//   width: 100%;
//   max-width: 1200px;
// `;

// const VideoCard = styled.div`
//   background: white;
//   border-radius: 10px;
//   overflow: hidden;
//   box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
//   transition: transform 0.2s;

//   &:hover {
//     transform: translateY(-5px);
//   }
// `;

// const VideoTitle = styled.h3`
//   padding: 1rem;
//   margin: 0;
//   color: #333;
// `;

// const SelectedMuscle = styled.div`
//   font-size: 1.2rem;
//   color: #666;
//   margin-bottom: 1rem;
//   text-align: center;
// `;

// const WorkoutVideos = () => {
//   const [selectedMuscle, setSelectedMuscle] = useState(null);

//   const videos = {
//     'arm-left': [
//       { id: 1, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/sLGKDQAESGo?start=1'},
//       { id: 2, title: ' אימון זרוע קידמית', url: 'https://www.youtube.com/embed/zdmZYCGkCgU?start=1'},
//       { id: 3, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k'},
//       { id: 4, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/eJMy9LglyF0'},

//     ],
//     'arm-right': [
//       { id: 5, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/sLGKDQAESGo?start=1'},
//       { id: 6, title: ' אימון זרוע קידמית', url: 'https://www.youtube.com/embed/zdmZYCGkCgU?start=1'},
//       { id: 7, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/I-h9DdLxq_k'},
//       { id: 8, title: 'אימון זרוע קידמית', url: 'https://www.youtube.com/embed/eJMy9LglyF0'},
//     ],
//     'shoulder-left': [
//       { id: 9, title: 'אימון כתפיים', url: ' https://www.youtube.com/embed/47sFXBoSx8M?start=1' },
//       { id: 10, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/2Xzx51BJVys?start=2' },
//       { id: 11, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' },
//     ],
//     'shoulder-right': [
//       { id: 12, title: 'אימון כתפיים', url: ' https://www.youtube.com/embed/47sFXBoSx8M?start=1' },
//       { id: 13, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/2Xzx51BJVys?start=2' },
//       { id: 14, title: 'אימון כתפיים', url: 'https://www.youtube.com/embed/rb4S9UND-Wc' },
//     ],
//     'chest': [
//       { id: 15, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/B8EfL9JNmM4?start=6' },
//       { id: 16, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/V9lvyOIDAII?start=110' },
//       { id: 17, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/1phjKdK18lA' },
//       { id: 18, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/wUOBow4rsSY' },
//       { id: 19, title: 'אימון בית החזה', url: 'https://www.youtube.com/embed/qKxpVD8K3zY?start=1' },
//     ],
//     'abs': [
//       { id: 20, title: 'אימון בטן', url: 'https://www.youtube.com/embed/2pLT-olgUJs?start=1' },
//       { id: 21, title: 'אימון בטן', url: 'https://www.youtube.com/embed/zGITL_k1D2U?start=1' },
//       { id: 22, title: 'אימון בטן', url: 'https://www.youtube.com/embed/FQbnzb6IIbY' },
//       { id: 23, title: 'אימון בטן', url: 'https://www.youtube.com/embed/1f8yoFFdkcY?start=1' },
//       { id: 24, title: 'אימון בטן', url: 'https://www.youtube.com/embed/x33O9qGN_us' },
//       { id: 25, title: 'אימון בטן', url: 'https://www.youtube.com/embed/YQPrLZIxosA?start=2' },

//     ],
//     'oblique-left': [
//       { id: 26, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/FQbnzb6IIbY' },
//       { id: 27, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/TF9-zVUQoSI' },
//       { id: 28, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/KWSkT74zJ5U' },
//     ],
//     'oblique-right': [
//       { id: 29, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/FQbnzb6IIbY' },
//       { id: 30, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/TF9-zVUQoSI' },
//       { id: 31, title: 'אימון בטן צדדית', url: 'https://www.youtube.com/embed/KWSkT74zJ5U' },
//     ],
//     // back: [
//     //   { id: 9, title: 'Back Workout', url: 'https://www.youtube.com/embed/EF0f4yCMiDU' },
//     // ],
//     // glutes: [
//     //   { id: 10, title: 'Glute Workout', url: 'https://www.youtube.com/embed/1BZM9U_EKZk' },
//     // ],
//     'thigh-left': [
//       { id: 32, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/p7mswiVqSaU?start=1' },
//       { id: 33, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/Bs0FmuqUzwU?start=44' },
//       { id: 34, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/3VvZkGvrBKY?start=236' },
//       { id: 35, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/a2UnibbfW7s?start=1' },
//       { id: 36, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/vO9Pig-9Xzc' },
//       { id: 37, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/MZWq7Kx-5FQ?start=14' },
//     ],
//     'thigh-right': [
//       { id: 38, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/p7mswiVqSaU?start=1' },
//       { id: 39, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/Bs0FmuqUzwU?start=44' },
//       { id: 40, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/3VvZkGvrBKY?start=236' },
//       { id: 42, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/a2UnibbfW7s?start=1' },
//       { id: 43, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/vO9Pig-9Xzc' },
//       { id: 44, title: 'תרגילי יריכיים', url: 'https://www.youtube.com/embed/MZWq7Kx-5FQ?start=14' },
//     ],
//     'knee-left': [
//       { id: 45, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/-vdtoAKDQWY?start=64' },
//       { id: 46, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/mjNWpbTwiq4?start=171' },
//       { id: 47, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/GU8d7NdWsZo?start=1' },
//     ],
//     'knee-right': [
//       { id: 48, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/-vdtoAKDQWY?start=64' },
//       { id: 49, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/mjNWpbTwiq4?start=171' },
//       { id: 50, title: 'חיזוק שרירי ברכיים', url: 'https://www.youtube.com/embed/GU8d7NdWsZo?start=1' },
//     ],
 
//     'foot-left': [
//       { id: 51, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/xTUmZcxf_tI?start=1' },
//       { id: 52, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/5k9k_tioGSo' },
//       { id: 53, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/gwZqWjrYSNM' },
//     ],
//     'foot-right': [
//       { id: 51, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/xTUmZcxf_tI?start=1' },
//       { id: 52, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/5k9k_tioGSo' },
//       { id: 53, title: 'חיזוק כף הרגל', url: 'https://www.youtube.com/embed/gwZqWjrYSNM' },
//     ],
//   };

//   const handleMuscleClick = (name) => {
//     setSelectedMuscle(name);
//   };

//   const handleMuscleHover = (name) => {
//     console.log('Hovered:', name);
//   };

//   return (
//     <Container>
//       <Title>Workout Videos</Title>

//       <ModelContainer>
//         <HumanBody
//           onMuscleClick={handleMuscleClick}
//           onMuscleHover={handleMuscleHover}
//         />
//       </ModelContainer>

//       {selectedMuscle && (
//         <>
//           <SelectedMuscle>תרגילים:</SelectedMuscle>
//           {videos[selectedMuscle]?.length > 0 ? (
//             <VideoGallery>
//               {videos[selectedMuscle].map((video) => (
//                 <VideoCard key={video.id}>
//                   <iframe
//                     width="100%"
//                     height="200"
//                     src={video.url}
//                     title={video.title}
//                     frameBorder="0"
//                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                     allowFullScreen
//                   />
//                   <VideoTitle>{video.title}</VideoTitle>
//                 </VideoCard>
//               ))}
//             </VideoGallery>
//           ) : (
//             <p>No videos available for this muscle group yet.</p>
//           )}
//         </>
//       )}
//     </Container>
//   );
// };

// export default WorkoutVideos;
