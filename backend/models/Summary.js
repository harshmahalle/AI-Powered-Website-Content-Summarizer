const mongoose = require('mongoose');

const SummarySchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    summaryName: { type: String, required: true },
    websiteContent: { type: String, required: true },
    summary: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Summary', SummarySchema);


