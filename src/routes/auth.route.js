const express = require("express");
const controller = require("../controllers/auth.controller");
const validate = require("../validations/validate");
const { login, register, refresh } = require("../validations/auth.validation");

const router = express.Router();

router.route("/register").post(validate(register), controller.register);
router.route("/login").post(validate(login), controller.login);
router.route("/refresh-token").post(validate(refresh), controller.refresh);

module.exports = router;
