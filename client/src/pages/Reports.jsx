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
import { useGet } from "../hooks/useGet";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

const chartOptions = { responsive: true, maintainAspectRatio: false };

const ChartCard = ({ title, children }) => (
  <div className="card h-100">
    <div className="card-body">
      <h6 className="card-title">{title}</h6>
      <div style={{ position: "relative", height: 300 }}>{children}</div>
    </div>
  </div>
);

export const Reports = () => {
  const { data: closedByAgent, loading: l1, error: e1 } = useGet(API_ROUTES.reports.closedByAgent);
  const { data: statusDist,    loading: l2, error: e2 } = useGet(API_ROUTES.reports.statusDistribution);
  const { data: lastWeek,      loading: l3, error: e3 } = useGet(API_ROUTES.reports.lastWeek);
  const { data: pipeline,      loading: l4, error: e4 } = useGet(API_ROUTES.reports.pipeline);

  const loading = l1 || l2 || l3 || l4;
  const error = e1 || e2 || e3 || e4;

  if (loading) return <p className="p-3">Loading...</p>;
  if (error) return <p className="p-3 text-danger">Error: {error}</p>;

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
    <div className="p-3">
      <h5 className="mb-4">Reports</h5>
      <div className="row g-3">
        <div className="col-12 col-lg-6">
          <ChartCard title="Closed Leads by Agent">
            <Bar data={barData} options={chartOptions} />
          </ChartCard>
        </div>
        <div className="col-12 col-lg-6">
          <ChartCard title="Pipeline by Status">
            <Bar data={pipelineData} options={chartOptions} />
          </ChartCard>
        </div>
        <div className="col-12 col-lg-6">
          <ChartCard title="Closed Last 7 Days by Agent">
            {lastWeek.length === 0 ? (
              <p className="text-muted small">No leads closed in the last 7 days.</p>
            ) : (
              <Bar data={lastWeekData} options={chartOptions} />
            )}
          </ChartCard>
        </div>
        <div className="col-12 col-lg-6">
          <ChartCard title="Closed vs In Pipeline">
            <Pie data={closedVsPipelineData} options={chartOptions} />
          </ChartCard>
        </div>
        <div className="col-12 col-lg-6">
          <ChartCard title="Status Distribution">
            <Pie data={statusDistData} options={chartOptions} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
};
