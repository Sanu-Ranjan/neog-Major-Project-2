import { useNavigate, useSearchParams } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";
import { LeadFilters } from "../components/LeadFilters";
import { LeadRow } from "../components/LeadRow";

export const LeadList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: agents, loading: agentsLoading, error: agentsError } = useGet(API_ROUTES.agents.getAll);

  const leadsUrl = `${API_ROUTES.leads.getAll}?${searchParams.toString()}`;
  const { data: leads, loading: leadsLoading, error: leadsError } = useGet(leadsUrl);

  const loading = agentsLoading || leadsLoading;
  const error = agentsError || leadsError;

  if (loading && !agents.length) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Lead List</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <LeadFilters agents={agents} showPriority={false} />

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
