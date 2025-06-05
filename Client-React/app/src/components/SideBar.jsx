// SideBar.jsx — גרסה רספונסיבית עם תמונה וברכה בראש

import styled, { keyframes } from "styled-components";
import { NavLink, useNavigate } from "react-router-dom";
import {
  FaUser,
  FaHome,
  FaChartBar,
  FaCog,
  FaUsers,
  FaSignOutAlt,
  FaTimes,
  FaClipboardList,
  FaFemale,
  FaCarrot

} from "react-icons/fa";
import { useUser } from "../context/UserContext";

const slideIn = keyframes`
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
`;

const SidebarContainer = styled.aside`
  position: fixed;
  top: 0;
  left: auto;
  right: 0;
  height: 100vh;
  width: 240px;
  max-width: 90vw;
  background-color: #fff;
  border-left: 1px solid #eee;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.05);
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(100%)'};
  transition: transform 0.3s ease;
  z-index: 9999;
  animation: ${({ isOpen }) => (isOpen ? slideIn : "none")} 0.3s ease forwards;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.4rem;
  color: #666;
  align-self: flex-start;
  margin: 16px 16px 0 auto;z
  cursor: pointer;

  &:hover {
    color: #000;
  }
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 12px;
`;

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 10px 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #333;
  font-size: 0.95rem;
  transition: background-color 0.2s;

  &.active {
    background-color: #ffe9a8;
    font-weight: bold;
  }

  &:hover {
    background-color: #fdf4d7;
  }

  svg {
    font-size: 1.1rem;
    flex-shrink: 0;
  }
`;

const LogoutButton = styled.button`
  margin-top: auto;
  margin-bottom: 20px;
  margin-inline: 16px;
  padding: 10px 14px;
  border: none;
  background-color: #ffe3e3;
  color: #c0392b;
  border-radius: 12px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;

  &:hover {
    background-color: #ffcfcf;
  }

  svg {
    font-size: 1.1rem;
  }
`;

const UserGreeting = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #eee;

  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }

  span {
    font-size: 0.95rem;
    font-weight: 500;
    color: #333;
  }
`;

const DefaultAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: #ffe9ec;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #d63384;
  font-size: 1.2rem;
`;

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const role = user?.role || "";

  const links = user
    ? [
      { to: "/", icon: <FaHome />, label: "דשבורד", roles: ["user", "admin", "superAdmin","manager","trainer"] },
      { to: "/profile", icon: <FaUser />, label: "פרופיל", roles: ["user", "admin", "superAdmin","manager","trainer"] },
      { to: "/metrics", icon: <FaChartBar />, label: "מדדים", roles: ["user", "admin", "superAdmin","manager","trainer"] },
      { to: "/workout-videos", icon: <FaClipboardList />, label: "סרטוני אימון", roles: ["user", "admin", "superAdmin","trainer"] },
      { to: "/search?type=trainer", icon: <FaUsers />, label: "חיפוש מאמנת", roles: ["user", "admin", "superAdmin","trainer","worker","manager"] },
      { to: "/manager", icon: <FaClipboardList />, label: "ממשק מנהל", roles: ["admin", "superAdmin","manager"] },
      { to: "/admin", icon: <FaUsers />, label: "ניהול משתמשים", roles: ["superAdmin","admin"] },
      { to: "/worker", icon: <FaCog />, label: "אימות ספקי כושר", roles: ["superAdmin", "manager","worker"] },
      { to: "/favorite-recipes", icon: <FaCarrot />, label: "המתכונים המועדפים שלי", roles: ["user", "admin", "superAdmin","manager","trainer"] }
    ].filter(link => link.roles.includes(role))
    : [
      { to: "/", icon: <FaHome />, label: "דשבורד" },
      { to: "/signup", icon: <FaUser />, label: "הרשמה" },
      { to: "/login", icon: <FaUser />, label: "התחברות" },
      { to: "/body-type", icon: <FaChartBar />, label: "גלי את סוג הגוף" },
      { to: "/search?type=trainer", icon: <FaUsers />, label: "חיפוש מאמנת" },
    ];

  return (
    <SidebarContainer $isOpen={isOpen}>
      <CloseButton onClick={() => setIsOpen(false)} title="סגור תפריט">
        <FaTimes />
      </CloseButton>

      {user && (
        <UserGreeting>
          {user.image ? (
            <img src={user.image} alt="avatar" />
          ) : (
            <DefaultAvatar>
              <FaFemale />
            </DefaultAvatar>
          )}
          <span>שלום {user.name || "משתמשת"}</span>
        </UserGreeting>
      )}

      <NavList>
        {links.map(link => (
          <NavItem
            key={link.to}
            to={link.to}
            onClick={() => window.innerWidth < 768 && setIsOpen(false)}
          >
            {link.icon}
            <span>{link.label}</span>
          </NavItem>
        ))}
      </NavList>

      {user && (
        <LogoutButton
          onClick={() => {
            logout();
            navigate("/login");
          }}
        >
          <FaSignOutAlt />
          <span>התנתקות</span>
        </LogoutButton>
      )}
    </SidebarContainer>
  );
};

export default Sidebar;
