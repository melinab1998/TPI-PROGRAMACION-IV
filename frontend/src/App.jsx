import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/guest/Layout/Layout";
import GuestHome from "./pages/guest/GuestHome/GuestHome";
import UserHome from "./pages/user/UserHome/UserHome";
import Login from "./pages/guest/Login/Login";
import ServicesPage from "./pages/guest/Services/Services";
import Register from "./pages/guest/Register/Register";
import Contact from "./pages/guest/Contact/Contact";
import Appointments from "./pages/user/Appointments/appointments";
import Calendar from "./pages/user/Calendar/Calendar";
import PatientProfile from "./pages/user/PatientProfile/PatientProfile";
import AdminHome from "./pages/admin/AdminHome/AdminHome";
import AdminSchedule from "./pages/admin/Schedule/Schedule";
import PatientsPage from "./pages/admin/Patients/Patients";
import Availability from "./pages/admin/Availability/Availability";
import Odontogram from "./components/admin/Odontogram/Odontogram/Odontogram";
import VisitsPage from "./pages/admin/Visits/Visits";
import SuperAdminPage from "./pages/super/SuperAdminHome/SuperAdminHome";
import ForgotPassword from "./components/guest/ForgotPassword/ForgotPasswordForm/ForgotPasswordForm";
import ResetPassword from "./components/guest/ForgotPassword/ResetPasswordForm/ResetPasswordForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./utils/notifications.css";
import { AuthContext } from "@/services/auth/AuthContextProvider"; 
import NotFound from "./components/common/NotFound/NotFound";
import ProtectedRoute from "./components/common/ProtectedRoute/ProtectedRoute";

function App() {
  const { role } = useContext(AuthContext);

  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={
            role === "SuperAdmin" ? <SuperAdminPage />
              : role === "Dentist" ? <AdminHome />
                : role === "Patient" ? <UserHome />
                  : <GuestHome />
          } />
          
          <Route path="login" element={<Login />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="register" element={<Register />} />
          <Route path="contact" element={<Contact />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
          <Route path="reset-password" element={<ResetPassword />} />

          <Route element={<ProtectedRoute allowedRoles={["Patient"]} />}>
            <Route path="appointments" element={<Appointments />} />
            <Route path="calendar/:id" element={<Calendar />} />
            <Route path="profile" element={<PatientProfile />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["Dentist"]} />}>
            <Route path="schedule" element={<AdminSchedule />} />
            <Route path="patients" element={<PatientsPage />} />
            <Route path="availability" element={<Availability />} />
            <Route path="visit-record" element={<VisitsPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["SuperAdmin"]} />}>
            <Route path="super-admin" element={<SuperAdminPage />} />
          </Route>

          <Route path="*" element={<NotFound />} />
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