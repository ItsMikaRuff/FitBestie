import { useUser } from "../context/UserContext";
import {
    DashboardContainer,
    ProfileButton,
    ProfileSection,
    ProfileTitle,
    Info,
    StyledLink,
} from "../components/styledComponents";

const Profile = () => {
    const { user, isLoggedIn } = useUser();

    if (!isLoggedIn) return <p>Unauthorized</p>;

    return (
        <DashboardContainer>
            <ProfileSection>
                <ProfileTitle>👤 פרטי משתמש</ProfileTitle>
                <Info>שם: {user?.name || "לא זמין"}</Info>
                <Info>אימייל: {user?.email || "לא זמין"}</Info>
            </ProfileSection>

            <ProfileSection>
                <ProfileTitle>🧮 מדדים אישיים</ProfileTitle>
                <Info>BMI: (בפיתוח)</Info>
                <Info>מבנה גוף: (בפיתוח)</Info>
                <Info>יעד אישי: (בפיתוח)</Info>
            </ProfileSection>

            <ProfileSection>
                <ProfileTitle>📝 שאלון התאמה אישית</ProfileTitle>
                <StyledLink to="/quiz"> מעבר לשאלון</StyledLink>
            </ProfileSection>

            <ProfileSection>
                <ProfileTitle>📦 תוכן מותאם</ProfileTitle>
                {user?.role === "trainer" ? (
                    <Info>תוכן ייעודי למאמנים (בהמשך)</Info>
                ) : (
                    <Info>המלצות ותוכן מותאם אישית למשתמש</Info>
                )}
            </ProfileSection>

            <ProfileSection>
                <ProfileTitle>🔧 עריכת פרטים</ProfileTitle>
                <ProfileButton disabled>בקרוב</ProfileButton>
            </ProfileSection>

            <StyledLink to="/">🔙 חזרה לדף הבית</StyledLink>
        </DashboardContainer>
    );
};

export default Profile;
