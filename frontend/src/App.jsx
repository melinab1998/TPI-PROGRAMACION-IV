import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import UserHome from "./pages/UserHome/UserHome"; // 👈 nuevo import
import Login from "./pages/Login/Login";
import ServicesPage from "./pages/Services/Services";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";
import Appointments from "./pages/Appointments/Appointments";
import Calendar from "./pages/Calendar/Calendar";
import { useAuth } from "@/hooks/useAuth"; 
import PatientProfile from "./pages/PatientProfile/PatientProfile";
import AdminHome from "./pages/AdminHome/AdminHome";
import AdminSchedule from "./pages/AdminSchedule/AdminSchedule";
import PatientsPage from "./pages/PatientsPage/PatientsPage";
import Availability from "./pages/Availability/Availability";
import VisitsPage from "./pages/VisitPage/VisitPage";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import ForgotPassword from "./components/ForgotPassword/ForgotPasswordForm/ForgotPasswordForm";
import ResetPassword from "./components/ForgotPassword/ResetPasswordForm/ResetPasswordForm";

function App() {

  const { isLoggedIn, role } = useAuth();
  const getHome = () => {
    if (!isLoggedIn) return <Home />;
    if (role === "user") return <UserHome />;
    if (role === "admin") return <AdminHome />;
    if (role === "superadmin") return <SuperAdmin />;
  };

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={getHome()} />
        <Route path="login" element={<Login />} />
        <Route path="services" element={<ServicesPage />} />
        <Route path="register" element={<Register />} />
        <Route path="contact" element={<Contact />} />
        <Route path="appointments" element={<Appointments />} />
        <Route path="calendar/:id" element={<Calendar />} />
        <Route path="profile" element={<PatientProfile/>}/>
        <Route path="schedule" element={<AdminSchedule/>}/>
        <Route path="patients" element={<PatientsPage/>}/>
        <Route path="availability" element={<Availability/>}/>
        <Route path="visit-record" element={<VisitsPage/>}/>
        <Route path="forgot-password" element={<ForgotPassword/>}/>
        <Route path="reset-password" element={<ResetPassword/>}/>
      </Route>
    </Routes>
  );
}

export default App;


