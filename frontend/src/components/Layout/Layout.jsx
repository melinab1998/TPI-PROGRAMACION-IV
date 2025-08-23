import { Outlet } from "react-router-dom";
import NavBar from "../../components/NavBar/NavBar";
import Footer from "../Footer/Footer";

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