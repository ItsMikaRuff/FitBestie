//Layout.jsx

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
  paddingRight: isSidebarOpen && window.innerWidth > 700 ? "240px" : "0",
  transition: "padding-right 0.3s ease",
  minHeight: "100vh",
  width: "100%", // להבטיח שהתוכן לא גולש
  boxSizing: "border-box", // לא חובה אבל תמיד עדיף!
};



  return (
    <div style={containerStyle}>

      <div style={contentStyle}>
        <HeaderComponent 
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          sidebarOpen={isSidebarOpen} />
        
        <main style={{ width: "100%", minWidth: 0 }}>
          <Outlet />
         
          
        </main>
        <FooterComponent />
      </div>
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
    </div>
  );
};

export default Layout;