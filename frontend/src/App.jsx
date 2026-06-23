import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Calendar from "./pages/Calendar";
import Analytics from "./pages/Analytics";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Settings from "./pages/Settings";
import TestApi from "./pages/TestApi";

function ProtectedLayout() {
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    Boolean(localStorage.getItem("taskflow-current-user"))
  );

  useEffect(() => {
    const syncAuth = () => {
      setIsAuthenticated(Boolean(localStorage.getItem("taskflow-current-user")));
    };

    window.addEventListener("taskflow:auth-updated", syncAuth);
    window.addEventListener("storage", syncAuth);

    return () => {
      window.removeEventListener("taskflow:auth-updated", syncAuth);
      window.removeEventListener("storage", syncAuth);
    };
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="flex min-h-screen bg-slate-900">
      <Sidebar />

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/test" element={<TestApi />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;