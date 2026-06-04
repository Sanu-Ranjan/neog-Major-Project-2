import { Link } from "react-router-dom";
import { ROUTES } from "../constants/appRoutes";

export const LeadRow = ({ lead }) => {
  return (
    <div className="border-bottom py-2">
      <Link to={ROUTES.LEAD_DETAIL(lead._id)} className="text-decoration-none">
        {lead.name}
      </Link>
      {" "}- {lead.status} - {lead.salesAgent?.name} | Priority: {lead.priority} | {lead.timeToClose} days
    </div>
  );
};
