const express = require("express");
const mongoose = require("mongoose");
const Comment = require("../models/Comment");
const Lead = require("../models/Lead");
const SalesAgent = require("../models/SalesAgent");
const asyncHandler = require("../middleware/asyncHandler");
const { httpError } = require("../middleware/errorHandler");

const router = express.Router({ mergeParams: true });

router.post(
  "/",
  asyncHandler(async (req, res) => {
    const leadId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      throw httpError(400, `Invalid lead ID: ${leadId}`);
    }
    const lead = await Lead.findById(leadId);
    if (!lead) {
      throw httpError(404, `Lead with ID '${leadId}' not found.`);
    }

    // If author isn't provided, fall back to the lead's assigned agent.
    // In a real app this would come from the authenticated user.
    let author = req.body.author || lead.salesAgent;
    if (!mongoose.Types.ObjectId.isValid(author)) {
      throw httpError(400, `Invalid author ID: ${author}`);
    }
    const agent = await SalesAgent.findById(author);
    if (!agent) throw httpError(404, `Author (sales agent) not found.`);

    const comment = await Comment.create({
      lead: leadId,
      author,
      commentText: req.body.commentText,
    });

    const populated = await comment.populate("author", "name");
    res.status(201).json(populated);
  }),
);

router.get(
  "/",
  asyncHandler(async (req, res) => {
    const leadId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(leadId)) {
      throw httpError(400, `Invalid lead ID: ${leadId}`);
    }
    const lead = await Lead.findById(leadId);
    if (!lead) {
      throw httpError(404, `Lead with ID '${leadId}' not found.`);
    }
    const comments = await Comment.find({ lead: leadId })
      .populate("author", "name")
      .sort({ createdAt: -1 });
    res.json(comments);
  }),
);

module.exports = router;
