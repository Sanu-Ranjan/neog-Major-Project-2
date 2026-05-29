const express = require("express");
const mongoose = require("mongoose");
const Lead = require("../models/Lead");
const SalesAgent = require("../models/SalesAgent");
const asyncHandler = require("../middleware/asyncHandler");
const { httpError } = require("../middleware/errorHandler");

const router = express.Router();

const VALID_STATUSES = [
  "New",
  "Contacted",
  "Qualified",
  "Proposal Sent",
  "Closed",
];
const VALID_SOURCES = [
  "Website",
  "Referral",
  "Cold Call",
  "Advertisement",
  "Email",
  "Other",
];
const VALID_PRIORITIES = ["High", "Medium", "Low"];

// create a new lead
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { salesAgent } = req.body;

    if (salesAgent && !mongoose.Types.ObjectId.isValid(salesAgent)) {
      throw httpError(400, `Invalid salesAgent ID: ${salesAgent}`);
    }
    const agent = await SalesAgent.findById(salesAgent);
    if (!agent) {
      throw httpError(404, `Sales agent with ID '${salesAgent}' not found.`);
    }

    const lead = await Lead.create(req.body);
    const populated = await lead.populate("salesAgent", "name email");
    res.status(201).json(populated);
  }),
);

//  list with optional filters
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const { salesAgent, status, priority, tags, source, sortBy, order } =
      req.query;
    const filter = {};

    if (status) {
      if (!VALID_STATUSES.includes(status)) {
        throw httpError(
          400,
          `Invalid input: 'status' must be one of [${VALID_STATUSES.join(", ")}].`,
        );
      }
      filter.status = status;
    }
    if (priority) {
      if (!VALID_PRIORITIES.includes(priority)) {
        throw httpError(
          400,
          `Invalid input: 'priority' must be one of [${VALID_PRIORITIES.join(", ")}].`,
        );
      }
      filter.priority = priority;
    }
    if (source) {
      if (!VALID_SOURCES.includes(source)) {
        throw httpError(
          400,
          `Invalid input: 'source' must be one of [${VALID_SOURCES.join(", ")}].`,
        );
      }
      filter.source = source;
    }
    if (salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(salesAgent)) {
        throw httpError(400, `Invalid salesAgent ID: ${salesAgent}`);
      }
      filter.salesAgent = salesAgent;
    }
    if (tags) {
      //leads/?tags=A&tags=B&tags=C
      // req.query.tags = ""
      const tagList = Array.isArray(tags) ? tags : tags.split(",");
      filter.tags = { $in: tagList };
    }

    // Sorting
    const sortField = sortBy || "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;
    const sort = { [sortField]: sortOrder };

    const leads = await Lead.find(filter)
      .populate("salesAgent", "name email")
      .sort(sort);
    res.json(leads);
  }),
);

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw httpError(400, `Invalid lead ID: ${req.params.id}`);
    }
    const lead = await Lead.findById(req.params.id).populate(
      "salesAgent",
      "name email",
    );
    if (!lead) {
      throw httpError(404, `Lead with ID '${req.params.id}' not found.`);
    }
    res.json(lead);
  }),
);

router.patch(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw httpError(400, `Invalid lead ID: ${req.params.id}`);
    }

    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      throw httpError(404, `Lead with ID '${req.params.id}' not found.`);
    }

    if (req.body.salesAgent) {
      if (!mongoose.Types.ObjectId.isValid(req.body.salesAgent)) {
        throw httpError(400, `Invalid salesAgent ID: ${req.body.salesAgent}`);
      }
      const agent = await SalesAgent.findById(req.body.salesAgent);
      if (!agent) {
        throw httpError(
          404,
          `Sales agent with ID '${req.body.salesAgent}' not found.`,
        );
      }
    }

    Object.assign(lead, req.body);
    await lead.save();
    const populated = await lead.populate("salesAgent", "name email");
    res.json(populated);
  }),
);

router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      throw httpError(400, `Invalid lead ID: ${req.params.id}`);
    }
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      throw httpError(404, `Lead with ID '${req.params.id}' not found.`);
    }
    res.json({ message: "Lead deleted successfully." });
  }),
);

module.exports = router;
