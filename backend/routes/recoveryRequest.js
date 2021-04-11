var express = require("express");
var {
  request,
  approve,
  reject,
  getRecoveryRequests,
} = require("../controllers/recoveryRequest.js");
var router = express.Router();
var auth = require("../middleware/auth");

router.post("/request/:secretId", request);
router.post("/approve/:secretId/:requester", approve);
router.post("/reject/:secretId/:requester", reject);
router.post("/getRecoveryRequests", getRecoveryRequests);

module.exports = router;
