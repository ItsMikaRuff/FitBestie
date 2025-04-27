import { useUser } from "../context/UserContext";
import {
    Button,
    FooterLink,
    HeaderButtonDiv,
    HeaderStyle,
    HeaderText, } from "./styledComponents";
import { Link, useNavigate } from "react-router-dom";
import FITBESTIE_LOGO from "../Images/FITBESTIE_LOGO.jpg";

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

            {/* <HeaderTitle>FIT-BESTIE</HeaderTitle> */}
            
            <FooterLink href="/">
                <img src={FITBESTIE_LOGO} alt="Logo" style={{ width: "100px", height: "auto" }} />
            </FooterLink>

            <HeaderButtonDiv>
                {isLoggedIn ? (
                    <>
                        <Link to="/profile">
                            <Button>Profile</Button>
                        </Link>
                        <Button onClick={handleLogout}>Logout</Button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <Button>Login</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>Signup</Button>
                        </Link>
                    </>
                )}
            </HeaderButtonDiv>
        </HeaderStyle>
    );
};

export default Header;
