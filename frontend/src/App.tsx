import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import SkillsPage from './pages/SkillsPage';
import About from "./pages/About";
import Works from "./pages/Works";
import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/AdminDashboard";
import PortfolioAdd from "./pages/admin/PortfolioAdd";
import PortfolioEdit from "./pages/admin/PortfolioEdit";
import SkillAdd from "./pages/admin/SkillAdd";
import SkillEdit from "./pages/admin/SkillEdit";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout 経由で共通レイアウトを適用 */}
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Dashboard />} />
        <Route path="/admin/portfolio/add" element={<PortfolioAdd />} />
        <Route path="/admin/portfolio/edit/:id" element={<PortfolioEdit />} />
        <Route path="/admin/skills/add" element={<SkillAdd />} />
        <Route path="/admin/skills/edit/:id" element={<SkillEdit />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="skills" element={<SkillsPage />} />
          <Route path="about" element={<About />} />
          <Route path="works" element={<Works />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
