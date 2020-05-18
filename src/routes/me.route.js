const express = require("express");
const controller = require("../controllers/profile.controller");
const { authorize } = require("../middlewares/auth");

const router = express.Router();

router.route("/profile").get(authorize(), controller.profile);

module.exports = router;
