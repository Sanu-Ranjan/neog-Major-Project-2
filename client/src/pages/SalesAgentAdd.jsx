import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { post } from "../api/client";
import { Sidebar } from "../components/Sidebar";
import { toast } from "react-toastify";

export const SalesAgentAdd = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await post(API_ROUTES.agents.add, form);
      toast.success("Agent added successfully!");
      navigate(ROUTES.AGENTS);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Sales Agent Management</h5>

      <Sidebar backTo={ROUTES.AGENTS} backLabel="Back to Agents">
        <div className="card">
          <div className="card-body">
            <h6 className="card-title mb-4">Add New Agent</h6>
            <form onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-12 col-md-6">
                  <label className="form-label">Name</label>
                  <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} required />
                </div>
                <div className="col-12 col-md-6">
                  <label className="form-label">Email</label>
                  <input type="email" name="email" className="form-control" value={form.email} onChange={handleChange} required />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Adding..." : "Add Agent"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
