import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const authApi = axios.create({
  baseURL: "http://localhost:5000/api/auth",
});

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const response = await authApi.post("/register", { name, email, password });
      const newUser = response.data;

      localStorage.setItem("taskflow-current-user", JSON.stringify(newUser));
      localStorage.removeItem(`${"taskflow-tasks"}-guest`);
      window.dispatchEvent(new Event("taskflow:auth-updated"));
      setMessage("Registration successful");
      navigate("/tasks");
    } catch (err) {
      setMessage(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">
      <form
        onSubmit={handleRegister}
        className="bg-slate-800 p-8 rounded-2xl w-96 shadow-xl"
      >
        <h1 className="text-3xl font-bold text-white mb-6 text-center">
          Register
        </h1>

        {message ? (
          <p className="text-green-400 text-sm mb-3">{message}</p>
        ) : null}

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 text-white"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 text-white"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 rounded-lg bg-slate-700 text-white"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-lg text-white font-semibold"
        >
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;