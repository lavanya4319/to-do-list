import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import {
  getTasks,
  createTask,
  deleteTask,
  updateTaskStatus,
  writeLocalTasks,
  readLocalTasks,
} from "../api/taskApi";

function KanbanBoard() {
  const [newTask, setNewTask] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPriority, setEditPriority] = useState("Medium");
  const [editDueDate, setEditDueDate] = useState("");

  const [columns, setColumns] = useState({
    todo: {
      name: "To Do",
      items: [],
    },
    progress: {
      name: "In Progress",
      items: [],
    },
    completed: {
      name: "Completed",
      items: [],
    },
  });

  const loadTasks = async () => {
    try {
      const res = await getTasks();

      const board = {
        todo: {
          name: "To Do",
          items: [],
        },
        progress: {
          name: "In Progress",
          items: [],
        },
        completed: {
          name: "Completed",
          items: [],
        },
      };

      const tasks = Array.isArray(res?.data) ? res.data : readLocalTasks();

      tasks.forEach((task) => {
        const status = task.status || "todo";

        if (board[status]) {
          board[status].items.push({
            id: String(task.id),
            title: task.title,
            priority: task.priority,
            dueDate: task.due_date,
            description: task.description || "Task created successfully",
            originalTask: task,
          });
        }
      });

      setColumns(board);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const addTask = async () => {
    if (!newTask.trim()) return;

    try {
      await createTask({
        title: newTask,
        description: "Task created successfully",
        status: "todo",
        priority,
        due_date: dueDate,
      });

      setNewTask("");
      setPriority("Medium");
      setDueDate("");

      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const removeTask = async (taskId) => {
    try {
      await deleteTask(taskId);
      loadTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority || "Medium");
    setEditDueDate(task.dueDate || "");
  };

  const saveEdit = async () => {
    if (!editingTaskId) return;

    const existingTasks = readLocalTasks();
    const updatedTasks = existingTasks.map((task) =>
      String(task.id) === String(editingTaskId)
        ? {
            ...task,
            title: editTitle,
            description: editDescription,
            priority: editPriority,
            due_date: editDueDate,
          }
        : task
    );

    writeLocalTasks(updatedTasks);
    setEditingTaskId(null);
    setEditTitle("");
    setEditDescription("");
    setEditPriority("Medium");
    setEditDueDate("");
    loadTasks();
  };

  const retask = async (taskId) => {
    const currentTasks = readLocalTasks();
    const updatedTasks = currentTasks.map((task) =>
      String(task.id) === String(taskId)
        ? { ...task, status: "todo" }
        : task
    );

    writeLocalTasks(updatedTasks);
    loadTasks();
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];

    const sourceItems = [...sourceColumn.items];
    const destItems = [...destColumn.items];

    const [removed] = sourceItems.splice(source.index, 1);

    destItems.splice(destination.index, 0, removed);

    setColumns({
      ...columns,
      [source.droppableId]: {
        ...sourceColumn,
        items: sourceItems,
      },
      [destination.droppableId]: {
        ...destColumn,
        items: destItems,
      },
    });

    try {
      await updateTaskStatus(
        removed.id,
        destination.droppableId
      );
    } catch (err) {
      console.error(err);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "bg-red-500";
      case "Medium":
        return "bg-yellow-500";
      case "Low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="mt-6">
      <div className="bg-slate-800 p-5 rounded-2xl mb-6">
        <h2 className="text-white text-xl font-bold mb-4">
          Create New Task
        </h2>

        <div className="grid md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Task title..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-700 text-white outline-none"
          />

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-700 text-white"
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-4 py-3 rounded-xl bg-slate-700 text-white"
          />

          <button
            onClick={addTask}
            className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl font-semibold"
          >
            Add Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid md:grid-cols-3 gap-6">
          {Object.entries(columns).map(([columnId, column]) => (
            <div
              key={columnId}
              className="bg-slate-800 rounded-2xl p-4 min-h-[450px]"
            >
              <h2 className="text-white text-xl font-bold mb-4">
                {column.name}
              </h2>

              <Droppable droppableId={columnId}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="space-y-4"
                  >
                    {column.items.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={String(task.id)}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-slate-700 p-4 rounded-xl shadow-lg"
                          >
                            <div className="flex justify-between gap-2">
                              <h3 className="text-white font-semibold text-lg">
                                {task.title}
                              </h3>

                              <div className="flex gap-2">
                                <button
                                  onClick={() => startEdit(task)}
                                  className="text-cyan-300 text-sm"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => retask(task.id)}
                                  className="text-yellow-300 text-sm"
                                >
                                  Retask
                                </button>
                                <button
                                  onClick={() => removeTask(task.id)}
                                  className="text-red-400"
                                >
                                  ✕
                                </button>
                              </div>
                            </div>

                            <div className="mt-3">
                              <span
                                className={`${getPriorityColor(
                                  task.priority
                                )} px-3 py-1 rounded-full text-white text-sm`}
                              >
                                {task.priority}
                              </span>
                            </div>

                            <p className="text-gray-400 text-sm mt-3">
                              Due: {task.dueDate || "Not Set"}
                            </p>

                            <p className="text-gray-300 text-sm mt-2">
                              {task.description}
                            </p>

                            {editingTaskId === task.id ? (
                              <div className="mt-3 space-y-2">
                                <input
                                  value={editTitle}
                                  onChange={(e) => setEditTitle(e.target.value)}
                                  className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
                                />
                                <textarea
                                  value={editDescription}
                                  onChange={(e) => setEditDescription(e.target.value)}
                                  className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
                                  rows="2"
                                />
                                <div className="flex gap-2">
                                  <select
                                    value={editPriority}
                                    onChange={(e) => setEditPriority(e.target.value)}
                                    className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
                                  >
                                    <option>High</option>
                                    <option>Medium</option>
                                    <option>Low</option>
                                  </select>
                                  <input
                                    type="date"
                                    value={editDueDate}
                                    onChange={(e) => setEditDueDate(e.target.value)}
                                    className="rounded-lg bg-slate-800 px-3 py-2 text-sm text-white"
                                  />
                                </div>
                                <button
                                  onClick={saveEdit}
                                  className="rounded-lg bg-cyan-500 px-3 py-2 text-sm text-white"
                                >
                                  Save
                                </button>
                              </div>
                            ) : null}
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}

export default KanbanBoard;