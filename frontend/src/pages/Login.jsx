import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api/auth",
});

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await authApi.post("/login", { email, password });
      const user = response.data;

      localStorage.setItem("taskflow-current-user", JSON.stringify(user));
      window.dispatchEvent(new Event("taskflow:auth-updated"));
      navigate("/tasks");
    } catch (err) {
      setError(err.response?.data?.error || "Unable to sign in right now");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top,_#0f172a,_#020617)] px-4">
      <div className="w-full max-w-5xl rounded-[32px] border border-slate-700/60 bg-slate-900/80 shadow-2xl overflow-hidden backdrop-blur-xl">
        <div className="grid lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden lg:flex flex-col justify-center bg-gradient-to-br from-cyan-500/20 via-slate-900 to-slate-950 p-10">
            <div className="inline-flex w-16 h-16 items-center justify-center rounded-2xl bg-cyan-500/20 text-cyan-300 text-3xl font-bold shadow-lg">
              ✓
            </div>
            <h2 className="mt-6 text-4xl font-bold text-white">
              TaskFlow
            </h2>
            <p className="mt-3 text-lg text-slate-300">
              A clean and simple to-do list experience for staying on top of your day.
            </p>
          </div>

          <form
            onSubmit={handleLogin}
            className="p-8 sm:p-10 lg:p-12"
          >
            <div className="mb-8">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                Welcome back
              </p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                Sign in to TaskFlow
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Continue organizing your tasks with ease.
              </p>
            </div>

            {error ? (
              <p className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
                {error}
              </p>
            ) : null}

            <div className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none ring-0 transition focus:border-cyan-500"
                required
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white outline-none transition focus:border-cyan-500"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-cyan-500 px-4 py-3 font-semibold text-white transition hover:bg-cyan-600"
            >
              Sign In
            </button>

            <p className="mt-6 text-center text-sm text-slate-400">
              Don’t have an account?{' '}
              <a href="/register" className="font-semibold text-cyan-400 hover:text-cyan-300">
                Create one
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;