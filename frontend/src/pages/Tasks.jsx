import KanbanBoard from "../components/KanbanBoard";

function Tasks() {
  return (
    <div className="flex-1 bg-slate-900 min-h-screen p-6">
      <h1 className="text-3xl text-white font-bold">
        Task Board
      </h1>

      <KanbanBoard />
    </div>
  );
}

export default Tasks;