const httpStatus = require("http-status");
const { ValidationError } = require("@hapi/joi");
const APIError = require("../utils/api-error");
const { env } = require("../config/vars");

const handler = (err, req, res, next) => {
    const response = {
        code: err.status,
        message: err.message || httpStatus[err.status],
        errors: err.errors,
        stack: err.stack,
    };

    if (env == "production") {
        delete response.stack;
    }

    res.status(err.status);
    res.json(response);
};
exports.handler = handler;

exports.converter = (err, req, res, next) => {
    let convertedError = err;

    if (err instanceof ValidationError) {
        convertedError = new APIError({
            message: "Validation Error",
            errors: err.details,
            status: httpStatus.BAD_REQUEST,
            stack: err.stack,
        });
    } else if (!(err instanceof APIError)) {
        convertedError = new APIError({
            message: err.message,
            status: err.status,
            stack: err.stack,
        });
    }

    return handler(convertedError, req, res);
};

exports.notFound = (req, res, next) => {
    const err = new APIError({
        message: "Not found",
        status: httpStatus.NOT_FOUND,
    });
    return handler(err, req, res);
};
