const STATUSES = ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"];
const PRIORITIES = ["High", "Medium", "Low"];

export const LeadFilters = ({
  agents = [],
  showStatus = true,
  showAgent = true,
  showPriority = true,
  showSort = true,
  selectedStatus,
  setSelectedStatus,
  selectedAgent,
  setSelectedAgent,
  selectedPriority,
  setSelectedPriority,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  return (
    <div className="d-flex gap-2 mb-3 align-items-center flex-wrap">
      {showStatus && setSelectedStatus && (
        <select
          className="form-select form-select-sm w-auto"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      )}

      {showAgent && setSelectedAgent && (
        <select
          className="form-select form-select-sm w-auto"
          value={selectedAgent}
          onChange={(e) => setSelectedAgent(e.target.value)}
        >
          <option value="">All Agents</option>
          {agents.map((a) => (
            <option key={a._id} value={a._id}>{a.name}</option>
          ))}
        </select>
      )}

      {showPriority && setSelectedPriority && (
        <select
          className="form-select form-select-sm w-auto"
          value={selectedPriority}
          onChange={(e) => setSelectedPriority(e.target.value)}
        >
          <option value="">All Priorities</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>{p}</option>
          ))}
        </select>
      )}

      {showSort && setSortBy && (
        <select
          className="form-select form-select-sm w-auto"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="createdAt">Sort by Default</option>
          <option value="priority">Sort by Priority</option>
          <option value="timeToClose">Sort by Time to Close</option>
        </select>
      )}

      {showSort && setSortOrder && (
        <select
          className="form-select form-select-sm w-auto"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="asc">↑ Asc</option>
          <option value="desc">↓ Desc</option>
        </select>
      )}
    </div>
  );
};
