import { NavLink, Outlet } from "react-router-dom";
import { ROUTES } from "../constants/appRoutes";

const links = [
  { label: "Dashboard", route: ROUTES.DASHBOARD },
  { label: "Leads", route: ROUTES.LEADS },
  { label: "Sales Agents", route: ROUTES.AGENTS },
  { label: "Reports", route: ROUTES.REPORTS },
  { label: "Settings", route: ROUTES.SETTINGS },
];

export const Layout = () => {
  return (
    <>
      {/* Mobile top nav — outside the grid */}
      <nav className="d-flex d-md-none gap-2 p-2 border-bottom overflow-auto flex-wrap">
        {links.map((l) => (
          <NavLink
            key={l.label}
            to={l.route}
            end={l.route === ROUTES.DASHBOARD}
            className={({ isActive }) =>
              `btn btn-sm ${isActive ? "btn-primary" : "btn-outline-secondary"} text-nowrap`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>

      <div className="row g-0" style={{ minHeight: "100vh" }}>
        {/* Desktop sidebar */}
        <div
          className="col-md-2 d-none d-md-flex flex-column border-end bg-light"
          style={{ minHeight: "100vh" }}
        >
          <div className="px-4 py-4 border-bottom">
            <span className="fw-bold text-dark" style={{ fontSize: "15px" }}>
              Anvaya
            </span>
            <span className="text-secondary ms-1" style={{ fontSize: "12px" }}>
              CRM
            </span>
          </div>
          <nav className="flex-column mt-2">
            {links.map((l) => (
              <NavLink
                key={l.label}
                to={l.route}
                end={l.route === ROUTES.DASHBOARD}
                className={({ isActive }) =>
                  `d-block px-4 py-2 text-decoration-none border-start border-3 ${
                    isActive
                      ? "text-primary fw-semibold border-primary"
                      : "text-secondary border-transparent"
                  }`
                }
                style={{ fontSize: "14px" }}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Main content */}
        <div className="col-12 col-md-10">
          <Outlet />
        </div>
      </div>
    </>
  );
};
