import React from "react";
import stretch from "../Images/stretch-laptop.jpg"; // ודא שהנתיב נכון
import {
        HomepageBackground,
    WelcomeText,
    AboutSection,
    AboutBox,
    AboutTitle,
    AboutText,
    Container,
} from "../components/styledComponents"; // ודא שהנתיב נכון

const Home = () => {
    return (
        <Container>
            <HomepageBackground style={{ backgroundImage: `url(${stretch})` }} />

            {console.log("API URL:", process.env.REACT_APP_API_URL)}
            
            <WelcomeText>Hi Bestie! What are you looking for today?</WelcomeText>
        
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
