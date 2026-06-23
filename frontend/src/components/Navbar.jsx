import { useEffect, useState } from "react";
import { readLocalTasks } from "../api/taskApi";

function Navbar({ onSearch }) {
  const [query, setQuery] = useState("");

  useEffect(() => {
    onSearch?.(query);
  }, [query, onSearch]);

  return (
    <div className="bg-slate-800 p-4 rounded-xl flex justify-between items-center gap-3">
      <h2 className="text-white text-xl font-semibold">
        Dashboard
      </h2>

      <input
        type="text"
        placeholder="Search tasks..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="px-4 py-2 rounded-lg bg-slate-700 text-white outline-none w-full max-w-sm"
      />
    </div>
  );
}

export default Navbar;