var mongoose = require("mongoose");

const secretSchema = mongoose.Schema({
  date: { type: Date, required: true },
  sharedWith: { type: [String], required: true },
  owner: { type: String, required: true },
  secretName: { type: String, required: true },
  n: { type: Number, required: true },
  k: { type: Number, required: true },
});

module.exports = mongoose.model("Secret", secretSchema);
