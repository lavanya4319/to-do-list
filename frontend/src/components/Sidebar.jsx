import {
  FaHome,
  FaTasks,
  FaCalendarAlt,
  FaChartBar,
  FaCog,
} from "react-icons/fa";

import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("taskflow-current-user");
    window.dispatchEvent(new Event("taskflow:auth-updated"));
    navigate("/login");
  };

  return (
    <div className="w-64 bg-slate-800 text-white h-screen p-5 flex flex-col">
      <div>
        <h1 className="text-2xl font-bold mb-10">
          TaskFlow 🚀
        </h1>

        <ul className="space-y-5">
          <li>
            <Link
              to="/"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaHome />
              Dashboard
            </Link>
          </li>

          <li>
            <Link
              to="/tasks"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaTasks />
              Tasks
            </Link>
          </li>

          <li>
            <Link
              to="/calendar"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaCalendarAlt />
              Calendar
            </Link>
          </li>

          <li>
            <Link
              to="/analytics"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaChartBar />
              Analytics
            </Link>
          </li>

          <li>
            <Link
              to="/settings"
              className="flex items-center gap-3 hover:text-cyan-400 transition"
            >
              <FaCog />
              Settings
            </Link>
          </li>
        </ul>
      </div>

      <div className="mt-auto">
        <button
          onClick={handleSignOut}
          className="block w-full bg-red-500 hover:bg-red-600 text-center py-3 rounded-xl font-semibold transition"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}

export default Sidebar;