const Joi = require("@hapi/joi");

function validate(schema) {
    return async (req, res, next) => {
        try {
            let result = await schema.validateAsync(req.body);
        } catch (err) {
            return next(err);
        }
        return next();
    };
}

module.exports = validate;
