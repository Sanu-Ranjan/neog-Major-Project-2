import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";
import { LeadFilters } from "../components/LeadFilters";

export const SalesAgentView = () => {
  const { agentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    data: agent,
    loading: agentLoading,
    error: agentError,
  } = useGet(API_ROUTES.agents.getById(agentId));
  const leadsUrl = `${API_ROUTES.leads.getAll}?salesAgent=${agentId}&${searchParams.toString()}`;
  const {
    data: leads,
    loading: leadsLoading,
    error: leadsError,
  } = useGet(leadsUrl);

  const loading = agentLoading || leadsLoading;
  const error = agentError || leadsError;

  if (loading && !agent) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Leads by Sales Agent</h5>

      <Sidebar backTo={ROUTES.AGENTS} backLabel="Back to Agents">
        <div className="card mb-3 p-3">
          <div className="fw-semibold">{agent.name}</div>
          <div className="text-muted small">{agent.email}</div>
        </div>

        <LeadFilters showAgent={false} showSort={false} />

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Lead Name</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Time to Close</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-muted text-center py-3">
                      No leads found.
                    </td>
                  </tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(ROUTES.LEAD_DETAIL(lead._id))}
                    >
                      <td className="fw-semibold">{lead.name}</td>
                      <td>
                        <span className="badge bg-secondary">
                          {lead.status}
                        </span>
                      </td>
                      <td>{lead.priority}</td>
                      <td>{lead.timeToClose} days</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Sidebar>
    </div>
  );
};
