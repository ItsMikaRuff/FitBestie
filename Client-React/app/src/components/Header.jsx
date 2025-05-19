import { useUser } from "../context/UserContext";
import {
  HeaderStyle,
  HeaderText,
  HeaderButtonDiv,
  FooterLink,
  Button,
} from "./styledComponents";
import { Link, useNavigate } from "react-router-dom";
import FITBESTIE_LOGO from "../Images/FITBESTIE_LOGO.jpg";
import { FiSettings } from "react-icons/fi";
import { FaBars } from "react-icons/fa";

const Header = ({ toggleSidebar }) => {
  const { user, isLoggedIn, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <HeaderStyle style={{ direction: "rtl" }}>
      <div style={{ flex: "0 0 auto", marginLeft: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
        <button
          onClick={toggleSidebar}
          style={{
            background: "white",
            border: "1px solid #ccc",
            borderRadius: "50%",
            width: "36px",
            height: "36px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <FaBars />
        </button>
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
            {(user?.role === "admin" || user?.role === "superadmin") && (
              <Link to="/admin">
                <Button><FiSettings /></Button>
              </Link>
            )}
            <Button style={{ backgroundColor: "#dc3545" }} onClick={handleLogout}>התנתק</Button>
          </>
        ) : (
          <>
            <Link to="/signup"><Button>הרשמה</Button></Link>
            <Link to="/login"><Button>התחבר</Button></Link>
          </>
        )}
      </HeaderButtonDiv>
    </HeaderStyle>
  );
};

export default Header;
