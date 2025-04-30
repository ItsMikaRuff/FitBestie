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

// map styling

// const MapContainer = styled.div`
//     width: 100%;
//     height: 200px;
//     margin: 1rem 0;
//     border-radius: 8px;
//     overflow: hidden;
// `;

const AddressInput = ({ value, onChange }) => {
    const [address, setAddress] = useState(value || {
        street: '',
        city: '',
        state: '',
        country: '',
        zipCode: '',
        coordinates: {
            lat: null,
            lng: null
        }
    });

    const initializeMap = useCallback(() => {
        if (!window.google || !window.google.maps) return;

        // map
        // const map = new window.google.maps.Map(document.getElementById('map'), {
        //     center: { lat: 31.7683, lng: 35.2137 }, // Default to Jerusalem
        //     zoom: 8
        // });

        // Create the Autocomplete input
        const input = document.getElementById('autocomplete-input');
        const autocomplete = new window.google.maps.places.Autocomplete(input, {
            types: ['address'],
            componentRestrictions: { country: 'il' }
        });

        // Listen for place changes
        autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.geometry) {
                const newAddress = {
                    street: place.name || '',
                    city: place.address_components.find(component => 
                        component.types.includes('locality'))?.long_name || '',
                    state: place.address_components.find(component => 
                        component.types.includes('administrative_area_level_1'))?.long_name || '',
                    country: place.address_components.find(component => 
                        component.types.includes('country'))?.long_name || '',
                    zipCode: place.address_components.find(component => 
                        component.types.includes('postal_code'))?.long_name || '',
                    coordinates: {
                        lat: place.geometry.location.lat(),
                        lng: place.geometry.location.lng()
                    }
                };

                setAddress(newAddress);
                onChange(newAddress);
                // map.setCenter(place.geometry.location);
                // map.setZoom(15);
            }
        });
    }, [onChange]);

    useEffect(() => {
        // Check if script is already loaded
        if (document.querySelector('script[src*="maps.googleapis.com"]')) {
            initializeMap();
            return;
        }

        // Load Google Maps script asynchronously
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
            // Cleanup
            const script = document.querySelector('script[src*="maps.googleapis.com"]');
            if (script) {
                script.remove();
            }
        };
    }, [initializeMap]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        const newAddress = {
            ...address,
            [name]: value
        };
        setAddress(newAddress);
        onChange(newAddress);
    };

    return (
        <AddressContainer>
            <Input
                id="autocomplete-input"
                type="text"
                placeholder="הזן כתובת"
                style={{ marginBottom: '1rem' }}
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
            
            {/* map */}
            {/* <MapContainer id="map" /> */}
        </AddressContainer>
    );
};

export default AddressInput; 