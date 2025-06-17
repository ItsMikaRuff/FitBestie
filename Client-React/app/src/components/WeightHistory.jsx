// WeightHistory.js
import React, { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const HistoryContainer = styled.div`
  margin: 2rem auto;
  max-width: 800px;
  background-color: #fff;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.07);
  position: relative;
`;

const HistoryTitle = styled.h3`
  font-size: 1.5rem;
  color: #2d3436;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ChartLabel = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #636e72;
`;

const CustomTooltip = ({ hoveredPoint, onDelete }) => {
  if (!hoveredPoint) return null;

  const handleDelete = async () => {
    if (!window.confirm('למחוק את השקילה מתאריך זה?')) return;
    try {
      await axios.delete(`${API_URL}/measurement/${hoveredPoint._id}`);
      onDelete(hoveredPoint._id);
    } catch (err) {
      alert('שגיאה במחיקה ❌');
    }
  };

  return (
    <div
      onMouseLeave={() => onDelete(null)}
      style={{
        position: 'absolute',
        left: hoveredPoint.x,
        top: hoveredPoint.y - 20,
        transform: 'translate(-50%, 0)',
        backgroundColor: '#fff0f5',
        border: '1px solid #f8c3d8',
        borderRadius: '12px',
        padding: '10px 14px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.07)',
        fontSize: '0.95rem',
        direction: 'rtl',
        pointerEvents: 'auto',
        zIndex: 10,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button
          onClick={handleDelete}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#c44569',
            fontSize: '1rem',
            cursor: 'pointer',
          }}
          title="מחק שקילה"
        >
          ❌
        </button>
      </div>
      <div>משקל: <strong>{hoveredPoint.weight} ק״ג</strong></div>
      <div>BMI: <strong>{hoveredPoint.bmi}</strong></div>
    </div>
  );
};

const WeightHistory = ({ history }) => {
  const sorted = [...history]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(-10);

  const [data, setData] = useState(sorted);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  const weights = data.map((e) => e.weight);
  const minWeight = Math.floor(Math.min(...weights) / 10) * 10 - 5;
  const maxWeight = Math.ceil(Math.max(...weights) / 10) * 10 + 5;

  const chartData = data.map((entry) => ({
    _id: entry._id,
    date: new Date(entry.date).toLocaleDateString('he-IL'),
    weight: entry.weight,
    bmi: entry.bmi,
  }));

  return (
    <HistoryContainer>
      <HistoryTitle>📈 היסטוריית משקל</HistoryTitle>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData}>
          <CartesianGrid stroke="#f4d6df" strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} />
          <YAxis domain={[minWeight, maxWeight]} tick={{ fontSize: 12 }} />
          <Line
            type="monotone"
            dataKey="weight"
            stroke="#e5508b"
            strokeWidth={3}
            dot={({ cx, cy, payload }) => (
              <circle
                cx={cx}
                cy={cy}
                r={5}
                fill="#fff"
                stroke="#c44569"
                strokeWidth={2}
                onMouseEnter={() => setHoveredPoint({ ...payload, x: cx, y: cy })}
                style={{ cursor: 'pointer' }}
              />
            )}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
      <ChartLabel>תאריך</ChartLabel>
      <CustomTooltip hoveredPoint={hoveredPoint} onDelete={(id) => {
        if (id === null) return setHoveredPoint(null);
        setData((prev) => prev.filter((item) => item._id !== id));
        setHoveredPoint(null);
      }} />
    </HistoryContainer>
  );
};

export default WeightHistory;
