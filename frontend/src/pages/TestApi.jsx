import { useEffect, useState } from "react";
import axios from "axios";

function TestApi() {
  const [message, setMessage] = useState("Loading...");

  useEffect(() => {
    axios
      .get("http://localhost:5000")
      .then((res) => setMessage(res.data))
      .catch(() => setMessage("Backend Connection Failed ❌"));
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-white">
          {message}
        </h1>
      </div>
    </div>
  );
}

export default TestApi;