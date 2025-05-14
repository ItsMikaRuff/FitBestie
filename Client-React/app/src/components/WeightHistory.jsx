// WeightHistory.js
import React from 'react';
import styled from 'styled-components';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const HistoryContainer = styled.div`
    margin-top: 2rem;
`;

const HistoryTitle = styled.h3`
    font-size: 1.2rem;
    color: #6c5ce7;
    margin-bottom: 1rem;
`;

const WeightHistory = ({ history }) => {

    
    return (
        <HistoryContainer>
            <HistoryTitle>📈 היסטוריית משקל</HistoryTitle>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart data={history.map(h => ({
                    date: new Date(h.date).toLocaleDateString('he-IL'),
                    weight: h.weight
                }))}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[40, 200]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="weight" stroke="#ff6347" strokeWidth={2} dot={{ r: 4 }} />
                </LineChart>
            </ResponsiveContainer>
        </HistoryContainer>
    );
};

export default WeightHistory;
