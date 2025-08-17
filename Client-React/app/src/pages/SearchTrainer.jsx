//searchTrainer.jsx
/* eslint-disable react/no-unescaped-entities */
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import Loader from '../components/Loader';
import { FaFemale } from 'react-icons/fa';
import haversine from 'haversine-distance';
import StarRating from '../components/StarRating';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: #777;
  font-size: 1.2rem;
`;

const Filters = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2rem;
  justify-content: center;
`;

const Input = styled.input`
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid #ddd;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.5rem;
`;

const Card = styled.div`
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  overflow: hidden;
  transition: 0.3s;
`;

const Image = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const Content = styled.div`
  padding: 1rem;
`;

const Name = styled.h2`
  font-size: 1.2rem;
  margin: 0 0 0.5rem 0;
`;

const Type = styled.span`
  display: inline-block;
  background: #6c5ce7;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
`;

const Info = styled.p`
  font-size: 0.9rem;
  color: #555;
  margin-bottom: 0.25rem;
`;

const Button = styled.button`
  width: 100%;
  padding: 0.6rem;
  margin-top: 0.5rem;
  border: none;
  border-radius: 8px;
  background: #6c5ce7;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: 0.3s;
  &:hover { background: #5a4dcf; }
`;

// 🔹 POPUP להצגת פרטי קשר
const ContactPopup = ({ trainer, onClose }) => {
    if (!trainer) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
            <div style={{
                background: '#fff', padding: '2rem', borderRadius: '12px',
                maxWidth: '400px', width: '100%', position: 'relative'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 8, right: 8,
                    background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer'
                }}>×</button>

                <h2 style={{ marginBottom: '1rem' }}>פרטי קשר - {trainer.name}</h2>
                {trainer.phone && <p>📞 טלפון: {trainer.phone}</p>}
                {trainer.whatsapp && <p>💬 וואטסאפ: <a href={`https://wa.me/${trainer.whatsapp}`} target="_blank" rel="noreferrer">{trainer.whatsapp}</a></p>}
                {trainer.email && <p>📧 מייל: <a href={`mailto:${trainer.email}`}>{trainer.email}</a></p>}
                {!trainer.phone && !trainer.whatsapp && !trainer.email && (
                    <p>לא קיימים פרטי קשר זמינים</p>
                )}
            </div>
        </div>
    );
};

const SearchTrainer = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();

    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // נשאר רק סינון לפי עיר ומרחק
    const [locationFilter, setLocationFilter] = useState('');
    const [userLocation, setUserLocation] = useState(null);
    const [distance, setDistance] = useState(50);

    const [favorites, setFavorites] = useState([]);
    const [updating, setUpdating] = useState(false);
    const [selectedTrainer, setSelectedTrainer] = useState(null);

    const searchType = new URLSearchParams(location.search).get('type');

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error("Geolocation error", err)
            );
        }
    }, []);

    useEffect(() => {
        const fetchResults = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${API_URL}/search?type=${searchType}`);
                const filtered = res.data
                    .filter(r => r.role !== 'trainer' || r.trainerStatus === 'approved')
                    .map(r => ({ ...r, _id: r._id?.toString?.() ?? r._id }));
                setResults(filtered);
            } catch (err) {
                console.error("❌ שגיאה בטעינת תוצאות", err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        };

        if (searchType) {
            fetchResults();
            if (isLoggedIn) fetchFavorites();
        } else {
            setError("נא לבחור סוג חיפוש");
        }
    }, [searchType, isLoggedIn, location.search]);

    const fetchFavorites = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;
            const res = await axios.get(`${API_URL}/user/favorites`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const ids = Array.isArray(res.data.favorites)
                ? res.data.favorites.map(t => t._id?.toString?.() ?? t._id)
                : [];
            setFavorites(ids);
        } catch (err) {
            console.error("⚠️ לא ניתן לטעון מועדפים", err);
            setFavorites([]);
        }
    };

    const handleFavoriteToggle = async (trainerId) => {
        if (!isLoggedIn) return navigate('/login');
        try {
            const token = localStorage.getItem("token");
            await axios.put(`${API_URL}/user/favorites`, { trainerId }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            await fetchFavorites();
        } catch (err) {
            console.error("שגיאה בהוספה למועדפים", err);
        }
    };

    const handleRate = async (trainerId, value) => {
        try {
            setUpdating(true);
            const token = localStorage.getItem('token');
            const res = await axios.put(`${API_URL}/user/${trainerId}/rate`, { rating: value }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { rating, ratingsCount } = res.data;
            setResults(results =>
                results.map(t =>
                    t._id === trainerId
                        ? { ...t, rating, ratings: Array.from({ length: ratingsCount }) }
                        : t
                )
            );
        } catch (err) {
            alert('שגיאה בשמירת דירוג');
        } finally {
            setUpdating(false);
        }
    };

    // ⬇️ ללא סינון סוג – רק עיר/מרחק + מיון לפי מרחק כשיש מיקום
    const filteredResults = results
        .filter(r => {
            if (!locationFilter) return true;
            const city = r.address?.city || '';
            return city.trim().toLowerCase().includes(locationFilter.trim().toLowerCase());
        })
        .filter(r => {
            if (!userLocation) return true;
            const c = r.address?.coordinates;
            if (!c || typeof c.lat !== 'number' || typeof c.lng !== 'number') return false;
            const distKm = haversine(userLocation, { lat: c.lat, lng: c.lng }) / 1000;
            return distKm <= distance;
        })
        .sort((a, b) => {
            if (!userLocation) return 0;
            const ca = a.address?.coordinates;
            const cb = b.address?.coordinates;
            if (!ca || !cb || typeof ca.lat !== 'number' || typeof ca.lng !== 'number' || typeof cb.lat !== 'number' || typeof cb.lng !== 'number') {
                return 0;
            }
            const distA = haversine(userLocation, { lat: ca.lat, lng: ca.lng }) / 1000;
            const distB = haversine(userLocation, { lat: cb.lat, lng: cb.lng }) / 1000;
            return distA - distB;
        });

    const favoriteTrainers = filteredResults.filter(r => favorites.includes(r._id));
    const otherTrainers = filteredResults.filter(r => !favorites.includes(r._id));

    if (loading) return <Loader />;
    if (error) return <div>{error}</div>;

    const renderCard = (trainer) => (
        <Card key={trainer._id}>
            {trainer.image ? (
                <Image src={trainer.image} alt={trainer.name} />
            ) : (
                <div style={{
                    width: '100%',
                    height: 160,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#f5f5f5'
                }}>
                    <FaFemale size={80} color="#6c5ce7" />
                </div>
            )}

            <Content>
                <Name>{trainer.name}</Name>
                {/* אפשר להשאיר/להסיר את התג בהתאם לרצונך. כאן השארתי כדי שמשתמשים יראו את הסוג. */}
                <Type>{trainer.role === 'trainer' ? 'מאמנת אישית' : 'מאמנת קבוצתית'}</Type>

                <Info>
                    📍 {trainer.address?.street && trainer.address?.city
                        ? `${trainer.address.street}, ${trainer.address.city}`
                        : trainer.address?.city || 'לא זמין'}
                </Info>

                {trainer.expertise?.length > 0 && <Info>💪 {trainer.expertise.join(', ')}</Info>}

                <Info>
                    דירוג:
                    <StarRating
                        rating={trainer.rating}
                        onRate={(value) => handleRate(trainer._id, value)}
                        readOnly={updating}
                    />
                    {trainer.rating > 0 && (
                        <span style={{ marginRight: 6, fontSize: '0.95em', color: '#666' }}>
                            ({trainer.rating.toFixed(1)}{trainer.ratings?.length ? ` מתוך ${trainer.ratings.length}` : ""})
                        </span>
                    )}
                </Info>

                <Button onClick={() => handleFavoriteToggle(trainer._id)}>
                    {favorites.includes(trainer._id) ? "💖 במועדפים" : "🤍 הוספה למועדפים"}
                </Button>

                <Button onClick={() => setSelectedTrainer(trainer)}>📞 צור קשר</Button>

                <Button onClick={() => navigate(`/trainer/${trainer._id}`)}>👤 צפייה בפרופיל</Button>
            </Content>
        </Card>
    );

    return (
        <Container>
            <Header>
                <Title>חיפוש מאמנות</Title>
                <Subtitle>מצאנו {filteredResults.length} תוצאות</Subtitle>
            </Header>

            <Filters>
                <Input
                    placeholder="סנן לפי עיר"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                />
                <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    מרחק:
                    <input
                        type="range"
                        min={1}
                        max={50}
                        step={1}
                        value={distance}
                        onChange={e => setDistance(Number(e.target.value))}
                        style={{ margin: '0 8px' }}
                    />
                    <span>{distance} ק"מ</span>
                </label>
                <span style={{ alignSelf: 'center', fontSize: 14, color: '#6c5ce7' }}>
                    {userLocation
                        ? "🔎 סינון לפי קרבה פועל"
                        : "📍 אפשר להפעיל חיפוש לפי קרבה ע״י שיתוף מיקום"}
                </span>
            </Filters>

            {filteredResults.length === 0 ? (
                <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>לא נמצאו מאמנות זמינות כרגע</p>
            ) : (
                <>
                    <h3>💖 המועדפות עלייך:</h3>
                    {favoriteTrainers.length > 0 ? (
                        <Grid>{favoriteTrainers.map(renderCard)}</Grid>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888' }}>אין מועדפות כרגע</p>
                    )}

                    <hr style={{ margin: '2rem 0' }} />

                    <h3>כל שאר התוצאות:</h3>
                    <Grid>{otherTrainers.map(renderCard)}</Grid>
                </>
            )}

            {selectedTrainer && (
                <ContactPopup trainer={selectedTrainer} onClose={() => setSelectedTrainer(null)} />
            )}
        </Container>
    );
};

export default SearchTrainer;
