import { useNavigate } from "react-router-dom";

export const Sidebar = ({ backTo, backLabel, children }) => {
  const navigate = useNavigate();

  return (
    <>
      {/* Mobile top bar */}
      <div className="d-flex d-md-none align-items-center p-2 border-bottom">
        <button
          className="btn btn-sm btn-outline-secondary"
          onClick={() => navigate(backTo)}
        >
          ← {backLabel}
        </button>
      </div>

      <div className="row g-0">
        {/* Desktop sidebar */}
        <div
          className="col-md-2 d-none d-md-block border-end bg-light"
          style={{ minHeight: "100vh" }}
        >
          <div className="pt-3">
            <button
              className="d-block w-100 text-start px-4 py-2 bg-transparent border-0 text-secondary fw-medium"
              style={{ fontSize: "14px" }}
              onClick={() => navigate(backTo)}
            >
              ← {backLabel}
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="col-12 col-md-10 p-3">{children}</div>
      </div>
    </>
  );
};
