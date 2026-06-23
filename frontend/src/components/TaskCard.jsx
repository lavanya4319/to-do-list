function TaskCard({ task, onDelete }) {
  return (
    <div className="bg-slate-700 p-4 rounded-xl mb-3 shadow">
      <div className="flex justify-between">
        <h3 className="text-white font-semibold">
          {task.title}
        </h3>

        <button
          onClick={() => onDelete(task.id)}
          className="text-red-400"
        >
          ✕
        </button>
      </div>

      <p className="text-gray-300 text-sm mt-2">
        {task.description}
      </p>
    </div>
  );
}

export default TaskCard;