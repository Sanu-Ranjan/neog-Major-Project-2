import { useParams, useSearchParams } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";
import { LeadFilters } from "../components/LeadFilters";
import { LeadRow } from "../components/LeadRow";

export const SalesAgentView = () => {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();

  const { data: agent, loading: agentLoading, error: agentError } = useGet(API_ROUTES.agents.getById(agentId));

  const leadsUrl = `${API_ROUTES.leads.getAll}?salesAgent=${agentId}&sortBy=timeToClose&${searchParams.toString()}`;
  const { data: leads, loading: leadsLoading, error: leadsError } = useGet(leadsUrl);

  const loading = agentLoading || leadsLoading;
  const error = agentError || leadsError;

  if (loading && !agent) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Leads by Sales Agent</h5>

      <Sidebar backTo={ROUTES.AGENTS} backLabel="Back to Agents">
        <h6 className="border-bottom pb-2 mb-3">
          Sales Agent: {agent.name}
          <span className="text-muted ms-2 fw-normal small">({agent.email})</span>
        </h6>

        <LeadFilters showAgent={false} showSort={false} />

        {leads.length === 0 ? (
          <p className="text-muted small">No leads found.</p>
        ) : (
          leads.map((lead) => <LeadRow key={lead._id} lead={lead} />)
        )}
      </Sidebar>
    </div>
  );
};
