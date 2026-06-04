import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/appRoutes";

export const DashboardSidebar = ({ children }) => {
  const navigate = useNavigate();

  const links = [
    { label: "Leads", route: ROUTES.LEADS },
    { label: "Sales Agents", route: ROUTES.AGENTS },
    { label: "Reports", route: ROUTES.REPORTS },
    { label: "Settings", route: ROUTES.SETTINGS },
  ];

  return (
    <>
      {/* Mobile top nav */}
      <nav className="d-flex d-md-none gap-3 p-2 border-bottom overflow-auto">
        {links.map((l) => (
          <button
            key={l.label}
            className="btn btn-link p-0 text-nowrap"
            onClick={() => navigate(l.route)}
          >
            {l.label}
          </button>
        ))}
      </nav>

      <div className="row">
        {/* Desktop sidebar */}
        <div className="col-md-2 border-end d-none d-md-flex flex-column gap-2 p-3" style={{ minHeight: "100vh" }}>
          {links.map((l) => (
            <button
              key={l.label}
              className="btn btn-link p-0 text-start"
              onClick={() => navigate(l.route)}
            >
              {l.label}
            </button>
          ))}
        </div>

        {/* Main content */}
        <div className="col-12 col-md-10 p-3">
          {children}
        </div>
      </div>
    </>
  );
};
