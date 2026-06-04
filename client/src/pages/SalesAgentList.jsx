import { useNavigate, Link } from "react-router-dom";
import { API_ROUTES } from "../constants/apiRoutes";
import { ROUTES } from "../constants/appRoutes";
import { useGet } from "../hooks/useGet";
import { Sidebar } from "../components/Sidebar";

export const SalesAgentList = () => {
  const { data: agents, loading, error } = useGet(API_ROUTES.agents.getAll);
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  return (
    <div className="container-fluid">
      <h5 className="p-3 border-bottom text-center">Sales Agent Management</h5>

      <Sidebar backTo={ROUTES.DASHBOARD} backLabel="Back to Dashboard">
        <h6 className="mb-3">Sales Agent List</h6>

        {agents.map((agent) => (
          <div key={agent._id} className="border-bottom py-2">
            <Link to={ROUTES.LEADS_BY_AGENT(agent._id)} className="text-decoration-none">
              Agent: {agent.name} - {agent.email}
            </Link>
          </div>
        ))}

        <button className="btn btn-primary mt-3" onClick={() => navigate(ROUTES.AGENT_NEW)}>
          + Add New Agent
        </button>
      </Sidebar>
    </div>
  );
};
