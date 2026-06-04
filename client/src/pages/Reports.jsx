import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export const Reports = () => {
  const { data: closedByAgent, loading: l1, error: e1 } = useGet(API_ROUTES.reports.closedByAgent);
  const { data: statusDist,    loading: l2, error: e2 } = useGet(API_ROUTES.reports.statusDistribution);
  const { data: lastWeek,      loading: l3, error: e3 } = useGet(API_ROUTES.reports.lastWeek);
  const { data: pipeline,      loading: l4, error: e4 } = useGet(API_ROUTES.reports.pipeline);

  const loading = l1 || l2 || l3 || l4;
  const error = e1 || e2 || e3 || e4;

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  const barData = {
    labels: closedByAgent.map((a) => a.agentName),
    datasets: [{ label: "Closed Leads", data: closedByAgent.map((a) => a.count), backgroundColor: "#3b82f6" }],
  };

  const closedCount = statusDist.find((s) => s.status === "Closed")?.count || 0;
  const inPipelineCount = statusDist.filter((s) => s.status !== "Closed").reduce((sum, s) => sum + s.count, 0);

  const closedVsPipelineData = {
    labels: ["Closed", "In Pipeline"],
    datasets: [{ data: [closedCount, inPipelineCount], backgroundColor: ["#10b981", "#f59e0b"] }],
  };

  const statusDistData = {
    labels: statusDist.map((s) => s.status),
    datasets: [{ data: statusDist.map((s) => s.count), backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"] }],
  };

  const lastWeekGrouped = lastWeek.reduce((acc, lead) => {
    const name = lead.salesAgent?.name || "Unknown";
    acc[name] = (acc[name] || 0) + 1;
    return acc;
  }, {});

  const lastWeekData = {
    labels: Object.keys(lastWeekGrouped),
    datasets: [{ label: "Closed Last 7 Days", data: Object.values(lastWeekGrouped), backgroundColor: "#8b5cf6" }],
  };

  const pipelineData = {
    labels: pipeline.byStatus.map((s) => s.status),
    datasets: [{ label: "Open Leads", data: pipeline.byStatus.map((s) => s.count), backgroundColor: "#f59e0b" }],
  };

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Reports</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <h6 className="mb-3">Closed Leads by Agent</h6>
        <div className="mb-5" style={{ maxWidth: 600 }}><Bar data={barData} /></div>

        <h6 className="mb-3">Closed vs In Pipeline</h6>
        <div className="mb-5" style={{ maxWidth: 350 }}><Pie data={closedVsPipelineData} /></div>

        <h6 className="mb-3">Status Distribution</h6>
        <div className="mb-5" style={{ maxWidth: 350 }}><Pie data={statusDistData} /></div>

        <h6 className="mb-3">Closed Last 7 Days by Agent</h6>
        <div className="mb-5" style={{ maxWidth: 600 }}>
          {lastWeek.length === 0
            ? <p className="text-muted small">No leads closed in the last 7 days.</p>
            : <Bar data={lastWeekData} />
          }
        </div>

        <h6 className="mb-3">Pipeline by Status</h6>
        <div style={{ maxWidth: 600 }}><Bar data={pipelineData} /></div>
      </Sidebar>
    </div>
  );
};
