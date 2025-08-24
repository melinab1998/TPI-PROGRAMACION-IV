import React from "react";
import { Routes, Route} from "react-router-dom";
import Layout from "./components/Layout/Layout";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="iniciar-sesion" element={<Login />} />
        </Route>
      </Routes>
  );
}

export default App;

