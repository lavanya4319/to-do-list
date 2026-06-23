import { useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";
import { getTaskStats, readLocalTasks, subscribeToTaskChanges } from "../api/taskApi";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function Analytics() {
  const [tasks, setTasks] = useState(() => readLocalTasks());

  useEffect(() => {
    const syncTasks = () => setTasks(readLocalTasks());
    syncTasks();

    const handleAuthChange = () => syncTasks();
    window.addEventListener("taskflow:auth-updated", handleAuthChange);

    return () => {
      window.removeEventListener("taskflow:auth-updated", handleAuthChange);
      subscribeToTaskChanges(syncTasks)();
    };
  }, []);

  const stats = useMemo(() => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((task) => task.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;
    const productivity = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      productivity,
    };
  }, [tasks]);

  const { totalTasks, completedTasks, pendingTasks, productivity } = stats;

  const pieData = {
    labels: ["Completed", "Pending"],
    datasets: [
      {
        data: [completedTasks, pendingTasks],
        backgroundColor: ["#22c55e", "#ef4444"],
        borderWidth: 2,
      },
    ],
  };

  const barData = {
    labels: ["To Do", "In Progress", "Completed"],
    datasets: [
      {
        label: "Tasks",
        data: [
          tasks.filter((task) => task.status === "todo").length,
          tasks.filter((task) => task.status === "progress").length,
          tasks.filter((task) => task.status === "completed").length,
        ],
        backgroundColor: ["#3b82f6", "#f59e0b", "#22c55e"],
        borderRadius: 12,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#334155",
        },
      },
      y: {
        ticks: {
          color: "white",
        },
        grid: {
          color: "#334155",
        },
      },
    },
  };

  return (
    <div className="flex-1 bg-slate-900 min-h-screen p-6 text-white">
      <h1 className="text-4xl font-bold mb-8">
        Analytics Dashboard 📊
      </h1>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-4 gap-5 mb-8">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm">Total Tasks</h3>
          <h1 className="text-4xl font-bold mt-2">
            {totalTasks}
          </h1>
        </div>

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm">Completed</h3>
          <h1 className="text-4xl font-bold mt-2">
            {completedTasks}
          </h1>
        </div>

        <div className="bg-gradient-to-r from-red-600 to-pink-500 p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm">Pending</h3>
          <h1 className="text-4xl font-bold mt-2">
            {pendingTasks}
          </h1>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-indigo-500 p-5 rounded-2xl shadow-lg">
          <h3 className="text-sm">Productivity</h3>
          <h1 className="text-4xl font-bold mt-2">
            {productivity}%
          </h1>
        </div>
      </div>

      {/* Charts */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-5">
            Completion Status
          </h2>

          <Pie
            data={pieData}
            options={chartOptions}
          />
        </div>

        <div className="bg-slate-800 p-6 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-bold mb-5">
            Task Distribution
          </h2>

          <Bar
            data={barData}
            options={chartOptions}
          />
        </div>
      </div>

      {/* Productivity Message */}
      <div className="mt-8 bg-slate-800 rounded-2xl p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-2">
          Performance Overview 🚀
        </h2>

        <p className="text-gray-300">
          You have completed{" "}
          <span className="text-green-400 font-bold">
            {completedTasks}
          </span>{" "}
          out of{" "}
          <span className="text-cyan-400 font-bold">
            {totalTasks}
          </span>{" "}
          tasks with a productivity score of{" "}
          <span className="text-yellow-400 font-bold">
            {productivity}%
          </span>
          .
        </p>
      </div>
    </div>
  );
}

export default Analytics;