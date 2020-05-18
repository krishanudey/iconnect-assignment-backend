const httpStatus = require("http-status");
const User = require("../models/user.model");
const moment = require("moment-timezone");
const APIError = require("../utils/api-error");

exports.profile = async (req, res, next) => {
    try {
        const userTransformed = req.user.transform();
        return res.json(userTransformed);
    } catch (error) {
        return next(error);
    }
};
