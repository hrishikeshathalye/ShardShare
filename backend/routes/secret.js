var express = require("express");
var {
  create,
  get_secrets_shared_by_user,
  get_secrets_shared_with_user,
} = require("../controllers/secret");
var router = express.Router();
var auth = require("../middleware/auth");

router.post("/create", create);
router.post("/get_shared_by_user", get_secrets_shared_by_user);
router.post("/get_shared_with_user", get_secrets_shared_with_user);

module.exports = router;
