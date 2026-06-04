import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/appRoutes";

export const Sidebar = ({ backTo, backLabel, children }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile top bar */}
      <div className="d-flex d-md-none justify-content-between align-items-center p-2 border-bottom">
        <button
          className="btn btn-link p-0"
          onClick={() => navigate(backTo)}
        >
          ← {backLabel}
        </button>
      </div>

      <div className="row">
        {/* Desktop sidebar */}
        <div className="col-md-2 border-end d-none d-md-flex flex-column gap-2 p-3" style={{ minHeight: "100vh" }}>
          <button
            className="btn btn-link p-0 text-start"
            onClick={() => navigate(backTo)}
          >
            ← {backLabel}
          </button>
        </div>

        {/* Main content */}
        <div className="col-12 col-md-10 p-3">
          {children}
        </div>
      </div>
    </>
  );
};
