import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Register() {
  const { register } = useAuth();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    description: "",
  });
  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrMsg("");

    if (form.username.length < 5)
      return setErrMsg("Username must be at least 5 characters");

    if (form.password.length < 8)
      return setErrMsg("Password must be at least 8 characters");

    try {
      await register(form.username, form.email, form.password, form.description);
      window.location.href = "/dashboard";
    } catch (err) {
      setErrMsg(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center py-4">
      <div className="card p-4 futuristic-card" style={{ width: "450px" }}>

        {errMsg && <div className="alert alert-danger">{errMsg}</div>}

        <h2 className="text-center mb-4 futuristic-title">
          CREW REGISTRATION
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              className="form-control futuristic-input"
              placeholder="Choose Pilot ID"
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
              placeholder="Secure Access Code"
              required
            />
          </div>

          <div className="mb-3">
            <label>Bio</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="form-control futuristic-input"
              rows="3"
              placeholder="Describe your role on the ship"
            />
          </div>

          <button className="btn futuristic-btn w-100 mt-2" type="submit">
            ENLIST
          </button>
        </form>

        <p className="mt-3 text-center">
          Already crew? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
