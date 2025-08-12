// BMICalculator.jsx
import React, { useState, useEffect } from 'react';
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
  &:focus { outline: none; border-color: #6c5ce7; }
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
    switch (props.$category) {
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

const LastUpdated = styled.small`
  display: block;
  margin-top: 0.5rem;
  color: #777;
`;

const BMICalculator = () => {
  const { user, updateUser } = useUser();

let cachedUser = null;
try {
  cachedUser = JSON.parse(localStorage.getItem("user") || "null");
} catch (e) {
  cachedUser = null; // ← לא משאיר catch ריק, לא מאפס שדות קיימים
}

  const initialHeight = user?.measurements?.height ?? cachedUser?.measurements?.height ?? '';
  const initialWeight = user?.measurements?.weight ?? cachedUser?.measurements?.weight ?? '';
  const initialBMI = user?.measurements?.bmi ?? cachedUser?.measurements?.bmi ?? null;
  const initialCategory = user?.measurements?.bmiCategory ?? cachedUser?.measurements?.bmiCategory ?? '';
  const initialUpdated = user?.measurements?.lastUpdated ?? cachedUser?.measurements?.lastUpdated ?? null;

  const [height, setHeight] = useState(initialHeight);
  const [weight, setWeight] = useState(initialWeight);
  const [bmi, setBMI] = useState(initialBMI);
  const [category, setCategory] = useState(initialCategory);
  const [lastUpdated, setLastUpdated] = useState(initialUpdated);
  const [loading, setLoading] = useState(false);

  // ממלאים שדות רק אם ריקים, כאשר ה-user נטען (לא מאפסים אם יש ערך)
  useEffect(() => {
    const m = user?.measurements;
    if (!m) return;
    if ((height === '' || height == null) && m.height) setHeight(m.height);
    if ((weight === '' || weight == null) && m.weight) setWeight(m.weight);
    if ((bmi === '' || bmi == null) && m.bmi != null) setBMI(m.bmi);
    if (!category && m.bmiCategory) setCategory(m.bmiCategory);
    if (!lastUpdated && m.lastUpdated) setLastUpdated(m.lastUpdated);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const calculateAndSaveBMI = async () => {
    const h = Number(height);
    const w = Number(weight);
    if (!h || !w || h <= 0 || w <= 0) {
      alert("יש להזין ערכים תקינים עבור גובה ומשקל");
      return;
    }

    const heightInMeters = h / 100;
    const bmiValue = w / (heightInMeters * heightInMeters);
    const bmiResult = Number(bmiValue.toFixed(1));
    setBMI(bmiResult);

    let bmiCategory = '';
    if (bmiValue < 18.5) bmiCategory = 'תת משקל';
    else if (bmiValue < 25) bmiCategory = 'משקל תקין';
    else if (bmiValue < 30) bmiCategory = 'עודף משקל';
    else if (bmiValue < 35) bmiCategory = 'השמנה';
    else bmiCategory = 'השמנה חולנית';

    setCategory(bmiCategory);
    const date = new Date();
    setLastUpdated(date);

    try {
      setLoading(true);
      const userId = user?._id || user?.id;
      if (!userId) {
        alert("שגיאה: לא אותר מזהה משתמש");
        setLoading(false);
        return;
      }

      // שמירה לטבלת המדידות (השרת מסנכרן גם את user.measurements + weightHistory)
      await axios.post(`${API_URL}/measurement`, {
        userId,
        height: h,
        weight: w,
        bmi: bmiResult,
        bmiCategory,
        date
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      // עדכון שדות המשתמש (ישיר), כדי שה־context וה־localStorage יתעדכנו מיד
      const res = await axios.post(`${API_URL}/user/update/${userId}`, {
        height: h,
        weight: w,
        bmi: bmiResult,
        bmiCategory,
        lastUpdated: date
      }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      updateUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));

      // מניעת איפוס ידני של השדות אחרי שמירה
      setHeight(res.data?.measurements?.height ?? h);
      setWeight(res.data?.measurements?.weight ?? w);
      setBMI(res.data?.measurements?.bmi ?? bmiResult);
      setCategory(res.data?.measurements?.bmiCategory ?? bmiCategory);
      setLastUpdated(res.data?.measurements?.lastUpdated ?? date);
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
        <Label>משקל (ק״ג)</Label>
        <Input
          type="number"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="הכנס משקל בקילוגרם"
        />
      </FormGroup>

      <button
        onClick={calculateAndSaveBMI}
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
          opacity: loading ? 0.7 : 1
        }}
      >
        {loading ? 'שומר...' : 'חשב BMI'}
      </button>

      {bmi != null && (
        <ResultContainer>
          <ResultText>ה-BMI שלך הוא: {bmi}</ResultText>
          <CategoryText $category={category}>{category}</CategoryText>
          {lastUpdated && (
            <LastUpdated>
              עודכן לאחרונה ב־{new Date(lastUpdated).toLocaleDateString('he-IL')}
            </LastUpdated>
          )}
        </ResultContainer>
      )}
    </CalculatorContainer>
  );
};

export default BMICalculator;
