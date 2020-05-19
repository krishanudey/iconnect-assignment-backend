const Joi = require("@hapi/joi");

module.exports = {
    register: Joi.object({
        name: Joi.string().required().max(128),
        email: Joi.string().email().required(),
        password: Joi.string().required().min(8).max(32),
    }),

    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required(),
    }),

    refresh: Joi.object({
        email: Joi.string().email().required(),
        refreshToken: Joi.string().required(),
    }),
};
