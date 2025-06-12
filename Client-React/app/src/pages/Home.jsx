//home.jsx

import React, { useMemo, useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WeightHistory from "../components/WeightHistory";
import GymSearch from "../components/GymSearch";
import HomeBoxImage from "../Images/stretch-laptop.jpg";
import visionImage from "../Images/running.jpg";
import joinImage from "../Images/highFive.jpg";
// import fitBestieLogo from "../Images/FitBestieLogo.png";
import SmartChatBot from "../components/SmartChatBot";
import SmartRecipeChat from "../components/SmartRecipeChat";


const HomeContainer = styled.section`
  width: 100vw; /* דואג שהרוחב לא יעבור את המסך */
  box-sizing: border-box;
  width: 100%;
max-width: 100vw;
  min-width: 0;
  overflow-x: hidden;  /* מבטל גלילה לצדדים */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
  padding: 2rem;
  color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 600px) {
    padding: 0.5rem;
    margin-top: 20px;
  }
`;


const fadeInDown = keyframes`
  from { opacity: 0; transform: translateY(-30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HomeBox = styled.div`
  background: ${({ theme }) => theme.backgroundColors.primaryTransparent};
  padding: 2rem;
  border-radius: 16px;
  max-width: 700px;
  width: 100%;
  box-sizing: border-box;
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
  backdrop-filter: blur(4px);
  animation: ${fadeInDown} 1s ease forwards;

  @media (max-width: 399px) {
    max-width: 95vw;
    padding: 1rem;
  }
`;


const Section = styled.section`
  padding: 4rem 2rem;
  text-align: center;
  background-color: ${({ theme }) => theme.backgroundColors.primary};

  @media (max-width: 600px) {
    padding: 1.5rem 0.4rem;
  }
`;


const Img = styled.img`
  width: 100%;
  max-width: 600px;
  border-radius: 16px;
  margin: 2rem auto;
  display: block;

  @media (max-width: 600px) {
    max-width: 96vw;
  }
`;


const Button = styled.button`
  background-color: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  padding: 1rem 2rem;
  border-radius: 24px;
  font-size: 1.1rem;
  margin-top: 1rem;
  cursor: pointer;
  &:hover {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: white;
  }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
`;

const HighlightBox = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 1024px;
  margin: -5rem auto 3rem;
  margin-top:1rem;
  position: relative;
  animation: ${fadeInUp} 0.8s ease forwards;
`;

const MetricsGrid = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  gap: 2rem;
  margin-top: 2rem;
`;

const MetricBox = styled.div`
  flex: 1;
  min-width: 150px;
  text-align: center;
  background-color: ${({ color }) => color || '#fafafa'};
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
`;

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "בוקר טוב";
    if (hour < 18) return "צהריים טובים";
    return "ערב טוב";
};

const getBmiRecommendations = (category) => {
    const map = {
        "תת משקל": ["הוסיפי חטיפים עתירי קלוריות בין הארוחות.", "העדיפי אימוני כוח קלים להגברת מסת שריר."],
        "משקל תקין": ["שמרי על גיוון תזונתי והמשיכי בפעילות אירובית.", "שלבי גם יוגה או פילאטיס לאיזון גופני."],
        "עודף משקל": ["צמצמי צריכת פחמימות פשוטות.", "בצעי הליכות יומיות של 30 דק'."],
        "השמנה": ["שלבי פעילות אירובית בינונית 3 פעמים בשבוע.", "היוועצי עם דיאטנית לתפריט מאוזן."],
        "השמנה חולנית": ["יש לשקול ליווי רפואי מותאם.", "התחילי בתרגול קל בבית והימנעי ממאמץ יתר."],
    };
    return map[category] || ["שמרי על אורח חיים בריא ומאוזן."];
};

const getColorByBmi = (category) => {
    switch (category) {
        case "תת משקל": return "#ffeaa7";
        case "משקל תקין": return "#dfe6e9";
        case "עודף משקל": return "#fab1a0";
        case "השמנה": return "#ff7675";
        case "השמנה חולנית": return "#d63031";
        default: return "#fafafa";
    }
};

const Home = () => {

    const { isLoggedIn, user } = useUser();
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();
    const greeting = getGreeting();

    const [latestMeasurement, setLatestMeasurement] = useState(null);
    const [latestBodyType, setLatestBodyType] = useState(null);

    //const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {

        if (user?._id) {
            const fetchData = async () => {
                try {
                    const [measurementsRes, bodyTypeRes] = await Promise.all([
                        axios.get(`${process.env.REACT_APP_API_URL}/measurement/user/${user._id}`, { timeout: 10000 }),
                        axios.get(`${process.env.REACT_APP_API_URL}/bodyType/user/${user._id}`, { timeout: 10000 })
                    ]);

                    const sortedMeasurements = measurementsRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    const sortedBodyTypes = bodyTypeRes.data.sort((a, b) => new Date(b.date) - new Date(a.date));

                    setHistory(sortedMeasurements);
                    setLatestMeasurement(sortedMeasurements[0]);
                    setLatestBodyType(sortedBodyTypes[0]);

                } catch (err) {
                    if (err.code === 'ECONNABORTED') {
                        console.error("⏱ אחת הקריאות לשרת נמשכה יותר מדי זמן (timeout)");
                    } else {
                        console.error("❌ שגיאה בטעינת מדדים או מבנה גוף:", err);
                    }
                }
            };

            fetchData();
        }
    }, [user]);

    const bmi = latestMeasurement?.bmi;
    const category = latestMeasurement?.bmiCategory;
    const height = latestMeasurement?.height;
    const weight = latestMeasurement?.weight;
    const updatedDate = latestMeasurement?.date ? new Date(latestMeasurement.date).toLocaleDateString("he-IL") : null;
    const bmiTips = useMemo(() => getBmiRecommendations(category), [category]);
    const boxColor = getColorByBmi(category);

    

    return (
        <>
            <HomeContainer>
                <HomeBox>
                    <h1>{greeting}{user?.name ? ` ${user.name}` : ""}</h1>
                    <p>כאן תמצאי את הכלים לחיים בריאים, חזקים ומאושרים יותר.</p>
                    {!isLoggedIn && (
                        <Button onClick={() => navigate("/signup")}>הצטרפי עכשיו</Button>
                    )}


                </HomeBox>


                <Img src={HomeBoxImage} alt="religios stretch laptop" />


                {isLoggedIn && latestMeasurement && (
                    <HighlightBox>
                        <h2>✨ המדדים שלך</h2>
                        <MetricsGrid>
                            <MetricBox color={boxColor}><h3>BMI</h3><p>{bmi || "—"}</p></MetricBox>
                            <MetricBox><h3>קטגוריה</h3><p>{category || "—"}</p></MetricBox>
                            <MetricBox><h3>גובה</h3><p>{height ? `${height} ס"מ` : "—"}</p></MetricBox>
                            <MetricBox><h3>משקל</h3><p>{weight ? `${weight} ק"ג` : "—"}</p></MetricBox>
                            <MetricBox><h3>עודכן</h3><p>{updatedDate || "—"}</p></MetricBox>
                        </MetricsGrid>

                        <div style={{ textAlign: 'right', marginTop: '2rem' }}>
                            <h3>🍽 המלצות תזונה ואימון עבורך</h3>
                            <ul style={{ lineHeight: '1.8', paddingRight: '1rem' }}>
                                {bmiTips.map((tip, index) => (
                                    <li key={index}>{tip}</li>
                                ))}
                            </ul>
                        </div>

                        {latestBodyType && (
                            <div style={{ marginTop: '2rem', textAlign: 'right' }}>
                                <h3>💪 מבנה גוף</h3>
                                <p><strong>{latestBodyType.bodyType}</strong>: {latestBodyType.bodyTypeDescription}</p>
                            </div>
                        )}

                        <div style={{ marginTop: '3rem' }}>
                            <WeightHistory history={history} />
                            <Button onClick={() => navigate("/metrics")}>
                                ➕ הוספת שקילה חדשה
                            </Button>
                        </div>
                    </HighlightBox>
                )}
                <Section>
                    <h2>🏋️‍♀️ חדרי כושר בסביבתך</h2>
                    <p>מצאי מאמנות, סטודיו או חדר כושר קרוב שמתאים בדיוק לך</p>
                    <GymSearch />
                </Section>

                   {isLoggedIn &&
                    <Section>

                        <h2>תמצאי ארוחה לפי המצרכים שיש לך בבית!</h2>
                        <SmartRecipeChat />
                    </Section>
                }


                <Section>
                    <h2>החזון שלנו</h2>
                    <p>
                        העצמה נשית דרך כושר, תזונה ומיינדסט. FitBestie הוקמה עבור נשים ונערות
                        שמבקשות להשקיע בעצמן ולחיות בתנועה.
                    </p>
                    <Img src={visionImage} alt="החזון שלנו" />
                </Section>

                <Section>
                    <h2>{isLoggedIn ? "מה מחכה לך באתר" : "הצטרפי לקהילה שלנו"}</h2>
                    <p>
                        מצאי מאמנות כושר, סרטונים מותאמים אישית, וקהילה תומכת שמלווה אותך במסע.
                    </p>
                    <Img src={joinImage} alt={isLoggedIn ? "מה באתר" : "הצטרפי אלינו"} />
                    {!isLoggedIn && (
                        <Button onClick={() => navigate("/signup")}>להצטרפות</Button>
                    )}
                </Section>

            </HomeContainer>

        {/* <SmartChatBot/> */}
        {isLoggedIn && <SmartChatBot />}

        </>
    );
};

export default Home;