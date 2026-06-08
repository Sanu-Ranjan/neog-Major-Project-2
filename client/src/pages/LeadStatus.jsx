import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { LeadFilters } from "../components/LeadFilters";

export const LeadStatus = () => {
  const { status } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const { data: agents, loading: agentsLoading, error: agentsError } = useGet(API_ROUTES.agents.getAll);
  const leadsUrl = `${API_ROUTES.leads.getAll}?status=${status}&${searchParams.toString()}`;
  const { data: leads, loading: leadsLoading, error: leadsError } = useGet(leadsUrl);

  const loading = agentsLoading || leadsLoading;
  const error = agentsError || leadsError;

  if (loading && !agents.length) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">Error: {error}</p>;

  return (
    <div className="p-3">
      <h5 className="mb-3">Leads by Status</h5>
      <div className="mb-3">
        <span className="badge bg-primary fs-6">Status: {status}</span>
      </div>

      <LeadFilters agents={agents} showStatus={false} showSort={false} />

      <div className="card">
        <div className="table-responsive">
          <table className="table table-hover mb-0">
            <thead className="table-light">
              <tr>
                <th>Lead Name</th>
                <th>Sales Agent</th>
                <th>Priority</th>
                <th>Time to Close</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr><td colSpan={4} className="text-muted text-center py-3">No leads found.</td></tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead._id} style={{ cursor: "pointer" }} onClick={() => navigate(ROUTES.LEAD_DETAIL(lead._id))}>
                    <td className="fw-semibold">{lead.name}</td>
                    <td>{lead.salesAgent?.name}</td>
                    <td>{lead.priority}</td>
                    <td>{lead.timeToClose} days</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
