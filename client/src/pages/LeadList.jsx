import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";
import { LeadFilters } from "../components/LeadFilters";
import { LeadRow } from "../components/LeadRow";

export const LeadList = () => {
  const navigate = useNavigate();
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: agents, loading: agentsLoading, error: agentsError } = useGet(API_ROUTES.agents.getAll);

  const leadsUrl = `${API_ROUTES.leads.getAll}?${selectedStatus ? `&status=${selectedStatus}` : ""}${selectedAgent ? `&salesAgent=${selectedAgent}` : ""}&sortBy=${sortBy}&order=${sortOrder}`;
  const { data: leads, loading: leadsLoading, error: leadsError } = useGet(leadsUrl);

  const loading = agentsLoading || leadsLoading;
  const error = agentsError || leadsError;

  if (loading && !agents.length) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Lead List</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <LeadFilters
          agents={agents}
          showPriority={false}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {leads.length === 0 ? (
          <p className="text-muted small">No leads found.</p>
        ) : (
          leads.map((lead) => <LeadRow key={lead._id} lead={lead} />)
        )}

        <button className="btn btn-primary mt-3" onClick={() => navigate(ROUTES.LEAD_NEW)}>
          + Add New Lead
        </button>
      </Sidebar>
    </div>
  );
};
