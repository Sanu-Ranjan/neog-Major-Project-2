import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { post } from "../api/client";
import { Sidebar } from "../components/Sidebar";

export const SalesAgentAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await post(API_ROUTES.agents.add, form);
      navigate(ROUTES.AGENTS);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Sales Agent Management</h5>

      <Sidebar backTo={ROUTES.AGENTS} backLabel="Back to Agents">
        <h6 className="mb-3">Add New Agent</h6>

        {error && <p className="text-danger">{error}</p>}

        <form onSubmit={handleSubmit} style={{ maxWidth: 400 }}>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Adding..." : "Add Agent"}
          </button>
        </form>
      </Sidebar>
    </div>
  );
};
