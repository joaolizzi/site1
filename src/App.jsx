import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import CandidateForm from "./components/CandidateForm";
import AdminLogin from "./components/AdminLogin";
import AdminPanel from "./components/AdminPanel";
import "./styles.css";

export default function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<CandidateForm />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/panel" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}
