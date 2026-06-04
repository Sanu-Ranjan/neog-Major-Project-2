import { useState } from "react";
import { useParams } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";
import { LeadFilters } from "../components/LeadFilters";
import { LeadRow } from "../components/LeadRow";

export const LeadStatus = () => {
  const { status } = useParams();
  const [selectedAgent, setSelectedAgent] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const { data: agents, loading: agentsLoading, error: agentsError } = useGet(API_ROUTES.agents.getAll);

  const leadsUrl = `${API_ROUTES.leads.getAll}?status=${status}${selectedAgent ? `&salesAgent=${selectedAgent}` : ""}${selectedPriority ? `&priority=${selectedPriority}` : ""}&sortBy=timeToClose&order=${sortOrder}`;
  const { data: leads, loading: leadsLoading, error: leadsError } = useGet(leadsUrl);

  const loading = agentsLoading || leadsLoading;
  const error = agentsError || leadsError;

  if (loading && !agents.length) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Leads by Status</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <h6 className="border-bottom pb-2 mb-3">Status: {status}</h6>

        <LeadFilters
          agents={agents}
          showStatus={false}
          showSort={false}
          selectedAgent={selectedAgent}
          setSelectedAgent={setSelectedAgent}
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
        />

        {leads.length === 0 ? (
          <p className="text-muted small">No leads found.</p>
        ) : (
          leads.map((lead) => <LeadRow key={lead._id} lead={lead} />)
        )}
      </Sidebar>
    </div>
  );
};
