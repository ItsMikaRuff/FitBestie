import React from "react";
import stretch from "../Images/stretch-laptop.jpg"; // ודא שהנתיב נכון
import {
    HomepageContainer,
    HomepageBackground,
    HomepageContent,
    WelcomeText,
    AboutSection,
    AboutBox,
    AboutTitle,
    AboutText
} from "../components/styledComponents"; // ודא שהנתיב נכון


const Home = () => {
    return (
        <HomepageContainer>
            <HomepageBackground style={{ backgroundImage: `url(${stretch})` }} />
            <HomepageContent>
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
            </HomepageContent>
        </HomepageContainer>
    );
};

export default Home;
