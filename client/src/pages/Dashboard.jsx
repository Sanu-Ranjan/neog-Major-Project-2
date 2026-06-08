import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/appRoutes";
import { API_ROUTES } from "../constants/apiRoutes";
import { useGet } from "../hooks/useGet";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];

export const Dashboard = () => {
  const navigate = useNavigate();

  const { data: recentLeads, loading: leadsLoading } = useGet(
    `${API_ROUTES.leads.getAll}?sortBy=createdAt&order=desc`,
  );
  const { data: pipeline, loading: pipelineLoading } = useGet(
    API_ROUTES.reports.statusDistribution,
  );

  const loading = leadsLoading || pipelineLoading;

  if (loading) return <p className="p-3">Loading...</p>;

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="mb-0">Dashboard</h5>
        <button className="btn btn-primary btn-sm" onClick={() => navigate(ROUTES.LEAD_NEW)}>
          + Add New Lead
        </button>
      </div>

      <h6 className="mb-3">Recent Leads</h6>
      <div className="row g-3 mb-4">
        {recentLeads.slice(0, 3).map((lead) => (
          <div className="col-12 col-md-4" key={lead._id}>
            <div
              className="card h-100"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(ROUTES.LEAD_DETAIL(lead._id))}
            >
              <div className="card-body">
                <div className="fw-semibold mb-1">{lead.name}</div>
                <span className="badge bg-secondary">{lead.status}</span>
                <div className="small text-muted mt-2">
                  {lead.salesAgent?.name} · {lead.priority} priority
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <h6 className="mb-3">Lead Status</h6>
      <div className="row g-3 mb-4">
        {STATUSES.map((status) => {
          const found = pipeline.find((p) => p.status === status);
          return (
            <div className="col-6 col-md" key={status}>
              <div
                className="card h-100"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(ROUTES.LEADS_BY_STATUS(status))}
              >
                <div className="card-body text-center">
                  <div className="text-muted small">{status}</div>
                  <div className="fs-3 fw-bold">{found ? found.count : 0}</div>
                  <div className="small text-secondary">leads</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <h6 className="mb-3">Quick Filters</h6>
      <div className="d-flex gap-2 flex-wrap">
        {STATUSES.map((status) => (
          <button
            key={status}
            className="btn btn-outline-secondary btn-sm"
            onClick={() => navigate(ROUTES.LEADS_BY_STATUS(status))}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
};
