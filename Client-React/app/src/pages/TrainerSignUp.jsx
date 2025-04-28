import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../context/UserContext';
import {
    SignUpFormComponent,
    SignUpInput,
    SignUpButton,
    SignUpTitle,
    GlobalError
} from '../components/styledComponents';
import Loader from '../components/Loader';
import PaymentAuth from '../components/PaymentAuth';
import AddressInput from '../components/AddressInput';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const TrainerSignUp = () => {
    const navigate = useNavigate();
    const { login } = useUser();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
        expertise: [],
        location: '',
        paymentDetails: {
            cardNumber: '',
            expiryDate: '',
            cvv: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleExpertiseChange = (e) => {
        const { value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            expertise: checked 
                ? [...prev.expertise, value]
                : prev.expertise.filter(item => item !== value)
        }));
    };

    const handlePaymentChange = (paymentDetails) => {
        setFormData(prev => ({
            ...prev,
            paymentDetails
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${API_URL}/user`, {
                ...formData,
                role: 'trainer',
                trainerStatus: 'pending'
            });

            login(response.data);
            navigate('/profile');
        } catch (error) {
            setError(error.response?.data?.message || 'שגיאה בהרשמה');
        } finally {
            setLoading(false);
        }
    };

    const expertiseOptions = [
        { value: 'fitness', label: 'כושר גופני' },
        { value: 'yoga', label: 'יוגה' },
        { value: 'pilates', label: 'פילאטיס' },
        { value: 'dance', label: 'ריקוד' },
        { value: 'nutrition', label: 'תזונה' },
        { value: 'weight-loss', label: 'ירידה במשקל' },
        { value: 'muscle-gain', label: 'בניית שריר' },
        { value: 'rehabilitation', label: 'שיקום' }
    ];

    return (
        <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            padding: '20px',
            backgroundColor: '#f8eaef',
            direction: 'rtl'
        }}>
            <SignUpTitle>הרשמה כמאמנת כושר</SignUpTitle>
            <SignUpFormComponent onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
                <SignUpInput
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="שם מלא"
                    required
                    style={{ textAlign: 'right' }}
                />

                <SignUpInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="אימייל"
                    required
                    style={{ textAlign: 'right' }}
                />

                <SignUpInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="סיסמה"
                    required
                    style={{ textAlign: 'right' }}
                />

                <SignUpInput
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="אימות סיסמה"
                    required
                    style={{ textAlign: 'right' }}
                />

                <SignUpInput
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="מספר טלפון"
                    required
                    style={{ textAlign: 'right' }}
                />

                <div style={{ margin: '10px 0', textAlign: 'right' }}>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>תחומי מומחיות</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {expertiseOptions.map(option => (
                            <label key={option.value} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <input
                                    type="checkbox"
                                    value={option.value}
                                    checked={formData.expertise.includes(option.value)}
                                    onChange={handleExpertiseChange}
                                    style={{ width: '16px', height: '16px' }}
                                />
                                {option.label}
                            </label>
                        ))}
                    </div>
                </div>

                <AddressInput style={{width: '100px'}}/>

                <PaymentAuth onPaymentChange={handlePaymentChange} />

                {error && <GlobalError>{error}</GlobalError>}

                <SignUpButton type="submit" disabled={loading}>
                    {loading ? 'מבצע הרשמה...' : 'הרשמה כמאמנת'}
                </SignUpButton>
                {loading && <Loader />}
            </SignUpFormComponent>

            <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <Link to="/login" style={{ display: 'block', marginBottom: '10px' }}>כבר יש לך חשבון? התחבר</Link>
                <Link to="/" style={{ display: 'block' }}>חזרה לדף הבית</Link>
            </div>
        </div>
    );
};

export default TrainerSignUp; 