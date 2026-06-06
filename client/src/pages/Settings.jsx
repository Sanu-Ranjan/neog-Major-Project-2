import { useState } from "react";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { del } from "../api/client";
import { Sidebar } from "../components/Sidebar";
import { toast } from "react-toastify";

export const Settings = () => {
  const [view, setView] = useState("agents");
  const [search, setSearch] = useState("");

  const { data: agents, loading: agentsLoading, error: agentsFetchError, setData: setAgents } = useGet(API_ROUTES.agents.getAll);
  const { data: leads, loading: leadsLoading, error: leadsFetchError, setData: setLeads } = useGet(API_ROUTES.leads.getAll);

  const loading = agentsLoading || leadsLoading;
  const fetchError = agentsFetchError || leadsFetchError;

  const handleDeleteAgent = async (id) => {
    try {
      await del(API_ROUTES.agents.delete(id));
      setAgents(agents.filter((a) => a._id !== id));
      toast.success("Agent deleted.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    try {
      await del(API_ROUTES.leads.delete(id));
      setLeads(leads.filter((l) => l._id !== id));
      toast.success("Lead deleted.");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const filteredAgents = agents.filter((a) =>
    a.name.toLowerCase().includes(search.toLowerCase()) ||
    a.email.toLowerCase().includes(search.toLowerCase())
  );

  const filteredLeads = leads.filter((l) =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.salesAgent?.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <p className="p-3">Loading...</p>;
  if (fetchError) return <p className="p-3 text-danger">Error: {fetchError}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Settings</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <div className="card p-3">
          {/* Radio Toggle */}
          <div className="mb-3">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" id="viewAgents" value="agents"
                checked={view === "agents"} onChange={() => { setView("agents"); setSearch(""); }} />
              <label className="form-check-label" htmlFor="viewAgents">Sales Agents</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="radio" id="viewLeads" value="leads"
                checked={view === "leads"} onChange={() => { setView("leads"); setSearch(""); }} />
              <label className="form-check-label" htmlFor="viewLeads">Leads</label>
            </div>
          </div>

          {/* Search */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder={view === "agents" ? "Search by name or email..." : "Search by lead name or agent..."}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {/* Agents Table */}
          {view === "agents" && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAgents.length === 0 ? (
                    <tr><td colSpan={3} className="text-muted text-center py-3">No agents found.</td></tr>
                  ) : (
                    filteredAgents.map((agent) => (
                      <tr key={agent._id}>
                        <td>{agent.name}</td>
                        <td>{agent.email}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAgent(agent._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Leads Table */}
          {view === "leads" && (
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Status</th>
                    <th>Agent</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredLeads.length === 0 ? (
                    <tr><td colSpan={4} className="text-muted text-center py-3">No leads found.</td></tr>
                  ) : (
                    filteredLeads.map((lead) => (
                      <tr key={lead._id}>
                        <td>{lead.name}</td>
                        <td><span className="badge bg-secondary">{lead.status}</span></td>
                        <td>{lead.salesAgent?.name}</td>
                        <td>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLead(lead._id)}>
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Sidebar>
    </div>
  );
};
