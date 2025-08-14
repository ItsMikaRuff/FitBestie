// WorkoutVideos.jsx
import React, { useState, useRef, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import HumanBody from '../components/HumanBody';
import { useUser } from '../context/UserContext';
import { FaPlus, FaTrash, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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
  margin-bottom: 0.5rem;
  text-align: center;
`;

const SubTitle = styled.h2`
  color: #555;
  font-size: 1rem;
  margin: 0 0 1.5rem 0;
  font-weight: 400;
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.2rem;
  width: 100%;
  padding: 0 1rem;
  box-sizing: border-box;
`;

const VideoCard = styled.div`
  background: white;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: transform 0.2s;
  &:hover { transform: translateY(-5px); }
`;

const VideoTitle = styled.div`
  padding: 0.8rem 1rem;
  margin: 0;
  color: #333;
  font-size: 1rem;
  display: flex;
  align-items: center;
  gap: .5rem;
`;

const TitleText = styled.h3`
  margin: 0;
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
`;

const EditTitleInput = styled.input`
  flex: 1;
  min-width: 160px;
  padding: .45rem .6rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: .95rem;
  direction: rtl;
`;

const SelectedMuscle = styled.div`
  font-size: 1.1rem;
  color: #666;
  margin-bottom: 0.8rem;
  text-align: center;
`;

const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
  }
`;

const AdminPanel = styled.div`
  width: 100%;
  max-width: 980px;
  background: #fbfaff;
  border: 1px dashed #c9c6ff;
  border-radius: 12px;
  padding: 1rem;
  margin: 1rem 0 2rem 0;
  direction: rtl;
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  min-width: 220px;
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
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const IconBtn = styled.button`
  background: ${(p) => p.$danger ? '#dc3545' : p.$ok ? '#28a745' : '#e9ecef'};
  color: ${(p) => p.$danger || p.$ok ? '#fff' : '#333'};
  border: none;
  border-radius: 8px;
  padding: .4rem .6rem;
  cursor: pointer;
`;

const Note = styled.small`
  color: #666;
  display: block;
  margin-top: 0.4rem;
`;

/** מיפוי שם מפתח -> תווית עברית */
const MUSCLE_LABELS_HE = {
  'front-arm-left': 'זרוע קדמית',
  'front-arm-right': 'זרוע קדמית',
  'front-shoulder-left': 'כתפיים',
  'front-shoulder-right': 'כתפיים',
  'chest': 'חזה',
  'abs': 'בטן',
  'oblique-left': 'אלכסונים',
  'oblique-right': 'אלכסונים',
  'front-thigh-left': 'ירך קדמית',
  'front-thigh-right': 'ירך קדמית',
  'front-inner-thighs': 'ירך פנימית ',
  'calf-right': 'תאומים',
  'calf-left': 'תאומים',
  'back-thigh-left': 'ירך אחורית',
  'back-thigh-right': 'ירך אחורית',
  'glutes': 'ישבן',
  'back': 'גב',
  'back-arm-left': 'זרוע אחורית',
  'back-arm-right': 'זרוע אחורית',
};

const WorkoutVideos = () => {
  const videoSectionRef = useRef(null);
  const { user, isLoggedIn, token } = useUser();

  const [selectedMuscle, setSelectedMuscle] = useState(null);
  const [videos, setVideos] = useState([]); // [{_id, muscle, title, url}]
  const [loading, setLoading] = useState(false);

  // admin controls
  const [newTitle, setNewTitle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [saving, setSaving] = useState(false);

  // edit state per-card
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const authToken = useMemo(
    () => token || localStorage.getItem('token') || '',
    [token]
  );

  const isAdmin = useMemo(() => {
    const role = user?.role?.toLowerCase?.();
    return isLoggedIn && (role === 'admin' || role === 'superadmin');
  }, [isLoggedIn, user]);

  // Scroll to videos when a muscle is selected
  useEffect(() => {
    if (selectedMuscle) {
      videoSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedMuscle]);

  // fetch videos when muscle changes
  useEffect(() => {
    const fetchVideos = async () => {
      if (!selectedMuscle) return;
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/videos`, { params: { muscle: selectedMuscle } });
        setVideos(res.data || []);
      } catch (e) {
        console.error('טעינת סרטונים נכשלה', e);
        setVideos([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVideos();
  }, [selectedMuscle]);

  const normalizeYouTubeToEmbed = (url) => {
    if (!url) return '';
    const trimmed = url.trim();
    if (/youtube\.com\/embed\//i.test(trimmed)) return trimmed;
    const short = trimmed.match(/https?:\/\/youtu\.be\/([^?&]+)/i);
    if (short?.[1]) return `https://www.youtube.com/embed/${short[1]}`;
    const watch = trimmed.match(/v=([^?&]+)/i);
    if (watch?.[1]) return `https://www.youtube.com/embed/${watch[1]}`;
    return trimmed;
  };

  const handleAdd = async () => {
    const title = (newTitle || '').trim();
    const url = normalizeYouTubeToEmbed(newUrl);
    if (!selectedMuscle) { alert('בחרי שריר מהמודל ואז הוסיפי סרטון.'); return; }
    if (!title || !url) return;

    setSaving(true);
    try {
      const res = await axios.post(
        `${API_URL}/videos`,
        { muscle: selectedMuscle, title, url },
        { headers: { Authorization: `Bearer ${authToken}` }, withCredentials: true }
      );
      setVideos((prev) => [res.data, ...prev]);
      setNewTitle(''); setNewUrl('');
    } catch (e) {
      const s = e?.response?.status;
      alert(s === 401 || s === 403 ? 'אין הרשאת מנהלת. התחברי מחדש.' : 'הוספת הסרטון נכשלה.');
      console.error('add video error', e);
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('למחוק את הסרטון?')) return;
    setSaving(true);
    try {
      await axios.delete(`${API_URL}/videos/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
        withCredentials: true,
      });
      setVideos((prev) => prev.filter((v) => v._id !== id));
    } catch (e) {
      const s = e?.response?.status;
      alert(s === 401 || s === 403 ? 'אין הרשאת מנהלת. התחברי מחדש.' : 'מחיקת הסרטון נכשלה.');
      console.error('delete video error', e);
    } finally { setSaving(false); }
  };

  // ---- EDIT TITLE ----
  const startEdit = (video) => {
    setEditingId(video._id);
    setEditingTitle(video.title);
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle('');
  };
  const saveEdit = async () => {
    const title = (editingTitle || '').trim();
    if (!title || !editingId) return;
    setSaving(true);
    try {
      const res = await axios.put(
        `${API_URL}/videos/${editingId}`,
        { title }, // עורכות רק שם
        { headers: { Authorization: `Bearer ${authToken}` }, withCredentials: true }
      );
      // עדכון לוקאלי
      setVideos((prev) => prev.map(v => v._id === editingId ? { ...v, title: res.data.title } : v));
      cancelEdit();
    } catch (e) {
      const s = e?.response?.status;
      alert(s === 401 || s === 403 ? 'אין הרשאת מנהלת. התחברי מחדש.' : 'שמירת העריכה נכשלה.');
      console.error('edit video error', e);
    } finally { setSaving(false); }
  };

  const handleMuscleClick = (name) => setSelectedMuscle(name);

  const muscleLabelHe = selectedMuscle ? (MUSCLE_LABELS_HE[selectedMuscle] || selectedMuscle) : '';

  return (
    <Container>
      <Title>תרגילי כושר לפי חלקי גוף</Title>
      <SubTitle>לחצי על אזור מסוים בגוף כדי לצפות בסרטוני אימון מותאמים</SubTitle>

      <ModelContainer>
        <HumanBody onMuscleClick={handleMuscleClick} />
      </ModelContainer>

      {selectedMuscle && (
        <div ref={videoSectionRef} style={{ width: '100%', maxWidth: 1100 }}>
          <SelectedMuscle>תרגילים לאזור: {muscleLabelHe}</SelectedMuscle>

          {isAdmin && (
            <AdminPanel>
              <h3 style={{ marginTop: 0, color: '#4b44c4' }}>ניהול סרטונים ({muscleLabelHe})</h3>
              <Row>
                <Input
                  type="text"
                  placeholder="כותרת הסרטון"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <Input
                  type="text"
                  placeholder="קישור YouTube (watch?v= / youtu.be / embed)"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAdd();
                    }
                  }}
                />
                <AddBtn onClick={handleAdd} disabled={saving || !newTitle.trim() || !newUrl.trim()}>
                  <FaPlus /> הוספה
                </AddBtn>
              </Row>
              <Note>הקישור יומר אוטומטית ל־embed. לאחר שמירה הסרטון יופיע מיד.</Note>
            </AdminPanel>
          )}

          {loading ? (
            <p style={{ textAlign: 'center' }}>טוען סרטונים…</p>
          ) : videos?.length > 0 ? (
            <VideoGallery>
              {videos.map((video) => {
                const isEditing = editingId === video._id;
                return (
                  <VideoCard key={video._id}>
                    <VideoWrapper>
                      <iframe
                        src={video.url}
                        title={video.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </VideoWrapper>
                    <VideoTitle>
                      {isEditing ? (
                        <>
                          <EditTitleInput
                            value={editingTitle}
                            onChange={(e) => setEditingTitle(e.target.value)}
                            placeholder="שם הסרטון"
                          />
                          <IconBtn $ok onClick={saveEdit} title="שמור">
                            <FaSave />
                          </IconBtn>
                          <IconBtn onClick={cancelEdit} title="ביטול">
                            <FaTimes />
                          </IconBtn>
                        </>
                      ) : (
                        <>
                          <TitleText>{video.title}</TitleText>
                          {isAdmin && (
                            <>
                              <IconBtn onClick={() => startEdit(video)} title="עריכה">
                                <FaEdit />
                              </IconBtn>
                              <IconBtn $danger onClick={() => handleDelete(video._id)} title="מחק סרטון">
                                <FaTrash />
                              </IconBtn>
                            </>
                          )}
                        </>
                      )}
                    </VideoTitle>
                  </VideoCard>
                );
              })}
            </VideoGallery>
          ) : (
            <p style={{ textAlign: 'center' }}>כרגע אין סרטונים לאזור זה.</p>
          )}
        </div>
      )}
    </Container>
  );
};

export default WorkoutVideos;
