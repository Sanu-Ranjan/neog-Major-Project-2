import React, { useState, useEffect } from "react";
import { ROUTES_DEFINITION } from "./constants/appRoutes";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Dashboard } from "./pages/Dashboard";
import { LeadAdd } from "./pages/LeadAdd";
import { LeadList } from "./pages/LeadList";
import { LeadManagement } from "./pages/LeadManagement";
import { LeadStatus } from "./pages/LeadStatus";
import { Reports } from "./pages/Reports";
import { SalesAgentList } from "./pages/SalesAgentList";
import { SalesAgentView } from "./pages/SalesAgentView";
import { SalesAgentAdd } from "./pages/SalesAgentAdd";
import { Settings } from "./pages/Settings";

const router = createBrowserRouter([
  {
    path: ROUTES_DEFINITION.DASHBOARD,
    element: <Dashboard />,
  },
  {
    path: ROUTES_DEFINITION.LEADS,
    element: <LeadList />,
  },
  {
    path: ROUTES_DEFINITION.LEAD_DETAIL,
    element: <LeadManagement />,
  },
  {
    path: ROUTES_DEFINITION.LEAD_NEW,
    element: <LeadAdd />,
  },
  {
    path: ROUTES_DEFINITION.AGENTS,
    element: <SalesAgentList />,
  },
  {
    path: ROUTES_DEFINITION.LEADS_BY_AGENT,
    element: <SalesAgentView />,
  },
  {
    path: ROUTES_DEFINITION.AGENT_NEW,
    element: <SalesAgentAdd />,
  },
  {
    path: ROUTES_DEFINITION.LEADS_BY_STATUS,
    element: <LeadStatus />,
  },
  {
    path: ROUTES_DEFINITION.REPORTS,
    element: <Reports />,
  },
  {
    path: ROUTES_DEFINITION.SETTINGS,
    element: <Settings />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
