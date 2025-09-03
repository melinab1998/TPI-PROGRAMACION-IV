import React from "react";
import { Routes, Route} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ServicesPage from "./pages/Services/Services";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";
import Turn from "./pages/Turn/Turn";
import Calendar from "./pages/Calendar/Calendar";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="register" element={<Register/>}/>
          <Route path="contact" element={<Contact/>}/>
          <Route path="turnos" element={<Turn />} />
          <Route path="calendario/:id" element={<Calendar />} />
        </Route>
      </Routes>
  );
}

export default App;

