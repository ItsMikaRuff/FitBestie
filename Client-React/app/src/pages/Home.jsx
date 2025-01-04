import React from "react";
import "./Home.css"; // חיבור לדף CSS
import stretch from "../Images/stretch-laptop.jpg"; // ודא שהנתיב נכון

const Home = () => {
    return (
        <div className="homepage-container">
            {/* רקע התמונה */}
            <div
                className="homepage-background"
                style={{ backgroundImage: `url(${stretch})` }}
            ></div>

            {/* תוכן דף הבית */}
            <div className="homepage-content">
                {/* כותרת */}
                <h1 className="homepage-title">FIT-BESTIE</h1>

                {/* כפתורים מתחת לכותרת */}
                <div className="homepage-buttons">
                    <button className="homepage-button button-login">כניסה</button>
                    <button className="homepage-button button-signup">הרשמה</button>
                </div>
            </div>

            {/* עלינו*/}
            <div className="about-section">
                <div className="about-box">
                    <h2 className="about-title">About us</h2>
                    <p className="about-text">
                        FIT-BESTIE הוא המקום שבו כושר ותזונה נפגשים כדי ליצור אורח חיים
                        בריא. האתר מציע תרגילים, מתכונים וטיפים שנבנו במיוחד עבורך,
                        מתוך שאיפה להעצים נשים ונערות לחיות את החיים במיטבן.
                        הצטרפי לקהילה שלנו ותתחילי את המסע שלך לבריאות ואושר.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;
