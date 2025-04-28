import { useUser } from "../context/UserContext";
import { HeaderStyle, HeaderText, 
    HeaderButtonDiv, FooterLink, Button
 } from "./styledComponents";
import { Link, useNavigate } from "react-router-dom";
import FITBESTIE_LOGO from "../Images/FITBESTIE_LOGO.jpg";
import { FiSettings } from "react-icons/fi";



const Header = () => {
    const { user, isLoggedIn, logout } = useUser();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();              // מוחק את המשתמש מהזיכרון וה־localStorage
        navigate("/");    // מחזיר את המשתמש לדף הבית 
    }

    return (
        <HeaderStyle>
            <div style={{ flex: "0 0 auto" }}>
                <FooterLink href="/">
                    <img src={FITBESTIE_LOGO} alt="Logo" />
                </FooterLink>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <HeaderText>
                    Welcome, {isLoggedIn && user?.name ? user.name : "Guest"}
                </HeaderText>
            </div>
            <HeaderButtonDiv>
                {isLoggedIn ? (
                    <>
                        {user?.role?.toLowerCase() === "admin" && (
                            <Link to="/admin">
                                <Button
                                    title="Configuration"
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        padding: 0,
                                        minWidth: "32px",
                                        minHeight: "32px"
                                    }}
                                >
                                    <FiSettings size={22} />
                                </Button>
                            </Link>
                        )}
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

