import axios from "axios";

const API = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL || "/api"}/tasks`,
});

export const STORAGE_KEY = "taskflow-tasks";

const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("taskflow-current-user") || "null");
  } catch {
    return null;
  }
};

const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.id ?? null;
};

const getUserStorageKey = () => {
  const userId = getCurrentUserId();
  return userId ? `${STORAGE_KEY}-user-${userId}` : `${STORAGE_KEY}-guest`;
};

const normalizeTasks = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (value && typeof value === "object") {
    const columns = ["todo", "progress", "completed"];
    const tasks = [];

    columns.forEach((status) => {
      const items = value[status]?.items || [];
      items.forEach((item, index) => {
        tasks.push({
          ...item,
          status,
          id: item.id || `${status}-${index}`,
        });
      });
    });

    return tasks;
  }

  return [];
};

export const readLocalTasks = () => {
  if (typeof window === "undefined") return [];

  try {
    const key = getUserStorageKey();
    const saved = window.localStorage.getItem(key);
    return saved ? normalizeTasks(JSON.parse(saved)) : [];
  } catch {
    return [];
  }
};

export const writeLocalTasks = (tasks) => {
  if (typeof window === "undefined") return;

  const normalized = normalizeTasks(tasks);
  window.localStorage.setItem(getUserStorageKey(), JSON.stringify(normalized));
  window.dispatchEvent(new CustomEvent("taskflow:tasks-updated"));
};

const ensureSeedTasks = () => {
  const existing = readLocalTasks();
  if (existing.length > 0) return existing;

  const seedTasks = [
    {
      id: 1,
      title: "Plan weekly goals",
      description: "Review priorities for the week",
      status: "todo",
      priority: "High",
      due_date: "",
      user_id: 1,
    },
    {
      id: 2,
      title: "Design landing page",
      description: "Refine layout and content",
      status: "progress",
      priority: "Medium",
      due_date: "",
      user_id: 1,
    },
  ];

  writeLocalTasks(seedTasks);
  return seedTasks;
};

export const getTaskStats = () => {
  const tasks = readLocalTasks();
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
};

export const subscribeToTaskChanges = (callback) => {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("taskflow:tasks-updated", callback);
  return () => window.removeEventListener("taskflow:tasks-updated", callback);
};

const syncTasksFromResponse = (responseData) => {
  const incomingTasks = normalizeTasks(responseData);
  if (incomingTasks.length > 0) {
    writeLocalTasks(incomingTasks);
  }
  return responseData;
};

const fallbackRequest = async (operation, payload = null) => {
  const tasks = readLocalTasks();

  switch (operation) {
    case "get":
      return { data: tasks.slice().reverse() };
    case "create": {
      const newTask = {
        id: Date.now(),
        ...payload,
      };
      const updated = [newTask, ...tasks];
      writeLocalTasks(updated);
      return { data: newTask };
    }
    case "delete": {
      const updated = tasks.filter((task) => String(task.id) !== String(payload));
      writeLocalTasks(updated);
      return { data: { message: "Task deleted successfully" } };
    }
    case "update": {
      const updated = tasks.map((task) =>
        String(task.id) === String(payload.id)
          ? { ...task, status: payload.status }
          : task
      );
      writeLocalTasks(updated);
      return { data: updated.find((task) => String(task.id) === String(payload.id)) };
    }
    default:
      return { data: tasks };
  }
};

export const getTasks = async () => {
  try {
    const userId = getCurrentUserId();
    const response = await API.get("/", {
      params: userId ? { user_id: userId } : {},
    });
    return { ...response, data: syncTasksFromResponse(response.data) };
  } catch {
    return fallbackRequest("get");
  }
};

export const createTask = async (task) => {
  try {
    const userId = getCurrentUserId();
    const payload = { ...task, ...(userId ? { user_id: userId } : {}) };
    const response = await API.post("/", payload);
    const currentTasks = readLocalTasks();
    const newTask = response.data;
    const updated = [
      { ...newTask, title: newTask.title || task.title },
      ...currentTasks.filter((item) => String(item.id) !== String(newTask.id)),
    ];
    writeLocalTasks(updated);
    return response;
  } catch {
    return fallbackRequest("create", task);
  }
};

export const deleteTask = async (id) => {
  try {
    const response = await API.delete(`/${id}`);
    const currentTasks = readLocalTasks();
    const updated = currentTasks.filter((task) => String(task.id) !== String(id));
    writeLocalTasks(updated);
    return response;
  } catch {
    return fallbackRequest("delete", id);
  }
};

export const updateTaskStatus = async (id, status) => {
  try {
    const response = await API.put(`/${id}`, { status });
    const currentTasks = readLocalTasks();
    const updated = currentTasks.map((task) =>
      String(task.id) === String(id)
        ? { ...task, status }
        : task
    );
    writeLocalTasks(updated);
    return response;
  } catch {
    return fallbackRequest("update", { id, status });
  }
};