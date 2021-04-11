var mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  requester: { type: String, required: true },
  secretId: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, expires: 86400, default: Date.now, required: true },
  approved: { type: [String], required: true },
  declined: { type: [String], required: true }
});

module.exports = mongoose.model("recoveryRequest", requestSchema);
