import { Outlet, useLocation } from "react-router-dom";
import HeaderComponent from "./Header";
import FooterComponent from "./Footer";
import { useState } from "react";
import Sidebar from "./SideBar";

const Layout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const hideLayout = ["/login", "/signup", "/trainer-signup"].includes(location.pathname);
  if (hideLayout) return <Outlet />;

  const containerStyle = {
    display: "flex",
    flexDirection: "row-reverse",
  };

  const contentStyle = {
    flex: 1,
    paddingRight: isSidebarOpen ? "240px" : "0",
    transition: "padding-right 0.3s ease",
    minHeight: "100vh",
  };

  return (
    <div style={containerStyle}>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <div style={contentStyle}>
        <HeaderComponent toggleSidebar={() => setIsSidebarOpen(prev => !prev)} />
        <main style={{ paddingTop: "80px", paddingBottom: "80px" }}>
          <Outlet />
        </main>
        <FooterComponent />
      </div>
    </div>
  );
};

export default Layout;