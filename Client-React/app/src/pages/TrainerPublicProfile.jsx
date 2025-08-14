// TrainerPublicProfile.jsx

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaPhoneAlt,
    FaWhatsapp,
    FaDumbbell,
    FaFemale,
    FaArrowRight,
    FaTimes,
    FaPlus,
} from 'react-icons/fa';
import { useUser } from '../context/UserContext';

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

const TagsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
`;

const Tag = styled.span`
  background: #6c5ce7;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 16px;
  font-size: 0.85rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
`;

const RemovableTag = styled(Tag)`
  background: #5a4dcf;
  button {
    background: transparent;
    border: none;
    color: #fff;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    padding: 0;
  }
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

const AdminPanel = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  border: 1px dashed #c9c6ff;
  background: #fbfaff;
  border-radius: 12px;
`;

const AdminTitle = styled.h3`
  margin: 0 0 0.8rem 0;
  color: #4b44c4;
`;

const Row = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
  margin-bottom: 0.8rem;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 200px;
  padding: 0.6rem 0.8rem;
  border: 1px solid #ddd;
  border-radius: 10px;
  font-size: 0.95rem;
  direction: rtl;
`;

const AddBtn = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.55rem 0.9rem;
  background: #4b44c4;
  color: #fff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 0.95rem;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Note = styled.small`
  color: #666;
`;

const TrainerPublicProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isLoggedIn, token } = useUser();

    const [trainer, setTrainer] = useState(null);
    const [loading, setLoading] = useState(true);

    // --- Admin controls state ---
    const [categories, setCategories] = useState([]); // local editable expertise
    const [newCategory, setNewCategory] = useState('');
    const [saving, setSaving] = useState(false);

    const authToken = useMemo(
        () => token || localStorage.getItem('token') || '',
        [token]
    );

    const isAdmin = useMemo(() => {
        const role = user?.role?.toLowerCase?.();
        return isLoggedIn && (role === 'admin' || role === 'superadmin');
    }, [isLoggedIn, user]);

    useEffect(() => {
        const fetchTrainer = async () => {
            setLoading(true);
            try {
                const res = await axios.get(`${API_URL}/user/public/${id}`);
                setTrainer(res.data);
                setCategories(Array.isArray(res.data?.expertise) ? res.data.expertise : []);
            } catch (err) {
                console.error('שגיאה בטעינת פרופיל מאמנת:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchTrainer();
    }, [id]);

    // ---- SAVE expertise via POST /user/update/:id ----
    const persistCategories = async (nextCategories) => {
        if (!authToken) {
            alert('אין הרשאת מנהלת. התחברי מחדש.');
            return;
        }
        setSaving(true);
        try {
            const data = new FormData();
            data.append('expertise', JSON.stringify(nextCategories));

            await axios.post(
                `${API_URL}/user/update/${id}`,
                data,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                    withCredentials: true,
                }
            );

            setCategories(nextCategories);
            setTrainer((prev) => ({ ...prev, expertise: nextCategories }));
        } catch (e) {
            console.error('שמירת קטגוריות נכשלה', e);
            const status = e?.response?.status;
            if (status === 401 || status === 403) {
                alert('פג תוקף ההתחברות או אין הרשאה מתאימה. התחברי מחדש.');
            } else {
                alert('שמירת הקטגוריות נכשלה. בדקי שהינך מחוברת עם הרשאות מנהל ושהשרת זמין.');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleAddCategory = async () => {
        const value = (newCategory || '').trim();
        if (!value) return;

        // מניעת כפילויות (Case-insensitive)
        const exists = categories.some((c) => c.toLowerCase() === value.toLowerCase());
        if (exists) {
            setNewCategory('');
            return;
        }

        const next = [...categories, value];
        setNewCategory('');
        await persistCategories(next);
    };

    const handleRemoveCategory = async (value) => {
        const next = categories.filter((c) => c !== value);
        await persistCategories(next);
    };

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
                        <FaWhatsapp />{' '}
                        <a href={`https://wa.me/${trainer.whatsapp}`} target="_blank" rel="noreferrer">
                            {trainer.whatsapp}
                        </a>
                    </InfoRow>
                )}
                {trainer.address?.city && (
                    <InfoRow>
                        <FaMapMarkerAlt /> {trainer.address?.street}, {trainer.address?.city}
                    </InfoRow>
                )}
            </InfoSection>

            <InfoSection>
                <h2>התמחויות</h2>

                {/* תצוגה רגילה */}
                {(!isAdmin || saving) && (
                    <>
                        {trainer.expertise?.length > 0 ? (
                            <TagsWrap>
                                {trainer.expertise.map((item) => (
                                    <Tag key={item}>
                                        <FaDumbbell /> {item}
                                    </Tag>
                                ))}
                            </TagsWrap>
                        ) : (
                            <p>אין מידע זמין</p>
                        )}
                    </>
                )}

                {/* פנל ניהול ל־ADMIN/SUPERADMIN */}
                {isAdmin && !saving && (
                    <AdminPanel>
                        <AdminTitle>ניהול קטגוריות (למנהלות בלבד)</AdminTitle>

                        {/* רשימת תגיות ניתנות להסרה */}
                        <Row>
                            {categories.length > 0 ? (
                                <TagsWrap>
                                    {categories.map((cat) => (
                                        <RemovableTag key={cat} title="הסירי קטגוריה">
                                            <FaDumbbell /> {cat}
                                            <button onClick={() => handleRemoveCategory(cat)} aria-label={`הסר ${cat}`}>
                                                <FaTimes />
                                            </button>
                                        </RemovableTag>
                                    ))}
                                </TagsWrap>
                            ) : (
                                <Note>אין קטגוריות כרגע.</Note>
                            )}
                        </Row>

                        {/* הוספת תגית */}
                        <Row>
                            <Input
                                type="text"
                                placeholder="הוסיפי קטגוריה (למשל: אימון לאחר לידה)"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddCategory();
                                    }
                                }}
                            />
                            <AddBtn onClick={handleAddCategory} disabled={saving || !newCategory.trim()}>
                                <FaPlus /> הוספה
                            </AddBtn>
                            {saving && <Note>שומרת…</Note>}
                        </Row>

                        <Note>
                            השינויים נשמרים מיידית בפרופיל המאמנת ומופיעים גם בחיפוש.
                        </Note>
                    </AdminPanel>
                )}
            </InfoSection>

            {trainer.previousGyms?.length > 0 && (
                <InfoSection>
                    <h2>ניסיון תעסוקתי</h2>
                    {trainer.previousGyms.map((gym, index) => (
                        <InfoRow key={`${gym?.name || gym}-${index}`}>
                            🏋️‍♀️ {gym?.name ? `${gym.name} (${gym.years} שנים)` : gym}
                        </InfoRow>
                    ))}
                </InfoSection>
            )}

            {trainer.bodyType?.type && (
                <InfoSection>
                    <h2>סוג מבנה גוף</h2>
                    <InfoRow>
                        🧍‍♀️ {trainer.bodyType.type} - {trainer.bodyType.description}
                    </InfoRow>
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
