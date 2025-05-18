// UserMetrics.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useUser } from "../context/UserContext";
import axios from "axios";
import styled from "styled-components";
import BMICalculator from "../components/BMICalculator";
import BodyTypeCalculator from "../components/BodyTypeCalculator";
import BMIHistory from "../components/BMIHistory";
import WeightHistory from "../components/WeightHistory";
import { DashboardContainer, ProfileButton } from "../components/styledComponents";

const SummaryContainer = styled.div`
    background: #f1f3f5;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    direction: rtl;
    text-align: right;
`;

const HighlightText = styled.strong`
    color: #6c5ce7;
    font-weight: bold;
`;

const MetricsInfo = styled.div`
    background: #ffffff;
    padding: 1.5rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    direction: rtl;
    text-align: right;
`;

const CalculatorsWrapper = styled.div`
    direction: rtl;
    text-align: right;
`;

const CalculatorsTitle = styled.h2`
    font-size: 1.4rem;
    color: #6c5ce7;
    margin-bottom: 1rem;
    scroll-margin-top: 80px;
`;

const UserMetrics = () => {
    const { user } = useUser();
    const [history, setHistory] = useState([]);
    const [latestMeasurement, setLatestMeasurement] = useState(null);
    const [latestBodyType, setLatestBodyType] = useState(null);
    const calculatorsRef = useRef(null);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [measurementsRes, bodyTypeRes] = await Promise.all([
                    axios.get(`${process.env.REACT_APP_API_URL}/measurement/user/${user._id}`, { withCredentials: true }),
                    axios.get(`${process.env.REACT_APP_API_URL}/bodyType/user/${user._id}`, { withCredentials: true })
                ]);

                const sortedMeasurements = measurementsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                const sortedBodyTypes = bodyTypeRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));

                setHistory(sortedMeasurements);
                setLatestMeasurement(sortedMeasurements[0]);
                setLatestBodyType(sortedBodyTypes[0]);

            } catch (err) {
                console.error("שגיאה בטעינת מדדים או מבנה גוף", err);
            }
        };

        if (user?._id) fetchMetrics();
    }, [user]);

    return (
        <DashboardContainer>
            {latestBodyType ? (
                <SummaryContainer>
                    <h2>
                        מבנה הגוף שלך בהתאם למדדים הוא: <HighlightText>{latestBodyType.bodyType}</HighlightText>
                    </h2>
                    <p>{latestBodyType.bodyTypeDescription}</p>
                </SummaryContainer>
            ) : (
                <SummaryContainer>
                    <h2>עדיין לא הזנת מדדים</h2>
                    <p>מלאי את מחשבון ה־BMI ומבנה הגוף למטה כדי לראות את מבנה גופך האישי</p>
                </SummaryContainer>
            )}

            {latestMeasurement && (
                <MetricsInfo>
                    <h3>📏 מדדים אחרונים:</h3>
                    <p><strong>גובה:</strong> {latestMeasurement.height} ס&quot;מ</p>
                    <p><strong>משקל:</strong> {latestMeasurement.weight} ק&quot;ג</p>
                    <p><strong>BMI:</strong> <span dir="ltr">{latestMeasurement.bmi}</span> ({latestMeasurement.bmiCategory})</p>
                    <p><strong>עודכן בתאריך:</strong> {new Date(latestMeasurement.date).toLocaleDateString('he-IL')}</p>
                    <ProfileButton style={{ marginTop: '1rem' }} onClick={() => calculatorsRef.current?.scrollIntoView({ behavior: 'smooth' })}>
                        ✍️ עדכן מדדים / הוסף שקילה
                    </ProfileButton>
                </MetricsInfo>
            )}

            {latestMeasurement && (
                <>
                    <BMIHistory user={user} />
                    <WeightHistory history={history} />
                </>
            )}

            <CalculatorsWrapper ref={calculatorsRef}>
                <CalculatorsTitle>✍️ עדכון מדדים</CalculatorsTitle>
                <BMICalculator />
                <BodyTypeCalculator />
            </CalculatorsWrapper>
        </DashboardContainer>
    );
};

export default UserMetrics;
