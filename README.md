# Anvaya CRM

A full-stack CRM for managing sales leads through a defined pipeline. Built as a portfolio project to demonstrate relational data modeling in MongoDB, URL-driven filtering, MongoDB aggregation for reporting, and Chart.js data visualization.

## Tech Stack

- **Frontend:** React, React Router, React Bootstrap 5, Chart.js (via react-chartjs-2), Axios
- **Backend:** Node.js, Express , Mongoose 
- **Database:** MongoDB (Hosted on VPS)

## Features

- Lead CRUD with assignment, status workflow, priority, tags, time-to-close
- Sales agents directory
- Comments / activity log per lead (with author + timestamp)
- URL-based filtering (`/leads?status=Qualified&salesAgent=...`)
- Grouped views (leads by status, leads by sales agent)
- Reports dashboard with 4 visualizations
  - Closed last 7 days vs. in pipeline (pie chart)
  - Lead status distribution (pie chart)
  - Leads closed by sales agent (bar chart)
  - Summary stat cards
- Auto-set `closedAt` when a lead's status flips to `Closed`

## API Quick Reference

| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/leads`                     | List leads (filters: `status`, `salesAgent`, `source`, `tags`, `sortBy`, `order`) |
| POST   | `/leads`                     | Create a lead                        |
| GET    | `/leads/:id`                 | Get a single lead                    |
| PATCH  | `/leads/:id`                 | Partial update                       |
| DELETE | `/leads/:id`                 | Delete                               |
| GET    | `/leads/:id/comments`        | List comments for a lead             |
| POST   | `/leads/:id/comments`        | Add comment                          |
| GET    | `/agents`                    | List sales agents                    |
| POST   | `/agents`                    | Create agent                         |
| GET    | `/tags`                      | List tags                            |
| GET    | `/report/last-week`          | Leads closed in the last 7 days      |
| GET    | `/report/pipeline`           | Pipeline counts grouped by status    |
| GET    | `/report/closed-by-agent`    | Closed counts grouped by agent       |
| GET    | `/report/status-distribution`| All statuses with counts             |

## Design Decisions

- **PATCH over PUT** for lead updates. The original spec showed both; PATCH matches the actual use case where you usually update only a status or an agent.
- **`closedAt` auto-set** in the Mongoose `pre('save')` hook. Without this, the "leads closed last week" report can't work.
- **Aggregation pipelines** for reports rather than fetching everything and reducing client-side. The `/report/closed-by-agent` endpoint uses `$match`, `$group`, and `$lookup` to join `salesagents`.

## Known Limitations (a.k.a. "Future Work")

- No authentication. Every endpoint is public.
- No pagination on `GET /leads`. Would be needed past a few thousand leads.
- Comment author defaults to the lead's assigned agent because there's no concept of "logged-in user".

## Screenshots
