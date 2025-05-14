import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styled from 'styled-components';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const HistoryContainer = styled.div`
    direction: rtl;
    text-align: right;
    margin-top: 2rem;
`;

const HistoryTitle = styled.h3`
    font-size: 1.2rem;
    color: #6c5ce7;
    margin-bottom: 1rem;
`;

const BMIHistory = ({ user }) => {
    const [history, setHistory] = useState([]);

    const fetchHistory = useCallback(async () => {
        try {
            const res = await axios.get(`${API_URL}/measurement/user/${user?._id || user?.id}`, {
                withCredentials: true
            });

            const sorted = res.data.sort((a, b) => new Date(a.date) - new Date(b.date));
            setHistory(sorted);
        } catch (error) {
            console.error("Failed to load BMI history", error);
        }
    }, [user]);

    useEffect(() => {
        if (user) fetchHistory();
    }, [user, fetchHistory]);

    return (
        <HistoryContainer>
            <HistoryTitle>📈 היסטוריית מדידות BMI</HistoryTitle>
            <ResponsiveContainer width="100%" height={250}>
                <LineChart
                    // ✅ שורת בדיקה: תדפיס כל נקודת מידע שהולכת לגרף
                    data={history.map((h) => {
                        const entry = {
                            date: new Date(h.date).toLocaleDateString("he-IL"),
                            bmi: Number(h.bmi),
                        };
                        
                        return entry;
                    })}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[10, 50]} />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#6c5ce7"
                        strokeWidth={2}
                        dot={{ r: 4 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </HistoryContainer>
    );
};

export default BMIHistory;

// This component fetches and displays the BMI history of a user in a line chart format.