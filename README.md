# Anvaya CRM

A full-stack CRM for managing sales leads through a defined pipeline. Built to demonstrate relational data modeling in MongoDB, aggregation-based reporting, URL-driven filtering, and self-hosted VPS deployment.

---

## Demo Link

[Live Demo](https://crm.devranjan.cloud/)

---

## Demo Video

Watch a walkthrough of all major features:

[Video Link](https://drive.google.com/file/d/1dTpiMd2fwtaIA9yHki-5L2Kt9Ri7gwGY/view?usp=sharing)

---

## Quick Start

```bash
# Clone the repo
git clone https://github.com/Sanu-Ranjan/neog-Major-Project-2.git
cd neog-Major-Project-2

# Backend
cd server
cp .env.example .env      # fill in your MONGO_URI and ALLOWED_ORIGINS
npm install
npm run seed              # populate demo data
npm run dev               # starts on http://localhost:3000

# Frontend
cd ../client
npm install
npm run dev               # starts on http://localhost:5173
```

---

## Tech Stack

- **Frontend:** React 19, React Router 7, Bootstrap 5 (CDN), Chart.js + react-chartjs-2, native fetch
- **Backend:** Node.js, Express 4, Mongoose 8
- **Database:** MongoDB (self-hosted on VPS)
- **Infrastructure:** Hostinger VPS (Ubuntu LTS), Nginx, PM2, Let's Encrypt via Certbot
- **CI/CD:** GitHub Actions — auto-deploys on push to `main`

---

## Combined Features

- Lead CRUD with assignment, status workflow, priority, tags, time-to-close
- Sales agents directory (with delete)
- Comments / activity log per lead (with author + timestamp)
- Path-based URL routing for status and agent views (`/leads/status/:status`, `/leads/by-agent/:agentId`)
- Filterable and sortable lead list by status, agent, priority, sort field and order
- Grouped views — leads by status, leads by sales agent
- Settings page — search and delete agents or leads
- Reports dashboard with 5 visualizations:
  - Closed leads by sales agent (bar)
  - Closed vs in pipeline (pie)
  - Lead status distribution (pie)
  - Closed in last 7 days by agent (bar)
  - Pipeline by status (bar)
- Auto-set `closedAt` when a lead's status flips to Closed via Mongoose `pre('save')` hook

---

## API Quick Reference

All endpoints are prefixed with `/anvaya/v1`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/leads` | List leads (filters: status, salesAgent, source, priority, tags, sortBy, order) |
| POST | `/leads` | Create a lead |
| GET | `/leads/:id` | Get a single lead |
| PATCH | `/leads/:id` | Partial update |
| DELETE | `/leads/:id` | Delete |
| GET | `/leads/:id/comments` | List comments for a lead |
| POST | `/leads/:id/comments` | Add a comment |
| GET | `/agents` | List sales agents |
| POST | `/agents` | Create agent |
| GET | `/agents/:id` | Get a single agent |
| DELETE | `/agents/:id` | Delete an agent |
| GET | `/tags` | List tags |
| POST | `/tags` | Create tag |
| GET | `/report/last-week` | Leads closed in the last 7 days |
| GET | `/report/pipeline` | Pipeline counts grouped by status |
| GET | `/report/closed-by-agent` | Closed counts grouped by agent |
| GET | `/report/status-distribution` | All statuses with counts |

---

## Design Decisions

- **PATCH over PUT** — matches the actual use case where you update only a status or an agent
- **`closedAt` auto-set** via Mongoose `pre('save')` hook — without this the closed-last-week report has no field to query. The hook also clears `closedAt` if status moves back from Closed
- **`findById` + `.save()`** in the PATCH route instead of `findByIdAndUpdate` — so the `pre('save')` hook actually fires
- **Aggregation pipelines** for reports — `/report/closed-by-agent` uses `$match` → `$group` → `$lookup` → `$unwind` → `$project` → `$sort`
- **Central error-handler middleware** — maps Mongoose validation, cast, and duplicate-key errors to clean HTTP responses, eliminating try/catch in every route
- **`asyncHandler` wrapper** — lets every route use async/await without wrapping in try/catch
- **URL-driven filtering** — filters live in the browser URL via `useSearchParams`, making them shareable and refresh-safe

---

## Known Limitations

- No authentication — every endpoint is public
- No pagination on `GET /leads` — would be needed at scale
- Comment author defaults to the lead's assigned agent since there is no logged-in user concept

---

## Feature Checklist

A full interactive checklist of every feature verified against the running app:

[CHECKLIST.md](./CHECKLIST.md)

Interactive version: [https://vn7mr9.csb.app/](https://vn7mr9.csb.app/)

---

## Contact

For bugs or feature requests, reach out at [ranjan.code33@gmail.com]()

## Some Screenshots
- Dashboard 
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/51a76370-8eee-4b03-9915-0266285f1307" />

- Lead List
<img width="1916" height="944" alt="image" src="https://github.com/user-attachments/assets/9a1044be-7c78-427e-b114-da03cee8f837" />

- Sales Agents
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/78f43b59-5cfe-4c73-b780-f15210d790fc" />

- Reports
<img width="1919" height="939" alt="image" src="https://github.com/user-attachments/assets/5ab896e4-a0a7-4790-9a53-9e34160e94b3" />

- Settings
<img width="1919" height="942" alt="image" src="https://github.com/user-attachments/assets/610b84f3-777f-4114-958d-a26234c38979" />


