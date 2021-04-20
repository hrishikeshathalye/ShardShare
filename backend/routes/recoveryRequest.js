var express = require("express");
var {
  request,
  approve,
  reject,
  getRecoveryRequests,
  combineShards,
  deleteRequests
} = require("../controllers/recoveryRequest.js");
var router = express.Router();
var auth = require("../middleware/auth");

router.post("/request", request);
router.post("/approve", approve);
router.post("/reject", reject);
router.post("/getRecoveryRequests", getRecoveryRequests);
router.post("/combineShards", combineShards);
router.post("/deleteRequests", deleteRequests);

module.exports = router;
