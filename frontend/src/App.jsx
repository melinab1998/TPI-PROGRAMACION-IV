import React from "react";
import { Routes, Route} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import ServicesPage from "./pages/Services/Services";
import Register from "./pages/Register/Register";
import Contact from "./pages/Contact/Contact";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="register" element={<Register/>}/>
          <Route path="contact" element={<Contact/>}/>
        </Route>
      </Routes>
  );
}

export default App;

