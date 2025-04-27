import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { useUser } from '../context/UserContext';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const CalculatorContainer = styled.div`
    background: white;
    border-radius: 20px;
    padding: 2rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    margin-bottom: 2rem;
`;

const Title = styled.h2`
    color: #6c5ce7;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
`;

const FormGroup = styled.div`
    margin-bottom: 1rem;
`;

const Label = styled.label`
    display: block;
    margin-bottom: 0.5rem;
    color: #333;
    font-weight: 500;
`;

const Input = styled.input`
    width: 100%;
    padding: 0.8rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #6c5ce7;
    }
`;

const ResultContainer = styled.div`
    margin-top: 1.5rem;
    padding: 1rem;
    background: #f8f9fa;
    border-radius: 8px;
    text-align: center;
`;

const ResultText = styled.p`
    font-size: 1.2rem;
    color: #333;
    margin: 0.5rem 0;
`;

const CategoryText = styled.p`
    font-size: 1.1rem;
    color: ${props => {
        switch(props.category) {
            case 'תת משקל': return '#e74c3c';
            case 'משקל תקין': return '#2ecc71';
            case 'עודף משקל': return '#f1c40f';
            case 'השמנה': return '#e67e22';
            case 'השמנה חולנית': return '#c0392b';
            default: return '#333';
        }
    }};
    font-weight: 500;
    margin: 0.5rem 0;
`;

const BMICalculator = () => {
    const { user, updateUser } = useUser();
    const [height, setHeight] = useState(user?.measurements?.height || '');
    const [weight, setWeight] = useState(user?.measurements?.weight || '');
    const [bmi, setBMI] = useState(user?.measurements?.bmi || null);
    const [category, setCategory] = useState(user?.measurements?.bmiCategory || '');
    const [loading, setLoading] = useState(false);

    const resetInputs = () => {
        setHeight('');
        setWeight('');
    };

    const calculateBMI = async () => {
        if (!height || !weight) return;

        const heightInMeters = height / 100;
        const bmiValue = weight / (heightInMeters * heightInMeters);
        const bmiResult = bmiValue.toFixed(1);
        setBMI(bmiResult);

        // Determine BMI category
        let bmiCategory;
        if (bmiValue < 18.5) {
            bmiCategory = 'תת משקל';
        } else if (bmiValue < 25) {
            bmiCategory = 'משקל תקין';
        } else if (bmiValue < 30) {
            bmiCategory = 'עודף משקל';
        } else if (bmiValue < 35) {
            bmiCategory = 'השמנה';
        } else {
            bmiCategory = 'השמנה חולנית';
        }
        setCategory(bmiCategory);

        // Save to database
        try {
            setLoading(true);
            const userId = user?._id || user?.id;

            // Save to measurements table
            await axios.post(
                `${API_URL}/measurement`,
                {
                    userId,
                    height: Number(height),
                    weight: Number(weight),
                    bmi: Number(bmiResult),
                    bmiCategory,
                    date: new Date()
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            // Update user's current measurements
            const data = new FormData();
            data.append("height", height);
            data.append("weight", weight);
            data.append("bmi", bmiResult);
            data.append("bmiCategory", bmiCategory);
            data.append("lastUpdated", new Date().toISOString());

            const res = await axios.post(
                `${API_URL}/user/update/${userId}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            updateUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            
            // Reset only input fields after successful save
            resetInputs();
        } catch (error) {
            console.error("Error saving BMI data:", error);
            alert("שגיאה בשמירת הנתונים");
        } finally {
            setLoading(false);
        }
    };

    return (
        <CalculatorContainer>
            <Title>🧮 מחשבון BMI</Title>
            <FormGroup>
                <Label>גובה (סנטימטר)</Label>
                <Input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="הכנס גובה בסנטימטר"
                />
            </FormGroup>
            <FormGroup>
                <Label>משקל (קג)</Label>
                <Input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="הכנס משקל בקילוגרם"
                />
            </FormGroup>
            <button
                onClick={calculateBMI}
                disabled={loading}
                style={{
                    backgroundColor: '#6c5ce7',
                    color: 'white',
                    padding: '0.8rem 1.5rem',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    width: '100%',
                    fontSize: '1rem',
                    transition: 'background-color 0.3s ease',
                    opacity: loading ? 0.7 : 1
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = '#5a4bcf')}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = '#6c5ce7')}
            >
                {loading ? 'שומר...' : 'חשב BMI'}
            </button>

            {bmi && (
                <ResultContainer>
                    <ResultText>ה-BMI שלך הוא: {bmi}</ResultText>
                    <CategoryText category={category}>{category}</CategoryText>
                </ResultContainer>
            )}
        </CalculatorContainer>
    );
};

export default BMICalculator; 