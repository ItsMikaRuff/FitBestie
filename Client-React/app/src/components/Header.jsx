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
        <HeaderStyle style={{ direction: 'rtl' }}>
            <div style={{ flex: "0 0 auto", marginLeft: "20px" }}>
                <FooterLink href="/">
                    <img src={FITBESTIE_LOGO} alt="Logo" />
                </FooterLink>
            </div>
            <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <HeaderText>
                    ברוכה הבאה, {isLoggedIn && user?.name ? user.name : "חברה!"}
                </HeaderText>
            </div>
            <HeaderButtonDiv style={{ marginRight: "20px" }}>
                {isLoggedIn ? (
                    <>
                        {(user?.role?.toLowerCase() === "admin" || user?.role?.toLowerCase() === "superadmin") && (
                            <Link to="/admin">
                                <Button
                                    title="הגדרות"
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
                        {user?.role?.toLowerCase() === "worker" && (
                            <Link to="/worker">
                                <Button>אימות ספקיות כושר</Button>
                            </Link>
                        )}
                        <Link to="/profile">
                            <Button>פרופיל</Button>
                        </Link>
                        {(user?.role?.toLowerCase() === "superadmin" || user?.role?.toLowerCase() === "manager") && (
                            <Link to="/manager">
                                <Button title="ניהול">ניהול</Button>
                            </Link>
                        )}
                        <Button onClick={handleLogout}>התנתק</Button>
                    </>
                ) : (
                    <>
                        <Link to="/signup">
                            <Button>הרשמה</Button>
                        </Link>
                        <Link to="/login">
                            <Button>התחבר</Button>
                        </Link>
                    </>
                )}
            </HeaderButtonDiv>
        </HeaderStyle>
    );
};

export default Header;

