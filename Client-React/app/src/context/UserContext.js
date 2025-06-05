// userContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false); // נשתמש כדי לגלות מתי כבר ניסינו לטעון

    isInitialized;


    /**
     * useEffect לטעינה אוטומטית של המשתמש מ-localStorage
     */

    useEffect(() => {

        const savedToken = localStorage.getItem("token");
        const savedUserId = localStorage.getItem("userId");

        if (savedToken && savedUserId) {

            axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;

            setToken(savedToken);
            setIsLoggedIn(true);

            axios.get(`${API_URL}/user/${savedUserId}`, {
                headers: { Authorization: `Bearer ${savedToken}` }
            })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.warn('❌ Auto-login failed (token פג תוקף למשל):', err);
                    // אם השאילתא נכשלה, מוציאים את כל הפרטים ומדלגים לסיום
                    logout();
                }).finally(() => {
                    // אין
                    //  token 
                    // שמור 
                    // – פשוט מסמנים שטעינת ה־
                    // Context
                    //  הסתיימה
                    setIsInitialized(true);
                });
        } else {
            console.info("🔄 No saved token or userId found, user not logged in.");
            setIsInitialized(true); // סיימנו לטעון גם אם לא היה משתמש
        }
    }, []);

    /**
 * login: שמירת token וטעינת פרטי המשתמש מהשרת
 */

    const login = (data) => {

        const userData = data.user || data;
        const jwt = data.token || null;

        setToken(jwt);
        setIsLoggedIn(true);
        localStorage.setItem("token", jwt);
        localStorage.setItem("userId", userData._id);

        if (userData?._id && jwt) {
            axios.get(`${API_URL}/user/${userData._id}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
                .then((res) => {
                    setUser(res.data);

                    // שומרים ב־localStorage
                    localStorage.setItem("token", jwt);
                    localStorage.setItem("userId", userData._id);

                })
                .catch((err) => {
                    console.error("❌ Error loading user:", err);
                    logout();
                });
        } else {
            console.warn("⚠️ Missing _id or token");
        }


    };



    /**
     * logout: ניקוי הכל
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        delete axios.defaults.headers.common['Authorization'];
        console.info("🚪 Logged out");
    };

    /**
     * updateUser: עדכון פרטי המשתמש בשרת והסטייט (תומך גם בקבצים)
     */

    const updateUser = async (updatedFields) => {

        if (!user || !token) return;

        let formData;
        let isMultipart = false;

        // אם יש תמונה לעדכן (file/image) — השתמשי ב-FormData
        if (updatedFields.image || updatedFields.file) {
            formData = new FormData();
            for (let key in updatedFields) {
                formData.append(key, updatedFields[key]);
            }
            isMultipart = true;
        }

        try {
            const res = await axios.post(
                `${API_URL}/user/update/${user._id}`,
                isMultipart ? formData : updatedFields,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        ...(isMultipart && { "Content-Type": "multipart/form-data" })
                    }
                }
            );
            setUser(res.data);
        } catch (err) {
            console.error("❌ Error updating user:", err);
        }
    };

    return (
        <UserContext.Provider value={{ user, token, isLoggedIn, isInitialized,login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
