const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Lead name is required"],
    trim: true,
  },
  source: {
    type: String,
    required: [true, "Lead source is required"],
    enum: {
      values: [
        "Website",
        "Referral",
        "Cold Call",
        "Advertisement",
        "Email",
        "Other",
      ],
      message: "{VALUE} is not a valid source",
    },
  },
  salesAgent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SalesAgent",
    required: [true, "Sales Agent is required"],
  },
  status: {
    type: String,
    required: true,
    enum: {
      values: ["New", "Contacted", "Qualified", "Proposal Sent", "Closed"],
      message: "{VALUE} is not a valid status",
    },
    default: "New",
  },
  tags: {
    type: [String],
    default: [],
  },
  timeToClose: {
    type: Number,
    required: [true, "Time to Close is required"],
    min: [1, "Time to Close must be a positive number"],
  },
  priority: {
    type: String,
    required: true,
    enum: {
      values: ["High", "Medium", "Low"],
      message: "{VALUE} is not a valid priority",
    },
    default: "Medium",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  closedAt: {
    type: Date,
  },
});

leadSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  if (this.isModified("status")) {
    if (this.status === "Closed" && !this.closedAt) {
      this.closedAt = Date.now();
    } else if (this.status !== "Closed") {
      this.closedAt = undefined;
    }
  }
  next();
});

module.exports = mongoose.model("Lead", leadSchema);
