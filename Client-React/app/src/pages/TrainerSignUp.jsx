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
    const [touched, setTouched] = useState({
        name: false,
        email: false,
        password: false,
        confirmPassword: false,
        phone: false,
        location: false,
        paymentDetails: false
    });

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

    // const handleExpertiseChange = (e) => {
    //     const { value, checked } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         expertise: checked
    //             ? [...prev.expertise, value]
    //             : prev.expertise.filter(item => item !== value)
    //     }));
    // };

    const handlePaymentChange = (paymentDetails) => {
        setFormData(prev => ({
            ...prev,
            paymentDetails
        }));
    };

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        return regex.test(email);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // וולידציה של שדות
        if (
            !formData.name ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword ||
            !formData.phone ||
            !formData.paymentDetails.cardNumber ||
            !formData.paymentDetails.expiryDate ||
            !formData.paymentDetails.cvv
        ) {
            setError('אנא מלאי את כל השדות החיוניים');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('הסיסמאות לא תואמות');
            return;
        }

        if (!validateEmail(formData.email)) {
            setError('כתובת אימייל לא תקינה');
            return;
        }

        setLoading(true);

        try {
            console.log('sending data:', {
                ...formData,
                role: 'trainer',
                trainerStatus: 'pending'
            });

            const response = await axios.post(`${API_URL}/user`, {
                ...formData,
                role: 'trainer',
                trainerStatus: 'pending'
            }, {withCredentials:true});

            login(response.data);
            navigate('/signup-successful');
        } catch (error) {
            if (error.response?.data?.message) {
                setError(error.response.data.message);  // הודעה מהשרת
            } else {
                setError('אירעה שגיאה בלתי צפויה');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleBlur = (e) => {
        setTouched(prev => ({ ...prev, [e.target.name]: true }));
    };

    // const expertiseOptions = [
    //     { value: 'fitness', label: 'כושר גופני' },
    //     { value: 'yoga', label: 'יוגה' },
    //     { value: 'pilates', label: 'פילאטיס' },
    //     { value: 'dance', label: 'ריקוד' },
    //     { value: 'nutrition', label: 'תזונה' },
    //     { value: 'weight-loss', label: 'ירידה במשקל' },
    //     { value: 'muscle-gain', label: 'בניית שריר' },
    //     { value: 'rehabilitation', label: 'שיקום' }
    // ];

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
                    onBlur={handleBlur}
                    placeholder="שם מלא"
                    required
                    style={{ textAlign: 'right' }}
                />
                {touched.name && !formData.name && <GlobalError>שם מלא הוא שדה חובה</GlobalError>}

                <SignUpInput
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="אימייל"
                    required
                    style={{ textAlign: 'right' }}
                />
                {touched.email && !formData.email && <GlobalError>אימייל הוא שדה חובה</GlobalError>}
                {touched.email && formData.email && !validateEmail(formData.email) && <GlobalError>כתובת אימייל לא תקינה</GlobalError>}

                <SignUpInput
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="סיסמה"
                    required
                    style={{ textAlign: 'right' }}
                />
                {touched.password && !formData.password && <GlobalError>סיסמה היא שדה חובה</GlobalError>}

                <SignUpInput
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="אימות סיסמה"
                    required
                    style={{ textAlign: 'right' }}
                />
                {touched.confirmPassword && formData.password !== formData.confirmPassword && <GlobalError>הסיסמאות לא תואמות</GlobalError>}

                <SignUpInput
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="מספר טלפון"
                    required
                    style={{ textAlign: 'right' }}
                />
                {touched.phone && !formData.phone && <GlobalError>מספר טלפון הוא שדה חובה</GlobalError>}

                <div style={{ margin: '10px 0', textAlign: 'right' }}>
                    <h3 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>תחומי מומחיות</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                        {/* {expertiseOptions.map(option => (
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
                        ))} */}
                    </div>
                </div>

                <AddressInput
                    value={formData.location}
                    onChange={newAddress => {
                        setFormData(prev => ({
                            ...prev,
                            location: newAddress
                        }));
                    }}
                    onBlur={handleBlur}
                    placeholder="כתובת"
                    style={{ width: '100%' }}
                />
                {touched.location && !formData.location && <GlobalError>כתובת היא שדה חובה</GlobalError>}

                <PaymentAuth onPaymentChange={handlePaymentChange} />

                {error && (
                    <GlobalError>
                        {error}
                    </GlobalError>
                )}

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
