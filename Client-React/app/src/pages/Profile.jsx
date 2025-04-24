import { useUser } from "../context/UserContext";
import { useState } from "react";
import {
    DashboardContainer,
    ProfileButton,
    ProfileSection,
    ProfileTitle,
    Info,
    StyledLink,
} from "../components/styledComponents";
import Loader from "../components/Loader";
import axios from "axios";

const Profile = () => {

    const { user, setUser, isLoggedIn } = useUser();

    const [loading, setLoading] = useState(false); // State to manage loading status
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({

        name: user?.name || "",
        email: user?.email || "",
        image: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        if (formData.image) {
            data.append("image", formData.image);
        }
    
        try {
            setLoading(true);
            const userId = user?._id || user?.id;
    
            const res = await axios.post(
                `${process.env.REACT_APP_API_URL}/user/update/${userId}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
    
            console.log("User updated successfully", res.data);
            setUser(res.data);
            alert("עודכן בהצלחה 🎉");
            setIsEditing(false);
    
        } catch (error) {
            console.error("Axios error:", error);
            alert("שגיאה בעדכון הפרופיל");
        } finally {
            setLoading(false);
        }
    };


    if (!isLoggedIn) return <p>Unauthorized</p>;

    return (
        <DashboardContainer>
            {user?.image && (
                <img
                    src={`${process.env.REACT_APP_API_URL}/uploads/${user.image}`}
                    alt="תמונת פרופיל"
                    style={{ width: "120px", borderRadius: "50%", marginTop: "1rem" }}
                />
            )}
            <ProfileSection>
                <ProfileTitle>👤 פרטי משתמש</ProfileTitle>

                {isEditing ? (
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="שם מלא"
                        />
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="אימייל"
                        />
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <ProfileButton type="submit">שמור</ProfileButton>
                        {
                            loading ? (
                                <Loader />
                            ) : null
                        }
                    </form>
                ) : (
                    <>
                        <Info>שם: {user?.name || "לא זמין"}</Info>
                        <Info>אימייל: {user?.email || "לא זמין"}</Info>
                    </>
                )}

                <ProfileButton onClick={() => setIsEditing((prev) => !prev)}>
                    {isEditing ? "ביטול" : "עריכת פרטים"}
                </ProfileButton>
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
