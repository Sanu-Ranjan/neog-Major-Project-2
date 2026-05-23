const express = require("express");
const Lead = require("../models/Lead");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

// leads closed in the last 7 days
router.get(
  "/last-week",
  asyncHandler(async (req, res) => {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const leads = await Lead.find({
      status: "Closed",
      closedAt: { $gte: sevenDaysAgo },
    })
      .populate("salesAgent", "name")
      .sort({ closedAt: -1 });

    res.json(leads);
  }),
);

// total leads not closed, grouped by status
router.get(
  "/pipeline",
  asyncHandler(async (req, res) => {
    const totalLeadsInPipeline = await Lead.countDocuments({
      status: { $ne: "Closed" },
    });

    const byStatus = await Lead.aggregate([
      { $match: { status: { $ne: "Closed" } } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);

    res.json({ totalLeadsInPipeline, byStatus });
  }),
);

//counts of closed leads per agent
router.get(
  "/closed-by-agent",
  asyncHandler(async (req, res) => {
    const result = await Lead.aggregate([
      { $match: { status: "Closed" } },
      { $group: { _id: "$salesAgent", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "salesagents",
          localField: "_id",
          foreignField: "_id",
          as: "agent",
        },
      },
      { $unwind: "$agent" },
      {
        $project: {
          _id: 0,
          agentId: "$_id",
          agentName: "$agent.name",
          count: 1,
        },
      },
      { $sort: { count: -1 } },
    ]);

    res.json(result);
  }),
);

//count of leads in every status
router.get(
  "/status-distribution",
  asyncHandler(async (req, res) => {
    const result = await Lead.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
      { $project: { _id: 0, status: "$_id", count: 1 } },
    ]);
    res.json(result);
  }),
);

module.exports = router;
