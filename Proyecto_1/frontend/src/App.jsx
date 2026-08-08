import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./components/common/Layout.jsx";
import Home from "./pages/Home.jsx";
import CaseSelection from "./pages/CaseSelection.jsx";
import InvestigationDashboard from "./pages/InvestigationDashboard.jsx";
import Admin from "./pages/Admin.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cases" element={<CaseSelection />} />
        <Route path="/investigation/:caseId" element={<InvestigationDashboard />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
