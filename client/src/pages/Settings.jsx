import { useState } from "react";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { del } from "../api/client";
import { Sidebar } from "../components/Sidebar";

export const Settings = () => {
  const [view, setView] = useState("agents");
  const [search, setSearch] = useState("");
  const [agentError, setAgentError] = useState(null);
  const [leadError, setLeadError] = useState(null);

  const { data: agents, loading: agentsLoading, error: agentsFetchError, setData: setAgents } = useGet(API_ROUTES.agents.getAll);
  const { data: leads, loading: leadsLoading, error: leadsFetchError, setData: setLeads } = useGet(API_ROUTES.leads.getAll);

  const loading = agentsLoading || leadsLoading;
  const fetchError = agentsFetchError || leadsFetchError;

  const handleDeleteAgent = async (id) => {
    setAgentError(null);
    try {
      await del(API_ROUTES.agents.delete(id));
      setAgents(agents.filter((a) => a._id !== id));
    } catch (err) {
      setAgentError(err.message);
    }
  };

  const handleDeleteLead = async (id) => {
    setLeadError(null);
    try {
      await del(API_ROUTES.leads.delete(id));
      setLeads(leads.filter((l) => l._id !== id));
    } catch (err) {
      setLeadError(err.message);
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

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p className="text-danger">Error: {fetchError}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Settings</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
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
          style={{ maxWidth: 400 }}
          placeholder={view === "agents" ? "Search by name or email..." : "Search by lead name or agent..."}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Agents */}
        {view === "agents" && (
          <>
            {agentError && <p className="text-danger">{agentError}</p>}
            {filteredAgents.length === 0 ? (
              <p className="text-muted small">No agents found.</p>
            ) : (
              filteredAgents.map((agent) => (
                <div key={agent._id} className="border-bottom py-2 d-flex justify-content-between align-items-center">
                  <span>{agent.name} — {agent.email}</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteAgent(agent._id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        )}

        {/* Leads */}
        {view === "leads" && (
          <>
            {leadError && <p className="text-danger">{leadError}</p>}
            {filteredLeads.length === 0 ? (
              <p className="text-muted small">No leads found.</p>
            ) : (
              filteredLeads.map((lead) => (
                <div key={lead._id} className="border-bottom py-2 d-flex justify-content-between align-items-center">
                  <span>{lead.name} — {lead.status} — {lead.salesAgent?.name}</span>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteLead(lead._id)}>
                    Delete
                  </button>
                </div>
              ))
            )}
          </>
        )}
      </Sidebar>
    </div>
  );
};
