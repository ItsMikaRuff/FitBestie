import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';

const AddressContainer = styled.div`
    margin-bottom: 1rem;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    margin: 0.5rem 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;
    text-align: right;

    &:focus {
        outline: none;
        border-color: #6c5ce7;
    }
`;

const initialAddress = {
    street: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    coordinates: {
        lat: null,
        lng: null
    }
};

const isEmptyAddress = (addr) => {
    if (!addr) return true;
    // בדוק שכל השדות ריקים
    return (
        (!addr.street || addr.street.trim() === '') &&
        (!addr.city || addr.city.trim() === '') &&
        (!addr.state || addr.state.trim() === '') &&
        (!addr.country || addr.country.trim() === '') &&
        (!addr.zipCode || addr.zipCode.trim() === '') &&
        (!addr.coordinates || (!addr.coordinates.lat && !addr.coordinates.lng))
    );
};

const AddressInput = ({ value, onChange }) => {
    const [address, setAddress] = useState(value || initialAddress);

    // עדכונים אוטומטיים לקואורדינטות או רחוב דרך גוגל
    const initializeMap = useCallback(() => {
        if (!window.google || !window.google.maps) return;

        const input = document.getElementById('autocomplete-input');
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: 'il' }
        });

        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newAddress = {
                    street: place.name || '',
                    city: place.address_components?.find(component => component.types.includes('locality'))?.long_name || '',
                    state: place.address_components?.find(component => component.types.includes('administrative_area_level_1'))?.long_name || '',
                    country: place.address_components?.find(component => component.types.includes('country'))?.long_name || '',
                    zipCode: place.address_components?.find(component => component.types.includes('postal_code'))?.long_name || '',
                    coordinates: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    }
                };

                setAddress(newAddress);
                onChange(isEmptyAddress(newAddress) ? null : newAddress);
            }
        });
    }, [onChange]);

    useEffect(() => {
        // רק בטעינה ראשונית
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            initializeMap();
            return;
        }

        const loadGoogleMapsScript = () => {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&libraries=places&v=weekly`;
            script.async = true;
            script.defer = true;
            script.onload = initializeMap;
            document.head.appendChild(script);
        };

        loadGoogleMapsScript();

        return () => {
            const script = document.querySelector('script[src*="maps.googleapis.com"]');
            if (script) {
                script.remove();
            }
        };
    }, [initializeMap]);

    // שינוי שדות ידני
    const handleChange = (e) => {
        const { name, value } = e.target;
        const newAddress = {
            ...address,
            [name]: value
        };
        setAddress(newAddress);

        // רק אם יש ערך אמיתי (עיר או רחוב)
        if (!isEmptyAddress(newAddress)) {
            onChange(newAddress);
        } else {
            onChange(null); // מחזיר כתובת ריקה
        }
    };

    return (
        <AddressContainer>
            <Input
                id="autocomplete-input"
                type="text"
                placeholder="הזן כתובת"
                style={{ marginBottom: '1rem' }}
                // לא צריך value כאן, כי autocomplete של גוגל שולט
            />
            <Input
                name="city"
                value={address.city}
                onChange={handleChange}
                placeholder="עיר"
            />
            <Input
                name="state"
                value={address.state}
                onChange={handleChange}
                placeholder="מדינה"
            />
            <Input
                name="zipCode"
                value={address.zipCode}
                onChange={handleChange}
                placeholder="מיקוד"
            />
        </AddressContainer>
    );
};

export default AddressInput;
