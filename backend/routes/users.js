var express = require("express")
var {signin, signup, verify} = require("../controllers/user.js")
var router = express.Router();
var auth = require("../middleware/auth")

router.post('/signin', signin)

router.post('/signup', signup)

router.post('/verify', auth, verify)

module.exports = router;
