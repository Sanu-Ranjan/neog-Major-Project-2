import { useNavigate, useSearchParams } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";
import { LeadFilters } from "../components/LeadFilters";

export const LeadList = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { data: agents, loading: agentsLoading, error: agentsError } = useGet(API_ROUTES.agents.getAll);

  const leadsUrl = `${API_ROUTES.leads.getAll}?${searchParams.toString()}`;
  const { data: leads, loading: leadsLoading, error: leadsError } = useGet(leadsUrl);

  const loading = agentsLoading || leadsLoading;
  const error = agentsError || leadsError;

  if (loading && !agents.length) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Lead List</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h6 className="mb-0">All Leads</h6>
          <button className="btn btn-primary btn-sm" onClick={() => navigate(ROUTES.LEAD_NEW)}>
            + Add New Lead
          </button>
        </div>

        <LeadFilters agents={agents} showPriority={false} />

        <div className="card">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead className="table-light">
                <tr>
                  <th>Lead Name</th>
                  <th>Status</th>
                  <th>Sales Agent</th>
                  <th>Priority</th>
                  <th>Time to Close</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr><td colSpan={5} className="text-muted text-center py-3">No leads found.</td></tr>
                ) : (
                  leads.map((lead) => (
                    <tr
                      key={lead._id}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate(ROUTES.LEAD_DETAIL(lead._id))}
                    >
                      <td className="fw-semibold">{lead.name}</td>
                      <td><span className="badge bg-secondary">{lead.status}</span></td>
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
      </Sidebar>
    </div>
  );
};
