import { useMemo, useState } from "react";
import { readLocalTasks } from "../api/taskApi";

function Calendar() {
  const [tasks] = useState(() => readLocalTasks());

  const dueTasks = useMemo(() => {
    return tasks.filter((task) => task.due_date);
  }, [tasks]);

  return (
    <div className="flex-1 bg-slate-900 min-h-screen p-6 text-white">
      <h1 className="text-3xl font-bold">Calendar</h1>
      <p className="mt-2 text-slate-400">Tasks with due dates are listed below.</p>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {dueTasks.length === 0 ? (
          <div className="rounded-2xl bg-slate-800 p-5 text-slate-400">
            No tasks with due dates yet.
          </div>
        ) : (
          dueTasks.map((task) => (
            <div key={task.id} className="rounded-2xl bg-slate-800 p-5">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">{task.title}</h3>
                <span className="rounded-full bg-cyan-500/20 px-3 py-1 text-sm text-cyan-300">
                  {task.due_date}
                </span>
              </div>
              <p className="mt-2 text-sm text-slate-400">{task.description}</p>
              <p className="mt-3 text-sm text-slate-500">Status: {task.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Calendar;