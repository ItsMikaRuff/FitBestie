// userContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const UserContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const tryAutoLogin = async () => {
            // ✅ דגל חדש למניעת התחברות מחדש אחרי Logout
            if (localStorage.getItem("loggedOut") === "true") {
                console.info("⛔ המשתמש בחר להתנתק. לא מנסים להתחבר אוטומטית.");
                setIsInitialized(true);
                return;
            }

            const savedToken = localStorage.getItem("token");
            const savedUserId = localStorage.getItem("userId");

            if (savedToken && savedUserId) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
                setToken(savedToken);
                setIsLoggedIn(true);

                try {
                    const res = await axios.get(`${API_URL}/user/${savedUserId}`, {
                        headers: { Authorization: `Bearer ${savedToken}` }
                    });
                    setUser(res.data);
                } catch (err) {
                    console.warn('❌ Auto-login failed (token פג תוקף למשל):', err);
                    logout();
                } finally {
                    setIsInitialized(true);
                }
            } else {
                console.info("🔄 No saved token, trying refresh...");
                await refreshToken(); // ⬅️ זה מה שחשוב!
                setIsInitialized(true);
            }
        };

        tryAutoLogin();
    }, []);

    const login = (data) => {
        const userData = data.user || data;
        const jwt = data.token || null;

        setToken(jwt);
        setIsLoggedIn(true);
        localStorage.setItem("token", jwt);
        localStorage.setItem("userId", userData._id);
        localStorage.removeItem("loggedOut"); // ✅ מבטל את הדגל אם המשתמש מתחבר מחדש

        if (userData?._id && jwt) {
            axios.get(`${API_URL}/user/${userData._id}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
                .then((res) => {
                    setUser(res.data);
                })
                .catch((err) => {
                    console.error("❌ Error loading user:", err);
                    logout();
                });
        } else {
            console.warn("⚠️ Missing _id or token");
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.setItem("loggedOut", "true"); // ✅ דגל שמונע התחברות אוטומטית
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        delete axios.defaults.headers.common['Authorization'];
        console.info("🚪 Logged out");
    };

    const updateUser = async (updatedFields) => {
        if (!user || !token) return;

        let formData;
        let isMultipart = false;

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

    const refreshToken = async () => {
        try {
            const res = await axios.post(`${API_URL}/user/refresh-token`, null, {
                withCredentials: true,
            });

            const newToken = res.data.token;
            setToken(newToken);
            localStorage.setItem("token", newToken);
            const userId = res.data.user?._id;

            if (userId) {
                const userRes = await axios.get(`${API_URL}/user/${userId}`, {
                    headers: { Authorization: `Bearer ${newToken}` }
                });
                setUser(userRes.data);
                setIsLoggedIn(true);
            }
        } catch (err) {
            console.warn("🔁 רענון טוקן נכשל:", err.message);
            logout(); // או לא לעשות כלום אם רוצים לא להיכנס
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const interval = setInterval(() => {
                refreshToken();
            }, 13 * 60 * 1000); // 13 דקות

            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    return (
        <UserContext.Provider value={{ user, token, isLoggedIn, isInitialized, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
