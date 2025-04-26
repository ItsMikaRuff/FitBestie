import { useUser } from "../context/UserContext";
import { useState } from "react";
import {
    TrainerDashboardContainer,
    TrainerHeader,
    TrainerImage,
    TrainerInfo,
    TrainerName,
    TrainerTitle,
    TrainerGrid,
    EnhancedProfileSection,
    EnhancedProfileTitle,
    EnhancedInfo,
    ProfileButton,
    StyledLink,
} from "../components/styledComponents";
import Loader from "../components/Loader";
import axios from "axios";
import styled from "styled-components";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FormInput = styled.input`
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;

    &:focus {
        outline: none;
        border-color: #6c5ce7;
    }
`;

const FormLabel = styled.label`
    display: block;
    margin: 10px 0 5px;
    font-weight: 500;
    color: #333;
`;

const ExpertiseGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin: 10px 0;
`;

const ExpertiseOption = styled.label`
    display: flex;
    align-items: center;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s ease;
    direction: rtl;
    color: #333;
    font-size: 16px;
    margin: 4px 0;

    &:hover {
        background-color: #f5f5f5;
    }

    input[type="checkbox"] {
        margin-right: 8px;
        margin-left: 0;
        width: 16px;
        height: 16px;
    }
`;

const FormGroup = styled.div`
    margin-bottom: 15px;
`;

const expertiseOptions = [
    "אימון כוח",
    "אימון פונקציונלי",
    "אימון אירובי",
    "יוגה",
    "פילאטיס",
    "אימון HIIT",
    "אימון TRX",
    "אימון קיקבוקס",
    "אימון גמישות",
    "אימון שיקומי",
    "אימון נשים",
    "אימון גברים",
    "אימון נוער",
    "אימון מבוגרים"
];

const TrainerProfile = () => {
    const { user, updateUser, isLoggedIn } = useUser();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        image: null,
        expertise: user?.expertise || [],
        location: user?.location || "",
        phone: user?.phone || "",
        whatsapp: user?.whatsapp || "",
        instagram: user?.instagram || "",
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "image") {
            setFormData((prev) => ({ ...prev, image: files[0] }));
        } else if (name === "phone" || name === "whatsapp") {
            // Allow only numbers and + for phone numbers
            const cleanedValue = value.replace(/[^\d+]/g, '');
            setFormData((prev) => ({ ...prev, [name]: cleanedValue }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleExpertiseChange = async (expertise) => {
        const newExpertise = formData.expertise.includes(expertise)
            ? formData.expertise.filter(item => item !== expertise)
            : [...formData.expertise, expertise];
            
        setFormData(prev => ({
            ...prev,
            expertise: newExpertise
        }));

        // Save changes immediately
        try {
            setLoading(true);
            const data = new FormData();
            data.append("expertise", JSON.stringify(newExpertise));
            
            const userId = user?._id || user?.id;
            const res = await axios.post(
                `${API_URL}/user/update/${userId}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            updateUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
        } catch (error) {
            console.error("Error updating expertise:", error);
            alert("שגיאה בעדכון תחומי ההתמחות");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append("name", formData.name);
        data.append("email", formData.email);
        data.append("location", formData.location);
        data.append("expertise", JSON.stringify(formData.expertise));
        data.append("phone", formData.phone);
        data.append("whatsapp", formData.whatsapp);
        data.append("instagram", formData.instagram);
        if (formData.image) {
            data.append("image", formData.image);
        }

        try {
            setLoading(true);
            const userId = user?._id || user?.id;

            const res = await axios.post(
                `${API_URL}/user/update/${userId}`,
                data,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                    withCredentials: true,
                }
            );

            updateUser(res.data);
            localStorage.setItem("user", JSON.stringify(res.data));
            alert("עודכן בהצלחה 🎉");
            setIsEditing(false);

        } catch (error) {
            console.error("Axios error:", error);
            alert("שגיאה בעדכון הפרופיל");
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn || user?.role !== "trainer") return <p>Unauthorized</p>;

    return (
        <TrainerDashboardContainer>
            <TrainerHeader>
                <TrainerImage
                    src={user?.image || "https://via.placeholder.com/150"}
                    alt="תמונת פרופיל"
                />
                <TrainerInfo>
                    <TrainerName>{user?.name || "מאמנת"}</TrainerName>
                    <TrainerTitle>מאמנת כושר </TrainerTitle>
                    <EnhancedInfo>מיקום: {user?.location || "לא זמין"}</EnhancedInfo>
                    <EnhancedInfo>תחומי התמחות: {user?.expertise?.join(', ') || "לא זמין"}</EnhancedInfo>
                </TrainerInfo>
            </TrainerHeader>

            <TrainerGrid>
                <EnhancedProfileSection>
                    <EnhancedProfileTitle>👤 פרטי מאמן</EnhancedProfileTitle>
                    {isEditing ? (
                        <form onSubmit={handleSubmit}>
                            <FormGroup>
                                <FormLabel>שם מלא</FormLabel>
                                <FormInput
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>אימייל</FormLabel>
                                <FormInput
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>מיקום (עיר/אזור)</FormLabel>
                                <FormInput
                                    type="text"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    required
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>מספר טלפון</FormLabel>
                                <FormInput
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="05XXXXXXXX"
                                />
                            </FormGroup>

                        
                            <FormGroup>
                                <FormLabel>חשבון Instagram מקצועי</FormLabel>
                                <FormInput
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="@username"
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>תחומי התמחות</FormLabel>
                                <ExpertiseGrid>
                                    {expertiseOptions.map((expertise) => (
                                        <ExpertiseOption key={expertise}>
                                            <input
                                                type="checkbox"
                                                checked={formData.expertise.includes(expertise)}
                                                onChange={() => handleExpertiseChange(expertise)}
                                            />
                                            {expertise}
                                        </ExpertiseOption>
                                    ))}
                                </ExpertiseGrid>
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>תמונת פרופיל</FormLabel>
                                <FormInput
                                    type="file"
                                    name="image"
                                    accept="image/*"
                                    onChange={handleChange}
                                />
                            </FormGroup>

                            <ProfileButton type="submit">שמור שינויים</ProfileButton>
                            <ProfileButton type="button" onClick={() => setIsEditing(false)}>
                                ביטול
                            </ProfileButton>
                            {loading && <Loader />}
                        </form>
                    ) : (
                        <>
                            <EnhancedInfo>שם: {user?.name || "לא זמין"}</EnhancedInfo>
                            <EnhancedInfo>אימייל: {user?.email || "לא זמין"}</EnhancedInfo>
                            <EnhancedInfo>טלפון: {user?.phone || "לא זמין"}</EnhancedInfo>
                            <EnhancedInfo>Instagram: {user?.instagram || "לא זמין"}</EnhancedInfo>
                            <ProfileButton onClick={() => setIsEditing(true)}>
                                עריכת פרטים
                            </ProfileButton>
                        </>
                    )}
                </EnhancedProfileSection>

                

               

                
            </TrainerGrid>

            
            <StyledLink to="/">🔙 חזרה לדף הבית</StyledLink>
            
           
        </TrainerDashboardContainer>
    );
};

export default TrainerProfile; 