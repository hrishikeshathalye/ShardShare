var express = require("express")
var {create} = require("../controllers/secret")
var router = express.Router();
var auth = require("../middleware/auth")

router.post('/create', create)



// router.post('/verify', auth, verify)

module.exports = router;
