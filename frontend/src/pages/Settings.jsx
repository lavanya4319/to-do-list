import { useEffect, useState } from "react";

function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [theme, setTheme] = useState("dark");
  const [notifications, setNotifications] = useState(true);
  const [reminders, setReminders] = useState(true);
  const [autoSave, setAutoSave] = useState(true);
  const [compactMode, setCompactMode] = useState(false);
  const [language, setLanguage] = useState("English");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("taskflow-current-user") || "null");
    if (currentUser) {
      setName(currentUser.name || "");
      setEmail(currentUser.email || "");
    }

    setTheme(localStorage.getItem("taskflow-theme") || "dark");
    setNotifications(localStorage.getItem("taskflow-notifications") !== "false");
    setReminders(localStorage.getItem("taskflow-reminders") !== "false");
    setAutoSave(localStorage.getItem("taskflow-auto-save") !== "false");
    setCompactMode(localStorage.getItem("taskflow-compact-mode") === "true");
    setLanguage(localStorage.getItem("taskflow-language") || "English");
  }, []);

  const handleSave = (e) => {
    e.preventDefault();

    const users = JSON.parse(localStorage.getItem("taskflow-users") || "[]");
    const currentUser = JSON.parse(localStorage.getItem("taskflow-current-user") || "null");

    if (currentUser) {
      const updatedUsers = users.map((user) =>
        user.email === currentUser.email ? { ...user, name, email } : user
      );

      localStorage.setItem("taskflow-users", JSON.stringify(updatedUsers));
      localStorage.setItem(
        "taskflow-current-user",
        JSON.stringify({ ...currentUser, name, email })
      );
      localStorage.setItem("taskflow-theme", theme);
      localStorage.setItem("taskflow-notifications", String(notifications));
      localStorage.setItem("taskflow-reminders", String(reminders));
      localStorage.setItem("taskflow-auto-save", String(autoSave));
      localStorage.setItem("taskflow-compact-mode", String(compactMode));
      localStorage.setItem("taskflow-language", language);
      setMessage("Settings updated successfully");
    }
  };

  const handleResetData = () => {
    localStorage.removeItem("taskflow-tasks-user-guest");
    localStorage.removeItem("taskflow-tasks-user-undefined");
    localStorage.setItem("taskflow-tasks", "[]");
    setMessage("Local task data cleared");
  };

  return (
    <div className="flex-1 min-h-screen bg-slate-900 p-6 text-white">
      <div className="max-w-4xl rounded-3xl bg-slate-800 p-8 shadow-2xl">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-2 text-slate-400">Manage your profile, preferences, and task experience.</p>

        {message ? (
          <div className="mt-4 rounded-lg border border-green-500/30 bg-green-500/10 px-4 py-3 text-sm text-green-400">
            {message}
          </div>
        ) : null}

        <form onSubmit={handleSave} className="mt-8 space-y-8">
          <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-xl font-semibold">Profile</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-xl font-semibold">Preferences</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm text-slate-300">Theme</label>
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm text-slate-300">Language</label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 outline-none"
                >
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Spanish</option>
                </select>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                <span>Enable notifications</span>
                <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                <span>Show reminders</span>
                <input type="checkbox" checked={reminders} onChange={() => setReminders(!reminders)} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                <span>Auto-save tasks</span>
                <input type="checkbox" checked={autoSave} onChange={() => setAutoSave(!autoSave)} className="h-4 w-4" />
              </label>
              <label className="flex items-center justify-between rounded-xl border border-slate-700 bg-slate-950 px-4 py-3">
                <span>Compact view</span>
                <input type="checkbox" checked={compactMode} onChange={() => setCompactMode(!compactMode)} className="h-4 w-4" />
              </label>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-700 bg-slate-900/70 p-5">
            <h2 className="mb-4 text-xl font-semibold">Security & Data</h2>
            <div className="space-y-3">
              <button
                type="button"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-left text-slate-200"
              >
                Change password
              </button>
              <button
                type="button"
                onClick={handleResetData}
                className="w-full rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-left text-red-300"
              >
                Clear local task data
              </button>
            </div>
          </section>

          <button
            type="submit"
            className="rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-600"
          >
            Save Settings
          </button>
        </form>
      </div>
    </div>
  );
}

export default Settings;