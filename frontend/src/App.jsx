import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
import GuestHome from "./pages/guest/GuestHome/GuestHome";
import UserHome from "./pages/user/UserHome/UserHome";
import Login from "./pages/guest/Login/Login";
import ServicesPage from "./pages/guest/Services/Services";
import Register from "./pages/guest/Register/Register";
import Contact from "./pages/guest/Contact/Contact";
import Appointments from "./pages/user/Appointments/Appointments";
import Calendar from "./pages/user/Calendar/Calendar";
import { useAuth } from "@/hooks/useAuth";
import PatientProfile from "./pages/user/PatientProfile/PatientProfile";
import AdminHome from "./pages/admin/AdminHome/AdminHome";
import AdminSchedule from "./pages/admin/Schedule/Schedule";
import PatientsPage from "./pages/admin/Patients/Patients";
import Availability from "./pages/admin/Availability/Availability";
import VisitsPage from "./pages/admin/Visits/Visits";
import SuperAdmin from "./pages/super/SuperAdminHome/SuperAdminHome";
import ForgotPassword from "./components/ForgotPassword/ForgotPasswordForm/ForgotPasswordForm";
import ResetPassword from "./components/ForgotPassword/ResetPasswordForm/ResetPasswordForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import "./utils/notifications.css"


function App() {
  const { isLoggedIn, role } = useAuth();

  const getHome = () => {
    if (!isLoggedIn) return <GuestHome />;
    if (role === "user") return <UserHome />;
    if (role === "admin") return <AdminHome />;
    if (role === "superadmin") return <SuperAdmin />;
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={getHome()} />
          <Route path="login" element={<Login />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          <Route path="appointments" element={<Appointments />} />
          <Route path="calendar/:id" element={<Calendar />} />
          <Route path="profile" element={<PatientProfile />} />
          <Route path="schedule" element={<AdminSchedule />} />
          <Route path="patients" element={<PatientsPage />} />
          <Route path="availability" element={<Availability />} />
          <Route path="visit-record" element={<VisitsPage />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;

