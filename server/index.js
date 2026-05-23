require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { initializeDatabase } = require("./config/db");
const { errorHandler } = require("./middleware/errorHandler");

const leadsRouter = require("./routes/leads");
const agentsRouter = require("./routes/agents");
const commentsRouter = require("./routes/comments");
const tagsRouter = require("./routes/tags");
const reportsRouter = require("./routes/reports");

const app = express();

const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS;
if (!ALLOWED_ORIGINS) {
  console.log("Error : Allowed ORIGIN not set");
  process.exit(1);
}
const allowedOrigins = ALLOWED_ORIGINS?.split(",") || [];
app.use(
  cors({
    origin: allowedOrigins,
  }),
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Anvaya CRM API is running." });
});

app.use("/leads", leadsRouter);
app.use("/leads/:id/comments", commentsRouter);
app.use("/agents", agentsRouter);
app.use("/tags", tagsRouter);
app.use("/report", reportsRouter);

app.use((req, res) => {
  res
    .status(404)
    .json({ error: `Route not found: ${req.method} ${req.originalUrl}` });
});

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

initializeDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`✓ Anvaya API listening on http://localhost:${PORT}`);
  });
});
