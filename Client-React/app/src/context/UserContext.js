// userContext.js

import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

axios.defaults.withCredentials = true; // ✅ שליחת cookies בכל הבקשות

const UserContext = createContext();
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    useEffect(() => {
        const tryAutoLogin = async () => {
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
                    try { localStorage.setItem("user", JSON.stringify(res.data)); } catch (e) { console.debug("localStorage set user failed (auto-login)", e); }
                } catch (err) {
                    console.warn('❌ Auto-login failed (token פג תוקף למשל):', err);
                    await refreshToken();
                } finally {
                    setIsInitialized(true);
                }
            } else {
                console.info("🔄 No saved token, trying refresh...");
                await refreshToken();
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
        localStorage.removeItem("loggedOut");

        if (userData?._id && jwt) {
            axios.get(`${API_URL}/user/${userData._id}`, {
                headers: { Authorization: `Bearer ${jwt}` }
            })
                .then((res) => {
                    setUser(res.data);
                    try { localStorage.setItem("user", JSON.stringify(res.data)); } catch (e) { console.debug("localStorage set user failed (login)", e); }
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
        localStorage.setItem("loggedOut", "true");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("user");
        delete axios.defaults.headers.common['Authorization'];
        console.info("🚪 Logged out");
    };

    const updateUser = async (updatedFields) => {
        if (!user || !token) return;

        let formData;
        let isMultipart = false;

        if (updatedFields.image || updatedFields.file) {
            formData = new FormData();
            for (const [key, value] of Object.entries(updatedFields)) {
                if (value instanceof File || value instanceof Blob) {
                    formData.append(key, value);
                } else if (value !== null && typeof value === "object") {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
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
                    },
                    withCredentials: true,
                }
            );
            setUser(res.data);
            try { localStorage.setItem("user", JSON.stringify(res.data)); } catch (e) { console.debug("localStorage set user failed (updateUser)", e); }
        } catch (err) {
            console.error("❌ Error updating user:", err);
        }
    };

    const refreshToken = async () => {
        try {
            const res = await axios.post(`${API_URL}/user/refresh-token`);

            const newToken = res.data.token;
            const userId = res.data.user?._id;

            if (!newToken || !userId) {
                throw new Error("Missing token or user data");
            }

            setToken(newToken);
            localStorage.setItem("token", newToken);
            localStorage.setItem("userId", userId);

            axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            const userRes = await axios.get(`${API_URL}/user/${userId}`, {
                headers: { Authorization: `Bearer ${newToken}` }
            });
            setUser(userRes.data);
            try { localStorage.setItem("user", JSON.stringify(userRes.data)); } catch (e) { console.debug("localStorage set user failed (refreshToken)", e); }
            setIsLoggedIn(true);
        } catch (err) {
            console.warn("🔁 רענון טוקן נכשל:", err?.response?.data || err.message);
            logout();
        }
    };

    useEffect(() => {
        if (isLoggedIn) {
            const interval = setInterval(() => {
                console.log("🔁 Refresh interval started")
                refreshToken();
            }, 13 * 60 * 1000);

            return () => clearInterval(interval);
        }
    }, [isLoggedIn]);

    return (
        <UserContext.Provider value={{ user, token, isLoggedIn, isInitialized, login, logout, updateUser, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
