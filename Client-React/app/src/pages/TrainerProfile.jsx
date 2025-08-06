//TrainerProfile.jsx

import { useUser } from "../context/UserContext";
import { useState, useRef } from "react";
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
    TrainerStatus,
    ContactAdminButton,
} from "../components/styledComponents";
import Loader from "../components/Loader";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import AddressInput from '../components/AddressInput';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const FormInput = styled.input`
    width: 100%;
    padding: 12px;
    margin: 8px 0;
    border: 1px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
    transition: border-color 0.3s ease;
    text-align: right;

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
    text-align: right;
`;

const ExpertiseGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 10px;
    margin: 10px 0;
    direction: rtl;
    
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
    text-align: right;
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
    const { user, updateUser, isLoggedIn, logout, setUser, token } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const editFormRef = useRef(null);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        image: null,
        expertise: user?.expertise || [],
        phone: user?.phone || "",
        whatsapp: user?.whatsapp || "",
        instagram: user?.instagram || "",
        experienceYears: user?.experienceYears || 0,
        previousGyms: user?.previousGyms || [""],
        address: user?.address || {
            street: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            coordinates: {
                lat: null,
                lng: null
            }
        }
    });


    // בדיקה אם אובייקט הכתובת ריק
    const isAddressEmpty = (addr) =>
        !addr ||
        Object.values(addr).every(
            v =>
                (typeof v === "string" && v.trim() === "") ||
                (typeof v === "object" && v !== null && Object.values(v).every(z => z === null || z === ""))
        );


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
        data.append("expertise", JSON.stringify(formData.expertise));
        data.append("phone", formData.phone);
        data.append("whatsapp", formData.whatsapp);
        data.append("instagram", formData.instagram);
        data.append("experienceYears", formData.experienceYears);
        data.append("previousGyms", JSON.stringify(formData.previousGyms));


        // שינוי כאן!
        if (!isAddressEmpty(formData.address)) {
            data.append("address", JSON.stringify(formData.address));
        }
        // אחרת - לא שולחים את address בכלל

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
            Authorization: `Bearer ${token}`, // מוסיף את הטוקן
        },
        withCredentials: true,
    }
);

// עדכון המשתמש ישירות מהשרת
updateUser({}); // קריאה ריקה שלא תשלח שוב לשרת
setUser(res.data); // 👈 תוודאי שזה זמין מהקונטקסט. אם לא - נעשה עדכון לקונטקסט
alert("עודכן בהצלחה 🎉");
setIsEditing(false);

        } catch (error) {
            console.error("Axios error:", error);
            alert("שגיאה בעדכון הפרופיל");
        } finally {
            setLoading(false);
        }

        window.location.reload();
    };


    const handleDeleteProfile = async () => {
        if (!showDeleteConfirmation) {
            setShowDeleteConfirmation(true);
            return;
        }

        if (!deleteConfirmed) {
            alert("אנא אשר את מחיקת הפרופיל");
            return;
        }

        if (!window.confirm("האם אתה בטוח שברצונך למחוק את הפרופיל? פעולה זו אינה ניתנת לביטול.")) {
            return;
        }

        try {
            setLoading(true);
            const userId = user?._id || user?.id;

            const res = await axios.delete(
                `${API_URL}/user/${userId}`,
                {
                    withCredentials: true,
                }
            );

            if (res.data.message === "User deleted successfully") {
                logout();
                navigate("/");
                alert("הפרופיל נמחק בהצלחה");
            } else {
                throw new Error("Failed to delete profile");
            }
        } catch (error) {
            console.error("Error deleting profile:", error);
            alert("שגיאה במחיקת הפרופיל");
        } finally {
            setLoading(false);
        }
    };

    const handleEditClick = () => {
        setIsEditing(true);
        // Add a small delay to ensure the form is rendered before scrolling
        setTimeout(() => {
            editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    };

    if (!isLoggedIn || user?.role !== "trainer") return <p>Unauthorized</p>;

    return (

        <TrainerDashboardContainer style={{ direction: 'rtl' }}>

            <TrainerStatus status={user.trainerStatus}>
                {user.trainerStatus === 'approved' && 'החשבון שלך מאושר'}
                {user.trainerStatus === 'pending' && 'החשבון שלך ממתין לאישור מנהל'}
                {user.trainerStatus === 'rejected' && (
                    <>
                        הבקשה שלך נדחתה. ניתן ליצור קשר עם מנהל המערכת.
                        <ContactAdminButton onClick={() => window.location.href = "mailto:support@fitbestie.com"}>
                            פנה למנהל
                        </ContactAdminButton>
                    </>
                )}
            </TrainerStatus>

            <TrainerHeader>
                <TrainerImage
                    src={user?.image || "https://placehold.co/150x150"}
                    alt="תמונת פרופיל"
                />
                <TrainerInfo>
                    <TrainerName>{user?.name || "שם לא זמין"}</TrainerName>
                    <TrainerTitle>פרופיל מאמנת כושר</TrainerTitle>
                    <div>
                        <EnhancedInfo>אימייל: {user?.email || "לא זמין"}</EnhancedInfo>
                        <EnhancedInfo>כתובת: {user?.address?.street ? `${user.address.street}, ${user.address.city}` : "לא זמין"}</EnhancedInfo>
                        <EnhancedInfo>טלפון: {user?.phone || "לא זמין"}</EnhancedInfo>
                        <EnhancedInfo>תחומי התמחות: {user?.expertise?.join(', ') || "לא זמין"}</EnhancedInfo>
                        <EnhancedInfo>שנות ניסיון: {user?.experienceYears || 0}</EnhancedInfo>
                        <EnhancedInfo>
                            מקומות עבודה קודמים:
                            <ul>
                                {user?.previousGyms?.length > 0 && (
                                    <div>
                                        <ul>
                                            {user.previousGyms.map((gym, idx) => (
                                                <li key={idx}>{gym}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </ul>
                        </EnhancedInfo>

                        <EnhancedInfo>WhatsApp: {user?.whatsapp || "לא זמין"}</EnhancedInfo>
                        <EnhancedInfo>Instagram: {user?.instagram || "לא זמין"}</EnhancedInfo>
                    </div>
                    <ProfileButton onClick={handleEditClick}>
                        עריכת פרטים
                    </ProfileButton>
                </TrainerInfo>
            </TrainerHeader>

            <TrainerGrid>
                {isEditing && (
                    <EnhancedProfileSection ref={editFormRef}>
                        <EnhancedProfileTitle>עריכת פרטים</EnhancedProfileTitle>
                        <form onSubmit={handleSubmit} style={{ textAlign: 'right' }}>
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
                                <FormLabel>טלפון</FormLabel>
                                <FormInput
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+972"
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>WhatsApp</FormLabel>
                                <FormInput
                                    type="tel"
                                    name="whatsapp"
                                    value={formData.whatsapp}
                                    onChange={handleChange}
                                    placeholder="+972"
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>Instagram</FormLabel>
                                <FormInput
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleChange}
                                    placeholder="@username"
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>כתובת</FormLabel>
                                <AddressInput
                                    value={formData.address}
                                    onChange={(address) => setFormData(prev => ({ ...prev, address }))}
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>שנות ניסיון</FormLabel>
                                <FormInput
                                    type="number"
                                    name="experienceYears"
                                    value={formData.experienceYears}
                                    onChange={handleChange}
                                    min="0"
                                />
                            </FormGroup>

                            <FormGroup>
                                <FormLabel>מקומות עבודה קודמים</FormLabel>
                                {formData.previousGyms.map((gym, idx) => (
                                    <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "8px" }}>
                                        <FormInput
                                            type="text"
                                            value={gym}
                                            onChange={(e) => {
                                                const newGyms = [...formData.previousGyms];
                                                newGyms[idx] = e.target.value;
                                                setFormData(prev => ({ ...prev, previousGyms: newGyms }));
                                            }}
                                            placeholder={`מקום עבודה ${idx + 1}`}
                                            style={{ flexGrow: 1 }}
                                        />
                                        {formData.previousGyms.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const filteredGyms = formData.previousGyms.filter((_, i) => i !== idx);
                                                    setFormData(prev => ({ ...prev, previousGyms: filteredGyms }));
                                                }}
                                                style={{
                                                    backgroundColor: "#ff6b6b",
                                                    color: "white",
                                                    border: "none",
                                                    borderRadius: "5px",
                                                    padding: "6px 10px",
                                                    cursor: "pointer",
                                                }}
                                                title="מחק מקום עבודה"
                                            >
                                                🗑
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({
                                        ...prev,
                                        previousGyms: [...prev.previousGyms, ""]
                                    }))}
                                    style={{
                                        marginTop: "10px",
                                        backgroundColor: "#6c5ce7",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                >
                                    ➕ הוסף מקום עבודה
                                </button>
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

                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                                <ProfileButton type="submit">שמור שינויים</ProfileButton>
                                <ProfileButton type="button" onClick={() => setIsEditing(false)}>
                                    ביטול
                                </ProfileButton>
                            </div>
                            {loading && <Loader />}
                        </form>
                    </EnhancedProfileSection>
                )}

                <EnhancedProfileSection>
                    <EnhancedProfileTitle>💪 תחומי התמחות</EnhancedProfileTitle>
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
                </EnhancedProfileSection>

                <EnhancedProfileSection>
                    <EnhancedProfileTitle>⚠️ מחיקת פרופיל</EnhancedProfileTitle>
                    <div style={{ textAlign: 'right' }}>
                        <p>שים לב: מחיקת הפרופיל היא פעולה בלתי הפיכה. כל הנתונים שלך יימחקו לצמיתות.</p>
                        {showDeleteConfirmation && (
                            <div style={{ marginTop: '10px' }}>
                                <label style={{ display: 'block', marginBottom: '10px' }}>
                                    <input
                                        type="checkbox"
                                        checked={deleteConfirmed}
                                        onChange={(e) => setDeleteConfirmed(e.target.checked)}
                                    />
                                    אני מבין/ה שפעולה זו אינה ניתנת לביטול
                                </label>
                            </div>
                        )}
                        <button
                            onClick={handleDeleteProfile}
                            disabled={loading || (showDeleteConfirmation && !deleteConfirmed)}
                            style={{
                                backgroundColor: '#dc3545',
                                color: 'white',
                                padding: '0.8rem 1.5rem',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: loading || (showDeleteConfirmation && !deleteConfirmed) ? 'not-allowed' : 'pointer',
                                width: '100%',
                                fontSize: '1rem',
                                transition: 'background-color 0.3s ease',
                                opacity: loading || (showDeleteConfirmation && !deleteConfirmed) ? 0.7 : 1,
                                marginTop: '1rem'
                            }}
                            onMouseOver={(e) => !loading && (!showDeleteConfirmation || deleteConfirmed) && (e.target.style.backgroundColor = '#c82333')}
                            onMouseOut={(e) => !loading && (!showDeleteConfirmation || deleteConfirmed) && (e.target.style.backgroundColor = '#dc3545')}
                        >
                            {loading ? 'מוחק...' : showDeleteConfirmation ? 'אשר מחיקה' : 'מחק פרופיל'}
                        </button>
                    </div>
                </EnhancedProfileSection>
            </TrainerGrid>

            <StyledLink to="/">🔙 חזרה לדף הבית</StyledLink>
        </TrainerDashboardContainer>
    );
};

export default TrainerProfile; 