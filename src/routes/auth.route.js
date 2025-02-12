const express = require("express");
const controller = require("../controllers/auth.controller");
const { login, register, refresh } = require("../validations/auth.validation");
const validate = require("../middlewares/validate");

const router = express.Router();

router.route("/register").post(validate(register), controller.register);
router.route("/login").post(validate(login), controller.login);
router.route("/refresh-token").post(validate(refresh), controller.refresh);

module.exports = router;
