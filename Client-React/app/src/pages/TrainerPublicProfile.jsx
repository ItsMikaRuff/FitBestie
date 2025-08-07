import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt, FaWhatsapp, FaDumbbell, FaFemale, FaArrowRight } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const Container = styled.div`
  max-width: 900px;
  margin: 0 auto;
  padding: 2rem;
  text-align: right;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 2rem;
`;

const ProfileImage = styled.img`
  width: 200px;
  height: 200px;
  object-fit: cover;
  border-radius: 50%;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  background: #f4f2fa;
`;

const FemaleIconCircle = styled.div`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: #f4f2fa;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  font-size: 5.5rem;
  color: #6c5ce7;
`;

const Name = styled.h1`
  font-size: 2rem;
  color: #333;
`;

const InfoSection = styled.div`
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
`;

const InfoRow = styled.p`
  font-size: 1rem;
  color: #444;
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Tag = styled.span`
  background: #6c5ce7;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
  margin: 0.2rem;
  display: inline-block;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.7rem 1.5rem;
  background: #6c5ce7;
  color: #fff;
  border: none;
  border-radius: 999px;
  font-size: 1.05rem;
  margin: 1.5rem auto 0;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  transition: background 0.2s;
  &:hover {
    background: #5a4dcf;
  }
`;

const TrainerPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainer = async () => {
            try {
                const res = await axios.get(`${API_URL}/user/public/${id}`)
                setTrainer(res.data);
            } catch (err) {
                console.error("שגיאה בטעינת פרופיל מאמנת:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainer();
    }, [id]);

    if (loading)
        return (
            <Container>
                <p style={{ textAlign: 'center' }}>טוען פרופיל...</p>
                <BackButton onClick={() => navigate('/search?type=trainer')}>
                    <FaArrowRight />
                    חזרה לחיפוש מאמנות
                </BackButton>
            </Container>
        );

    if (!trainer)
        return (
            <Container>
                <p style={{ textAlign: 'center', fontSize: '1.3rem', margin: '2rem 0' }}>
                    מאמנת לא נמצאה
                </p>
                <BackButton onClick={() => navigate('/search?type=trainer')}>
                    <FaArrowRight />
                    חזרה לחיפוש מאמנות
                </BackButton>
            </Container>
        );

    return (
        <Container>
            

            <ProfileHeader>
                {trainer.image ? (
                    <ProfileImage src={trainer.image} alt={trainer.name} />
                ) : (
                    <FemaleIconCircle>
                        <FaFemale />
                    </FemaleIconCircle>
                )}
                <Name>{trainer.name}</Name>
            </ProfileHeader>

            <InfoSection>
                <h2>פרטי קשר</h2>
                {trainer.email && <InfoRow><FaEnvelope /> {trainer.email}</InfoRow>}
                {trainer.phone && <InfoRow><FaPhoneAlt /> {trainer.phone}</InfoRow>}
                {trainer.whatsapp && (
                    <InfoRow>
                        <FaWhatsapp /> <a href={`https://wa.me/${trainer.whatsapp}`} target="_blank" rel="noreferrer">{trainer.whatsapp}</a>
                    </InfoRow>
                )}
                {trainer.address?.city && (
                    <InfoRow><FaMapMarkerAlt /> {trainer.address?.street}, {trainer.address?.city}</InfoRow>
                )}
            </InfoSection>

            <InfoSection>
                <h2>התמחויות</h2>
                {trainer.expertise?.length > 0 ? (
                    trainer.expertise.map((item, index) => <Tag key={index}><FaDumbbell /> {item}</Tag>)
                ) : <p>אין מידע זמין</p>}
            </InfoSection>

            {trainer.previousGyms?.length > 0 && (
                <InfoSection>
                    <h2>ניסיון תעסוקתי</h2>
                    {trainer.previousGyms.map((gym, index) => (
                        <InfoRow key={index}>🏋️‍♀️ {gym.name ? `${gym.name} (${gym.years} שנים)` : gym}</InfoRow>
                    ))}
                </InfoSection>
            )}

            {trainer.bodyType?.type && (
                <InfoSection>
                    <h2>סוג מבנה גוף</h2>
                    <InfoRow>🧍‍♀️ {trainer.bodyType.type} - {trainer.bodyType.description}</InfoRow>
                </InfoSection>
            )}

            <BackButton onClick={() => navigate('/search?type=trainer')}>
                <FaArrowRight />
                חזרה לחיפוש מאמנות
            </BackButton>
        </Container>
    );
};

export default TrainerPublicProfile;
