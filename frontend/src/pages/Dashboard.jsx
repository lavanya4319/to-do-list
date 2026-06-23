import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import StatCard from "../components/StatCard";
import { getTaskStats, readLocalTasks, subscribeToTaskChanges, writeLocalTasks } from "../api/taskApi";

function Dashboard() {
  const [stats, setStats] = useState(() => getTaskStats());
  const [tasks, setTasks] = useState(() => readLocalTasks());
  const [search, setSearch] = useState("");

  useEffect(() => {
    const syncStats = () => {
      setStats(getTaskStats());
      setTasks(readLocalTasks());
    };

    syncStats();

    const handleAuthChange = () => syncStats();
    window.addEventListener("taskflow:auth-updated", handleAuthChange);

    return () => {
      window.removeEventListener("taskflow:auth-updated", handleAuthChange);
      subscribeToTaskChanges(syncStats)();
    };
  }, []);

  const filteredTasks = useMemo(() => {
    const query = search.toLowerCase();
    if (!query) return tasks;

    return tasks.filter((task) =>
      [task.title, task.description, task.priority, task.status]
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }, [tasks, search]);

  const handleDelete = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    writeLocalTasks(updatedTasks);
    setTasks(updatedTasks);
    setStats(getTaskStats());
  };

  return (
    <div className="flex-1 p-6 bg-slate-900 min-h-screen text-white">
      <Navbar onSearch={setSearch} />

      <div className="grid grid-cols-3 gap-5 mt-6">
        <StatCard title="Total Tasks" value={stats.totalTasks} />
        <StatCard title="Completed" value={stats.completedTasks} />
        <StatCard title="Pending" value={stats.pendingTasks} />
      </div>

      <div className="mt-8 bg-slate-800 rounded-2xl p-5">
        <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>

        {filteredTasks.length === 0 ? (
          <p className="text-slate-400">No matching tasks found.</p>
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => (
              <div key={task.id} className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold">{task.title}</h4>
                    <p className="text-sm text-slate-400">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
                      {task.status}
                    </span>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="rounded-lg bg-red-500/20 px-3 py-1 text-sm text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;