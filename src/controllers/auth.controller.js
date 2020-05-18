const httpStatus = require("http-status");
const User = require("../models/user.model");
const RefreshToken = require("../models/refresh-token.model");
const moment = require("moment-timezone");
const { jwtExpirationInterval } = require("../config/vars");
const APIError = require("../utils/api-error");

exports.register = async (req, res, next) => {
    //TODO:
};

exports.login = async (req, res, next) => {
    //TODO:
};

exports.refresh = async (req, res, next) => {
    //TODO:
};
