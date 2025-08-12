//BodyTypeCalculator.jsx
// This component calculates the body type based on user input measurements.


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

const BodyTypeText = styled.p`
    font-size: 1.1rem;
    color: ${props => {
        switch (props.$bodyType) {
            case 'אקטומורף': return '#3498db';
            case 'מזומורף': return '#2ecc71';
            case 'אנדומורף': return '#e67e22';
            default: return '#333';
        }
    }};
    font-weight: 500;
    margin: 0.5rem 0;
`;

const DescriptionText = styled.p`
    font-size: 0.9rem;
    color: #666;
    margin: 0.5rem 0;
    line-height: 1.4;
`;

const BodyTypeCalculator = () => {
    const { user, updateUser } = useUser();
    const [measurements, setMeasurements] = useState({
        wrist: user?.measurements?.wrist || '',
        ankle: user?.measurements?.ankle || '',
        hip: user?.measurements?.hip || '',
        waist: user?.measurements?.waist || '',
        shoulder: user?.measurements?.shoulder || ''
    });
    const [bodyType, setBodyType] = useState(user?.bodyType?.type || '');
    const [bodyTypeDescription, setBodyTypeDescription] = useState(user?.bodyType?.description || '');
    const [loading, setLoading] = useState(false);

    const resetInputs = () => {
        setMeasurements({
            wrist: '',
            ankle: '',
            hip: '',
            waist: '',
            shoulder: ''
        });
    };

    const calculateBodyType = async () => {
        const { wrist, ankle, hip, waist, shoulder } = measurements;
        if (!wrist || !ankle || !hip || !waist || !shoulder) return;

        const wristAnkleRatio = wrist / ankle;
        const hipWaistRatio = hip / waist;
        const shoulderHipRatio = shoulder / hip;

        // 🧮 ננסה למשוך BMI אם יש
        const height = user?.measurements?.height;
        const weight = user?.measurements?.weight;
        const bmi = height && weight ? weight / (height * height) : null;

        let ectoScore = 0;
        let mesoScore = 0;
        let endoScore = 0;

        // יחס שורש כף יד לקרסול
        if (wristAnkleRatio < 0.85) ectoScore++;
        else if (wristAnkleRatio > 1.05) endoScore++;
        else mesoScore++;

        // יחס ירך למותניים
        if (hipWaistRatio < 1.1) ectoScore++;
        else if (hipWaistRatio > 1.4) endoScore++;
        else mesoScore++;

        // יחס כתפיים לירכיים
        if (shoulderHipRatio > 1.25) mesoScore++;
        else if (shoulderHipRatio < 1.05) endoScore++;
        else ectoScore++;

        // 🧠 שקלול BMI רק אם קיים
        if (bmi) {
            if (bmi < 18.5) ectoScore++;
            else if (bmi >= 25) endoScore++;
            else mesoScore++;
        }

        let newBodyType;
        let newBodyTypeDescription;

        if (ectoScore >= mesoScore && ectoScore >= endoScore) {
            newBodyType = 'אקטומורף';
            newBodyTypeDescription = 'מבנה גוף רזה, מתקשה לעלות במשקל ובמסת שריר. מאופיין בעצמות דקות, כתפיים צרות, ומטבוליזם מהיר.';
        } else if (mesoScore >= ectoScore && mesoScore >= endoScore) {
            newBodyType = 'מזומורף';
            newBodyTypeDescription = 'מבנה גוף אתלטי, קל יחסית לבנות שריר. מאופיין בכתפיים רחבות, מותניים צרות, ומטבוליזם מאוזן.';
        } else {
            newBodyType = 'אנדומורף';
            newBodyTypeDescription = 'מבנה גוף רחב, נוטה לעלות במשקל בקלות. מאופיין בעצמות רחבות, כתפיים רחבות, ומטבוליזם איטי.';
        }
        setBodyType(newBodyType);
        setBodyTypeDescription(newBodyTypeDescription);

        // Save to database
        try {
            setLoading(true);
            const userId = user?._id || user?.id;

            // Save to measurements table
            await axios.post(
                `${API_URL}/bodyType`,
                {
                    userId,
                    wrist: Number(wrist),
                    ankle: Number(ankle),
                    hip: Number(hip),
                    waist: Number(waist),
                    shoulder: Number(shoulder),
                    bodyType: newBodyType,
                    bodyTypeDescription: newBodyTypeDescription,
                    date: new Date()
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            // Update user's current measurements and body type
            const data = new FormData();
            data.append("wrist", wrist);
            data.append("ankle", ankle);
            data.append("hip", hip);
            data.append("waist", waist);
            data.append("shoulder", shoulder);
            data.append("lastUpdated", new Date().toISOString());
            data.append("bodyType", newBodyType);
            data.append("bodyTypeDescription", newBodyTypeDescription);
            data.append("lastCalculated", new Date().toISOString());

            console.log("Sending data:", Object.fromEntries(data));

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
            console.error("Error saving body type data:", error);
            alert("שגיאה בשמירת הנתונים");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setMeasurements(prev => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <CalculatorContainer>
            <Title>📏 מחשבון מבנה גוף</Title>
            <FormGroup>
                <Label>היקף שורש כף יד (סנטימטר)</Label>
                <Input
                    type="number"
                    name="wrist"
                    value={measurements.wrist}
                    onChange={handleChange}
                    placeholder="הכנס היקף שורש כף יד"
                />
            </FormGroup>
            <FormGroup>
                <Label>היקף קרסול (סנטימטר)</Label>
                <Input
                    type="number"
                    name="ankle"
                    value={measurements.ankle}
                    onChange={handleChange}
                    placeholder="הכנס היקף קרסול"
                />
            </FormGroup>
            <FormGroup>
                <Label>היקף ירכיים (סנטימטר)</Label>
                <Input
                    type="number"
                    name="hip"
                    value={measurements.hip}
                    onChange={handleChange}
                    placeholder="הכנס היקף ירכיים"
                />
            </FormGroup>
            <FormGroup>
                <Label>היקף מותניים (סנטימטר)</Label>
                <Input
                    type="number"
                    name="waist"
                    value={measurements.waist}
                    onChange={handleChange}
                    placeholder="הכנס היקף מותניים"
                />
            </FormGroup>
            <FormGroup>
                <Label>רוחב כתפיים (סנטימטר)</Label>
                <Input
                    type="number"
                    name="shoulder"
                    value={measurements.shoulder}
                    onChange={handleChange}
                    placeholder="הכנס רוחב כתפיים"
                />
            </FormGroup>
            <button
                onClick={calculateBodyType}
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
                {loading ? 'שומר...' : 'חשב מבנה גוף'}
            </button>

            {bodyType && (
                <ResultContainer>
                    <BodyTypeText bodyType={bodyType}>מבנה גוף: {bodyType}</BodyTypeText>
                    <DescriptionText>{bodyTypeDescription}</DescriptionText>
                </ResultContainer>
            )}
        </CalculatorContainer>
    );
};

export default BodyTypeCalculator; 