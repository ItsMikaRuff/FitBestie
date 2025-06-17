//UserProfile.jsx

import { useUser } from "../context/UserContext";
import { useState, useRef } from "react";
import {
    DashboardContainer,
    ProfileButton,
    ProfileSection,
    ProfileTitle,
    // Info,
    StyledLink,
    TrainerHeader,
    TrainerImage,
    TrainerInfo,
    TrainerName,
    TrainerTitle,
    EnhancedInfo,
} from "../components/styledComponents";
import Loader from "../components/Loader";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AddressInput from '../components/AddressInput';
import styled from 'styled-components';

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

const FormGroup = styled.div`
    margin-bottom: 15px;
    text-align: right;
`;

const CheckboxLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    font-weight: 500;
`;

const UserProfile = () => {
    const { user, updateUser, isLoggedIn, logout } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [deleteConfirmed, setDeleteConfirmed] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [twoFA, setTwoFA] = useState(user?.twoFactorEnabled || false);

    const editFormRef = useRef(null);
    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        image: null,
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

    const toggle2FA = async () => {
        try {
            const res = await axios.put(`${process.env.REACT_APP_API_URL}/user/${user._id}/2fa`, {
                enabled: !twoFA
            });
            setTwoFA(res.data.twoFactorEnabled);
        } catch (err) {
            console.error("שגיאה בהפעלת 2FA", err);
        }
    };

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
        data.append("address", JSON.stringify(formData.address));
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
    setFormData({
        name: user?.name || "",
        email: user?.email || "",
        image: null,
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
    setIsEditing(true);
    setTimeout(() => {
        editFormRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
};

    const getRoleLabel = (role) => {
        switch (role) {
            case 'admin': return 'Administrator';
            case 'manager': return 'מנהלת FitBestie';
            case 'superAdmin': return 'סופר־אדמין';
            case 'worker': return 'עובדת FitBestie';
            case 'trainer': return 'מאמנת כושר';
            case 'user': return ' מתאמנת';
            default: return '';
        }
    };

    if (!isLoggedIn) return <p>Unauthorized</p>;

    return (
        <DashboardContainer>
            <TrainerHeader>
                <TrainerImage
                    src={user?.image || "https://placehold.co/150x150"}
                    alt="תמונת פרופיל"
                />

                <TrainerInfo>
                    <TrainerName>{user?.name || "הפרופיל שלי"}</TrainerName>
                    <TrainerTitle>
                        פרופיל {getRoleLabel(user?.role)}
                    </TrainerTitle>
                    <div>
                        <EnhancedInfo>אימייל: {user?.email || "לא זמין"}</EnhancedInfo>
                        <EnhancedInfo>כתובת: {user?.address?.street ? `${user.address.street}, ${user.address.city}` : "לא זמין"}</EnhancedInfo>
                    </div>
                    <ProfileButton onClick={handleEditClick}>
                        עריכת פרטים
                    </ProfileButton>
                </TrainerInfo>
            </TrainerHeader>

            {isEditing && (
                <ProfileSection ref={editFormRef}>
                    <ProfileTitle>עריכת פרטים</ProfileTitle>
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
                            <FormLabel>כתובת</FormLabel>
                            <AddressInput
                                value={formData.address}
                                onChange={(address) => setFormData(prev => ({ ...prev, address }))}
                            />
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

                        <CheckboxLabel>
                            <input type="checkbox" checked={twoFA} onChange={toggle2FA} />
                            הפעל אימות דו־שלבי
                        </CheckboxLabel>

                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                            <ProfileButton type="submit">שמור שינויים</ProfileButton>
                            <ProfileButton type="button" onClick={() => setIsEditing(false)}>
                                ביטול
                            </ProfileButton>
                        </div>
                        {loading && <Loader />}
                    </form>
                </ProfileSection>
            )}

            {/* <ProfileSection>
                <ProfileTitle>🧮 מדדים אישיים</ProfileTitle>
                <StyledLink to="/metrics">מעבר לעמוד המדדים</StyledLink>
            </ProfileSection> */}

            {/* <ProfileSection>
                <ProfileTitle>📝 שאלון התאמה אישית</ProfileTitle>
                <StyledLink to="/quiz">מעבר לשאלון</StyledLink>
            </ProfileSection> */}

            {/* <ProfileSection>
                <ProfileTitle>📦 תוכן מותאם</ProfileTitle>
                {user?.role === "trainer" ? (
                    <Info>תוכן ייעודי למאמנים (בהמשך)</Info>
                ) : (
                    <Info>המלצות ותוכן מותאם אישית למשתמש</Info>
                )}
            </ProfileSection> */}

            <ProfileSection>
                <ProfileTitle>⚠️ מחיקת פרופיל</ProfileTitle>
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
            </ProfileSection>

            <StyledLink to="/">🔙 חזרה לדף הבית</StyledLink>
            <StyledLink to="/logout" onClick={logout}>🔒 התנתקות</StyledLink>

        </DashboardContainer>
    );
};

export default UserProfile;
