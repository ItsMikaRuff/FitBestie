import React, { createContext, useContext, useEffect, useState } from 'react';

// Context לשיתוף מידע על המשתמש (user), טוקן (token) ומצב ההתחברות
const UserContext = createContext();

// Provider לעטיפת היישום וסיפוק ה-Context
export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null);

    // בעת עליית הקומפוננטה, נטען מ-localStorage אם קיים
    useEffect(() => {
        const rawUser = localStorage.getItem('user');
        const rawToken = localStorage.getItem('token');

        if (rawUser && rawUser !== 'undefined') {
            try {
                const parsedUser = JSON.parse(rawUser);
                setUser(parsedUser);
                setIsLoggedIn(true);
            } catch {
                console.warn('Invalid user in localStorage, clearing');
                localStorage.removeItem('user');
            }
        }
        if (rawToken && rawToken !== 'undefined') {
            setToken(rawToken);
        }
    }, []);

    /**
     * login: שמירת אובייקט user וטוקן ב-context וב-localStorage
     * data יכול להיות:
     * 1. אובייקט user בלבד
     * 2. אובייקט { user, token }
     */
    const login = (data) => {
        let userData;
        let jwt;

        if (data.user && data.token) {
            userData = data.user;
            jwt = data.token;
        } else {
            userData = data;
        }

        setUser(userData);
        setIsLoggedIn(true);
        localStorage.setItem('user', JSON.stringify(userData));

        if (jwt) {
            setToken(jwt);
            localStorage.setItem('token', jwt);
        }
    };

    /**
     * logout: ניקוי ה-context וה-localStorage
     */
    const logout = () => {
        setUser(null);
        setToken(null);
        setIsLoggedIn(false);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    };

    /**
     * updateUser: עדכון אובייקט user בלבד
     */
    const updateUser = (updated) => {
        setUser(updated);
        localStorage.setItem('user', JSON.stringify(updated));
    };

    return (
        <UserContext.Provider value={{ user, token, isLoggedIn, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

/**
 * Hook נוח לשימוש בתוך קומפוננטות
 */
export const useUser = () => useContext(UserContext);

// Export ברירת מחדל של ה-Provider
export default UserProvider;
