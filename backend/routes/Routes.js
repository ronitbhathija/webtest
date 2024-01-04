const express = require("express")
const router = express.Router();


const { login, signup, getData } = require("../controllers/Auth")

router.post("/login", login);
router.post("/signup", signup);
router.get("/getdata", getData);

module.exports = router;