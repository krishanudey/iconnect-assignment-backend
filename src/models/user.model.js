const mongoose = require("mongoose");
const httpStatus = require("http-status");
const { omitBy, isNil } = require("lodash");
const bcrypt = require("bcryptjs");
const moment = require("moment-timezone");
const jwt = require("jwt-simple");
const uuidv4 = require("uuid").v4;

const { env, jwtExpirationInterval, jwtSecret } = require("../config/vars");

const APIError = require("../utils/api-error");

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            match: /^\S+@\S+\.\S+$/,
            required: true,
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            maxlength: 128,
        },
        name: {
            type: String,
            maxlength: 128,
            index: true,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

userSchema.pre("save", async function save(next) {
    try {
        if (!this.isModified("password")) return next();

        const rounds = env === "production" ? 10 : 1;

        const hash = await bcrypt.hash(this.password, rounds);
        this.password = hash;

        return next();
    } catch (error) {
        return next(error);
    }
});

userSchema.method({
    transform() {
        const transformed = {};
        const fields = ["id", "name", "email", "createdAt"];

        fields.forEach((field) => {
            transformed[field] = this[field];
        });

        return transformed;
    },

    token() {
        const playload = {
            exp: moment().add(jwtExpirationInterval, "minutes").unix(),
            iat: moment().unix(),
            sub: this._id,
        };
        return jwt.encode(playload, jwtSecret);
    },

    async passwordMatches(password) {
        return bcrypt.compare(password, this.password);
    },
});

userSchema.statics = {
    async get(id) {
        try {
            let user;

            if (mongoose.Types.ObjectId.isValid(id)) {
                user = await this.findById(id).exec();
            }
            if (user) {
                return user;
            }

            throw new APIError({
                message: "User does not exist",
                status: httpStatus.NOT_FOUND,
            });
        } catch (error) {
            throw error;
        }
    },

    async findAndGenerateToken(options) {
        const { email, password, refreshObject } = options;
        if (!email)
            throw new APIError({
                message: "An email is required to generate a token",
            });

        const user = await this.findOne({ email }).exec();
        const err = {
            status: httpStatus.UNAUTHORIZED,
            isPublic: true,
        };
        if (password) {
            if (user && (await user.passwordMatches(password))) {
                return { user, accessToken: user.token() };
            }
            err.message = "Incorrect email or password";
        } else if (refreshObject && refreshObject.userEmail === email) {
            if (moment(refreshObject.expires).isBefore()) {
                err.message = "Invalid refresh token.";
            } else {
                return { user, accessToken: user.token() };
            }
        } else {
            err.message = "Incorrect email or refreshToken";
        }
        throw new APIError(err);
    },

    list({ page = 1, perPage = 30, name, email }) {
        const options = omitBy({ name, email }, isNil);

        return this.find(options)
            .sort({ createdAt: -1 })
            .skip(perPage * (page - 1))
            .limit(perPage)
            .exec();
    },

    checkDuplicateEmail(error) {
        if (error.name === "MongoError" && error.code === 11000) {
            return new APIError({
                message: "Validation Error",
                errors: [
                    {
                        field: "email",
                        location: "body",
                        messages: ['"email" already exists'],
                    },
                ],
                status: httpStatus.CONFLICT,
                isPublic: true,
                stack: error.stack,
            });
        }
        return error;
    },
};

module.exports = mongoose.model("User", userSchema);
