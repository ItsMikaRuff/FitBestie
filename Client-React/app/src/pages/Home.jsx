import React from "react";
import { useUser } from "../context/UserContext";
import {
    HomepageBackground,
    AboutSection,
    AboutBox,
    AboutTitle,
    AboutText,
    Container,
} from "../components/styledComponents";
import { DashboardCard, CardsContainer } from "../components/DashboardCard";
import stretch from "../Images/stretch-laptop.jpg";

const Home = () => {
    const { isLoggedIn } = useUser();

    return (
        <Container>
            <HomepageBackground style={{ backgroundImage: `url(${stretch})` }} />
            
            <CardsContainer>
                {isLoggedIn ? (
                    <>
                        <DashboardCard 
                            title="המדדים שלי"
                            description="צפי במדדים שלך, כולל BMI, סוג גוף, ומעקב אחר התקדמותך."
                            buttonText="צפי במדדים"
                            buttonLink="/profile"
                        />

                        <DashboardCard 
                            title="חפש מאמן כושר"
                            description="מצאי מאמן כושר אישי שיתאים בדיוק לצרכים שלך."
                            buttonText="חפשי מאמן"
                            buttonLink="/search?type=trainer"
                        />

                        <DashboardCard 
                            title="חפש סטודיו"
                            description="מצאי סטודיו כושר קרוב לביתך עם המאמנים הטובים ביותר."
                            buttonText="חפשי סטודיו"
                            buttonLink="/search?type=studio"
                        />
                    </>
                ) : (
                    <>
                        <DashboardCard 
                            title="גלי את סוג הגוף שלך"
                            description="עני על מספר שאלות פשוטות וגלי את סוג הגוף שלך כדי להתאים את התוכנית המושלמת עבורך."
                            buttonText="התחל עכשיו"
                            buttonLink="/signup"
                        />

                        <DashboardCard 
                            title="חפשי סטודיו או מאמנת אישית בקרבתך"
                            description="מצאי מאמן כושר אישי שיתאים בדיוק לצרכים שלך."
                            buttonText="לחיפוש"
                            buttonLink="/search?type=trainer"
                        />
                    </>
                )}
            </CardsContainer>

            <AboutSection>
                <AboutBox>
                    <AboutTitle>About us</AboutTitle>
                    <AboutText>
                        FIT-BESTIE הוא המקום שבו כושר ותזונה נפגשים כדי ליצור אורח חיים
                        בריא. האתר מציע תרגילים, מתכונים וטיפים שנבנו במיוחד עבורך,
                        מתוך שאיפה להעצים נשים ונערות לחיות את החיים במיטבן.
                        הצטרפי לקהילה שלנו ותתחילי את המסע שלך לבריאות ואושר.
                    </AboutText>
                </AboutBox>
            </AboutSection>
        </Container>
    );
};

export default Home;
