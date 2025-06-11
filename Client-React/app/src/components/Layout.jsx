//Layout.jsx

import { Outlet } from "react-router-dom";
import HeaderComponent from "./Header";
import FooterComponent from "./Footer";
import { useState } from "react";
import Sidebar from "./SideBar";
// import SmartRecipeChat from "./RecipeChat";

const Layout = () => {
  // const location = useLocation();
  // const {user} = useContext(UserContext)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // const hideLayout = ["/login", "/signup", "/trainer-signup"].includes(location.pathname);
  // if (hideLayout) return <Outlet />;

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

      <div style={contentStyle}>
        <HeaderComponent 
          toggleSidebar={() => setIsSidebarOpen(prev => !prev)} 
          sidebarOpen={isSidebarOpen} />
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
        <main style={{ paddingTop: "150px", paddingBottom: "56px" }}>
          <Outlet />
          {/* <SmartRecipeChat sidebarOpen={isSidebarOpen} /> */}
        </main>
        <FooterComponent />
      </div>
    </div>
  );
};

export default Layout;