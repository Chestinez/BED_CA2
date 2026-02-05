import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Login() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errMsg, setErrMsg] = useState("");
  const { login } = useAuth();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (form.name.length < 5) {
      return setErrMsg("Username must be at least 5 characters");
    }

    try {
      await login(form.name, form.email, form.password);
      window.location.href = "/dashboard";
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-4">
      <div className="card p-4 futuristic-card" style={{ width: "420px" }}>
        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        <h2 className="text-center mb-4 futuristic-title">SHIP ACCESS LOGIN</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="form-control futuristic-input"
              placeholder="Pilot ID"
              required
            />
          </div>

          <div className="mb-3">
            <label>Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="form-control futuristic-input"
              placeholder="Transmission Address"
              required
            />
          </div>

          <div className="mb-3">
            <label>Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="form-control futuristic-input"
              placeholder="Access Code"
              required
            />
          </div>

          <button className="btn futuristic-btn w-100 mt-2" type="submit">
            ENGAGE
          </button>
        </form>

        <p className="mt-3 text-center">
          New recruit? <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}
