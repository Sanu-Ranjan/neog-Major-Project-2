import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/appRoutes";
import { API_ROUTES } from "../constants/apiRoutes";
import { useGet } from "../hooks/useGet";
import { DashboardSidebar } from "../components/DashboardSidebar";

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

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Anvaya CRM Dashboard</h5>

      <DashboardSidebar>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            <h6 className="mb-2">Recent Leads</h6>
            <div className="d-flex gap-2 mb-4 flex-wrap">
              {recentLeads.slice(0, 3).map((lead) => (
                <div
                  key={lead._id}
                  className="border rounded p-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate(ROUTES.LEAD_DETAIL(lead._id))}
                >
                  <div className="fw-semibold">{lead.name}</div>
                  <div className="small text-muted">{lead.status}</div>
                </div>
              ))}
            </div>

            <h6 className="mb-2">Lead Status</h6>
            <div className="mb-4">
              {STATUSES.map((status) => {
                const found = pipeline.find((p) => p.status === status);
                return (
                  <div key={status} className="border-bottom py-1">
                    {status}: <strong>{found ? found.count : 0}</strong> Leads
                  </div>
                );
              })}
            </div>

            <h6 className="mb-2">Quick Filters</h6>
            <div className="d-flex gap-2 mb-4 flex-wrap">
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

            <button className="btn btn-primary" onClick={() => navigate(ROUTES.LEAD_NEW)}>
              + Add New Lead
            </button>
          </>
        )}
      </DashboardSidebar>
    </div>
  );
};
