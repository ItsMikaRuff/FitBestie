import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SignupSuccessful = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/profile'); // מעבר אוטומטי לפרופיל אחרי 3 שניות
        }, 3000);

        return () => clearTimeout(timer); // מניעת בעיות אם היוזר עוזב מהר
    }, [navigate]);

    return (
        <div style={{
            textAlign: 'center',
            marginTop: '100px',
            animation: 'fadeIn 2s',
        }}>
            <h1 style={{
                fontSize: '2.5rem',
                color: '#6c5ce7',
                marginBottom: '20px',
            }}>
                🎉 ההרשמה בוצעה בהצלחה!
            </h1>

            <p style={{
                fontSize: '1.2rem',
                color: '#555',
                marginBottom: '30px'
            }}>
                ברוכה הבאה ל־FitBestie 🌸
            </p>

            <div className="spinner" style={{
                margin: '0 auto',
                width: '50px',
                height: '50px',
                border: '5px solid #f3f3f3',
                borderTop: '5px solid #6c5ce7',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
            }} />

            {/* אנימציות CSS */}
            <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
        </div>
    );
};

export default SignupSuccessful;
