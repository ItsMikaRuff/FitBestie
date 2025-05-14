import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import styled from 'styled-components';

const LIBRARIES = ['places'];

function calculateDistance(lat1, lon1, lat2, lon2) {
    const toRad = x => (x * Math.PI) / 180;
    const R = 6371e3;
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δφ = toRad(lat2 - lat1);
    const Δλ = toRad(lon2 - lon1);
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
        Math.cos(φ1) * Math.cos(φ2) *
        Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

const Container = styled.section`
  width: 100%;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #fdfbfb 0%, #ebedee 100%);
  border-radius: 25px;
`;

const Inner = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 1440px;
  margin: 0 auto;
  gap: 2rem;
  
`;

const Top = styled.div`
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: wrap;
  
`;

const MapWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  height: 300px;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
`;

const ListWrapper = styled.div`
  flex: 1;
  min-width: 300px;
  max-height: 300px;
  overflow-y: auto;
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.06);
`;

const Title = styled.h2`
  font-size: 1.8rem;
  color: #222;
`;

const RadiusSlider = styled.div`
  margin-bottom: 2rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #333;
  }
  input[type="range"] {
    width: 100%;
    accent-color: #5a67d8;
  }
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  padding: 0.5rem;
  margin-bottom: 0.7rem;
  background: #fefefe;
  border-radius: 12px;
  border: 1px solid #e4e4e4;
  line-height: 1.4;
  box-shadow: 0 2px 6px rgba(0,0,0,0.03);
`;

export default function GymSearch() {
    const [gyms, setGyms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [radius, setRadius] = useState(3000);
    const [position, setPosition] = useState(null);
    const mapRef = useRef(null);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
        libraries: LIBRARIES,
    });

    useEffect(() => {
        if (loadError) {
            setError('שגיאה בטעינת Google Maps');
            setLoading(false);
            return;
        }
        if (!isLoaded) return;

        navigator.geolocation.getCurrentPosition(
            ({ coords }) => {
                const { latitude: lat, longitude: lng } = coords;
                const location = new window.google.maps.LatLng(lat, lng);
                setPosition({ lat, lng });

                mapRef.current = new window.google.maps.Map(document.createElement('div'));
                const service = new window.google.maps.places.PlacesService(mapRef.current);

                const request = { location, radius, keyword: 'חדר כושר' };
                service.nearbySearch(request, (results, status) => {
                    if (status !== window.google.maps.places.PlacesServiceStatus.OK) {
                        setError('שגיאת PlacesService: ' + status);
                    } else {
                        const filtered = results
                            .map(place => {
                                const lat2 = place.geometry.location.lat();
                                const lng2 = place.geometry.location.lng();
                                const dist = calculateDistance(lat, lng, lat2, lng2);
                                return { ...place, distance: dist };
                            })
                            .filter(p => p.distance <= radius)
                            .sort((a, b) => a.distance - b.distance);

                        setGyms(filtered);
                    }
                    setLoading(false);
                });
            },
            err => {
                setError('לא ניתן לאתר מיקום: ' + err.message);
                setLoading(false);
            }
        );
    }, [isLoaded, loadError, radius]);

    if (loadError) return <p style={{ color: 'red' }}>{error}</p>;
    if (!isLoaded) return <p>טוען מפה ושירותי Places…</p>;

    return (
        <Container>
            <Inner>
                <Top>
                    <MapWrapper>
                        {position && (
                            <GoogleMap
                                mapContainerStyle={{ width: '100%', height: '100%' }}
                                center={position}
                                zoom={13}
                                options={{ clickableIcons: false }}
                            >
                                {gyms.map(gym => (
                                    <Marker
                                        key={gym.place_id}
                                        position={{
                                            lat: gym.geometry.location.lat(),
                                            lng: gym.geometry.location.lng(),
                                        }}
                                        title={gym.name}
                                    />
                                ))}
                            </GoogleMap>
                        )}
                    </MapWrapper>

                    <ListWrapper>
                        <Title>מכוני כושר בטווח של {radius / 1000} ק״מ</Title>
                        <RadiusSlider>
                            <label htmlFor="radius">בחר טווח (בק״מ): {radius / 1000}</label>
                            <input
                                id="radius"
                                type="range"
                                min="1"
                                max="20"
                                step="1"
                                value={radius / 1000}
                                onChange={e => setRadius(Number(e.target.value) * 1000)}
                            />
                        </RadiusSlider>

                        {loading && <p>טוען תוצאות…</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        {!loading && !error && gyms.length === 0 && <p>לא נמצאו מכונים בטווח זה.</p>}

                        <List>
                            {gyms.map(gym => (
                                <ListItem key={gym.place_id}>
                                    <strong>{gym.name}</strong><br />
                                    {gym.vicinity || gym.formatted_address}<br />
                                    דירוג: {gym.rating ?? 'אין'}<br />
                                    מרחק: {(gym.distance / 1000).toFixed(1)} ק״מ
                                </ListItem>
                            ))}
                        </List>
                    </ListWrapper>
                </Top>
            </Inner>
        </Container>
    );
}