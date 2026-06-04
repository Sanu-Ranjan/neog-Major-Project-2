import { useSearchParams } from "react-router-dom";

const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
const PRIORITIES = ["High", "Medium", "Low"];

export const LeadFilters = ({
  agents = [],
  showStatus = true,
  showAgent = true,
  showPriority = true,
  showSort = true,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const set = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    setSearchParams(next);
  };

  return (
    <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
      {showStatus && (
        <select
          className="form-select form-select-sm w-auto"
          value={searchParams.get("status") || ""}
          onChange={(e) => set("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      )}

      {showAgent && (
        <select
          className="form-select form-select-sm w-auto"
          value={searchParams.get("salesAgent") || ""}
          onChange={(e) => set("salesAgent", e.target.value)}
        >
          <option value="">All Agents</option>
          {agents.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
        </select>
      )}

      {showPriority && (
        <select
          className="form-select form-select-sm w-auto"
          value={searchParams.get("priority") || ""}
          onChange={(e) => set("priority", e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      )}

      {showSort && (
        <>
          <select
            className="form-select form-select-sm w-auto"
            value={searchParams.get("sortBy") || "createdAt"}
            onChange={(e) => set("sortBy", e.target.value)}
          >
            <option value="createdAt">Sort by Default</option>
            <option value="priority">Sort by Priority</option>
            <option value="timeToClose">Sort by Time to Close</option>
          </select>

          <select
            className="form-select form-select-sm w-auto"
            value={searchParams.get("order") || "asc"}
            onChange={(e) => set("order", e.target.value)}
          >
            <option value="asc">↑ Asc</option>
            <option value="desc">↓ Desc</option>
          </select>
        </>
      )}
    </div>
  );
};
