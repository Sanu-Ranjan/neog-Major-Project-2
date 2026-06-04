# Anvaya CRM
 
A full-stack CRM for managing sales leads through a defined pipeline. Built as a portfolio project to demonstrate relational data modeling in MongoDB, MongoDB aggregation for reporting, Chart.js data visualization, and self-hosted deployment on a VPS.
 
## Tech Stack
 
- **Frontend:** React 19, React Router 7, Bootstrap 5 (via CDN), Chart.js + react-chartjs-2, native `fetch`
- **Backend:** Node.js, Express 4, Mongoose 8
- **Database:** MongoDB (self-hosted on VPS)
- **Infrastructure:** Hostinger VPS (Ubuntu LTS), Nginx reverse proxy, PM2, Let's Encrypt via Certbot
- **CI/CD:** GitHub Actions — auto-deploys on push to `main`
## Features
 
- Lead CRUD with assignment, status workflow, priority, tags, time-to-close
- Sales agents directory (with delete)
- Comments / activity log per lead (with author + timestamp)
- Path-based URL routing for status and agent views (`/leads/status/:status`, `/leads/by-agent/:agentId`)
- Filterable & sortable lead list (status, agent, source, priority, sort by field + order)
- Grouped views (leads by status, leads by sales agent)
- Settings page — search and delete agents or leads
- Reports dashboard with 5 visualizations:
  - Closed leads by sales agent (bar)
  - Closed vs in pipeline (pie)
  - Lead status distribution (pie)
  - Closed in last 7 days by agent (bar)
  - Pipeline by status (bar)
- Auto-set `closedAt` when a lead's status flips to `Closed` (via Mongoose `pre('save')` hook)
## API Quick Reference
 
All endpoints are prefixed with `/anvaya/v1`.
 
| Method | Endpoint                     | Description                          |
|--------|------------------------------|--------------------------------------|
| GET    | `/leads`                     | List leads (filters: `status`, `salesAgent`, `source`, `priority`, `tags`, `sortBy`, `order`) |
| POST   | `/leads`                     | Create a lead                        |
| GET    | `/leads/:id`                 | Get a single lead                    |
| PATCH  | `/leads/:id`                 | Partial update                       |
| DELETE | `/leads/:id`                 | Delete                               |
| GET    | `/leads/:id/comments`        | List comments for a lead             |
| POST   | `/leads/:id/comments`        | Add a comment                        |
| GET    | `/agents`                    | List sales agents                    |
| POST   | `/agents`                    | Create agent                         |
| GET    | `/agents/:id`                | Get a single agent                   |
| DELETE | `/agents/:id`                | Delete an agent                      |
| GET    | `/tags`                      | List tags                            |
| POST   | `/tags`                      | Create tag                           |
| GET    | `/report/last-week`          | Leads closed in the last 7 days      |
| GET    | `/report/pipeline`           | Pipeline counts grouped by status    |
| GET    | `/report/closed-by-agent`    | Closed counts grouped by agent       |
| GET    | `/report/status-distribution`| All statuses with counts             |
 
## Design Decisions
 
- PATCH over PUT for lead updates. PATCH matches the actual use case where you usually update only a status or an agent.
- closedAt auto-set via a Mongoose `pre('save')` hook. Without this, the "closed last week" report can't work. The hook also clears `closedAt` if the status moves back away from Closed.
- findById + .save() in PATCH route** (not findByIdAndUpdate) so the pre('save') hook actually fires — findByIdAndUpdate skips middleware.
- Aggregation pipelines for reports rather than fetching everything and reducing client-side. /report/closed-by-agent uses `$match` → `$group` → `$lookup` → `$unwind` → `$project` → `$sort`.
- Central error-handler middleware maps Mongoose validation, cast, and duplicate-key errors to clean HTTP responses, eliminating try/catch in every route.
- asyncHandler wrapper lets every route use async/await without wrapping the body in try/catch.
## Known Limitations (a.k.a. "Future Work")
 
- No authentication — every endpoint is public.
- No pagination on `GET /leads`. Would be needed at scale.
- Filter state on the Lead List page lives in component state, not the URL — so filters reset on refresh and can't be shared as bookmarks. (`useSearchParams` migration planned.)
- Comment author defaults to the lead's assigned agent since there's no concept of "logged-in user".

# PRD Checklist

## Data Models

- [x] Lead model (name, source, salesAgent ref, status, tags, timeToClose, priority, timestamps, closedAt)
- [x] Sales Agent model (name, unique email)
- [x] Comment model (lead ref, author ref, commentText, createdAt)
- [x] Tag model (unique name)
- [x] Auto-update `updatedAt` on save
- [x] Auto-set `closedAt` when status becomes Closed

---

## Backend API

### Leads
- [x] POST /leads — create a lead
- [x] GET /leads — list with filters (status, salesAgent, source, priority, tags, sortBy, order)
- [x] GET /leads/:id — get a single lead
- [x] PATCH /leads/:id — update a lead
- [x] DELETE /leads/:id — delete a lead

### Sales Agents
- [x] POST /agents — create a sales agent
- [x] GET /agents — list all sales agents
- [x] GET /agents/:id — get a single sales agent
- [x] DELETE /agents/:id — delete a sales agent

### Comments
- [x] POST /leads/:id/comments — add a comment to a lead
- [x] GET /leads/:id/comments — list comments for a lead

### Tags
- [x] POST /tags — create a tag
- [x] GET /tags — list all tags

### Reports
- [x] GET /report/last-week — leads closed in the last 7 days
- [x] GET /report/pipeline — pipeline totals grouped by status
- [x] GET /report/closed-by-agent — closed counts grouped by agent
- [x] GET /report/status-distribution — counts of leads in every status

---

## Frontend Screens

- [x] Dashboard
- [x] Lead Management (detail view with edit + comments)
- [x] Lead List (with filters and sorting)
- [x] Add New Lead
- [x] Sales Agent Management (list)
- [x] Add New Agent
- [x] Lead Status View (grouped by status)
- [x] Sales Agent View (grouped by agent)
- [x] Reports
- [x] Settings (search + delete agents/leads)

---

## Reports & Visualizations

- [x] Leads Closed Last Week (bar chart, grouped by sales agent)
- [x] Total Leads in Pipeline (bar chart by status)
- [x] Leads by Sales Agent (bar chart of closed counts)
- [x] Lead Status Distribution (pie chart)
- [x] Closed vs In Pipeline (pie chart)

---

## Deployment & Infrastructure

- [x] Self-hosted on VPS (Hostinger, Ubuntu LTS)
- [x] Nginx reverse proxy
- [x] PM2 process manager
- [x] HTTPS via Let's Encrypt (Certbot)
- [x] MongoDB on VPS (localhost-bound, SSH tunnel for dev)
- [x] CI/CD via GitHub Actions (auto-deploy on push to main)

## Screenshots
- Dashboard 
<img width="1901" height="622" alt="image" src="https://github.com/user-attachments/assets/7399d242-5a78-4340-9378-ab341d4388ed" />

- Leads by status
<img width="1895" height="664" alt="image" src="https://github.com/user-attachments/assets/8257a27e-ab41-4f08-8274-590ea1257b59" />

- Lead List
<img width="1903" height="739" alt="image" src="https://github.com/user-attachments/assets/fb6e4e2a-0d29-4699-b038-7489691c98cd" />

- Reports
<img width="1890" height="906" alt="image" src="https://github.com/user-attachments/assets/4820de73-d89c-41aa-ada3-107c61ce82cb" />

- Sales Agents
<img width="1893" height="524" alt="image" src="https://github.com/user-attachments/assets/6066dd47-aaf2-495a-a34d-92b867112585" />


