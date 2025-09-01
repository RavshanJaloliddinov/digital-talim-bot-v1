import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { saveToken } from "../utils/storage";

export const LoginForm = () => {
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("StrongPassword123");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://digital-talim-bot.onrender.com/admin/login", {
        email,
        password,
      });

      // ✅ Tokenni saqlash (utils orqali)
      const token = res.data.access_token;
      saveToken(token);

      // 👉 Dashboard sahifasiga o'tish
      navigate("/dashboard");
    } catch (err: any) {
      setError("Login failed. Check your credentials.");
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <h2>Login</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};
