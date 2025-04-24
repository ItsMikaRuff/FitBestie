import { createContext, useContext, useEffect, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setIsLoggedIn(true);
        }
    }, []);

    const login = (userData) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsLoggedIn(true);

    };

    const logout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setIsLoggedIn(false);
    };
    
    const updateUser = (updatedData) => {
        setUser(updatedData);
        localStorage.setItem("user", JSON.stringify(updatedData));
    };
    
    return (
        <UserContext.Provider value={{ user, setUser, isLoggedIn, login, logout, updateUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;