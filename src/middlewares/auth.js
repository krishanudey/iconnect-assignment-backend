const httpStatus = require("http-status");
const passport = require("passport");
const User = require("../models/user.model");
const APIError = require("../utils/api-error");

const handleJWT = (req, res, next) => async (err, user, info) => {
    const error = err || info;

    const apiError = new APIError({
        message: error ? error.message : "Unauthorized",
        status: httpStatus.UNAUTHORIZED,
        stack: error ? error.stack : undefined,
    });
    if (error) throw next(error);
    if (err || !user) {
        return next(apiError);
    }

    req.user = user;

    return next();
};

exports.authorize = () => (req, res, next) =>
    passport.authenticate("jwt", { session: false }, handleJWT(req, res, next))(
        req,
        res,
        next
    );
