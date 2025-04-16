import { Outlet, useLocation } from "react-router-dom";
import HeaderComponent from "./Header"; // קומפוננטת Header שלך
import FooterComponent from "./Footer"; // קומפוננטת Footer שלך

const Layout = () => {
    const location = useLocation();

    // דפים שבהם לא יוצג ה-Header וה-Footer
    const hideLayout = ["/login", "/signup"].includes(location.pathname);

    return (
        <>
            {!hideLayout && <HeaderComponent />}
            <main style={{ paddingTop: "80px", paddingBottom: "80px", minHeight: "100vh" }}>
                <Outlet />
            </main>
            {!hideLayout && <FooterComponent />}
        </>
    );
};

export default Layout;
