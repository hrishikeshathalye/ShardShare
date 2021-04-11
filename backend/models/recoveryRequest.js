var mongoose = require("mongoose");

const requestSchema = mongoose.Schema({
  requester: { type: String, required: true },
  secretId: { type: mongoose.Types.ObjectId, required: true },
  date: { type: Date, expires: 86400, default: Date.now, required: true },
  numApproved: { type: Number, required: true, default: 0 },
  numDeclined: { type: Number, required: true, default: 0 },
});

module.exports = mongoose.model("recoveryRequest", requestSchema);
