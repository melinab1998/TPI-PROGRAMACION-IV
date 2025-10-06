import { Outlet } from "react-router-dom";
import NavBar from "../guest/NavBar/NavBar";
import Footer from "../guest/Footer/Footer";

const Layout = () => {

    return (
        <>
            <NavBar />
            <Outlet />
            <Footer />
        </>
    );
};

export default Layout;