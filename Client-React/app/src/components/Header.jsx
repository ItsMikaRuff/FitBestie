import { useUser } from "../context/UserContext";
import {
    HeaderButton,
    HeaderButtonDiv,
    HeaderStyle,
    HeaderText,
    HeaderTitle
} from "./styledComponents";

import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const { user, isLoggedIn, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();              // מוחק את המשתמש מהזיכרון וה־localStorage
        navigate("/");    // מחזיר את המשתמש לדף הבית 
    }

    return (
        <HeaderStyle>
            <HeaderText>
                Welcome, {isLoggedIn && user?.name ? user.name : "Guest"}
            </HeaderText>

            <HeaderTitle>FIT-BESTIE</HeaderTitle>

            <HeaderButtonDiv>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">
                            <HeaderButton>Profile</HeaderButton>
                        </Link>
                        <HeaderButton onClick={handleLogout}>Logout</HeaderButton>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <HeaderButton>Login</HeaderButton>
                        </Link>
                        <Link to="/signup">
                            <HeaderButton>Signup</HeaderButton>
                        </Link>
                    </>
                )}
            </HeaderButtonDiv>
        </HeaderStyle>
    );
};

export default Header;
