const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const compress = require("compression");
const cors = require("cors");
const helmet = require("helmet");
const strategies = require("./passport");
const error = require("../middlewares/error");

const passport = require("passport");
const { logs, port, env } = require("../config/vars");

const mongoose = require("../config/mongoose");
const logger = require("../config/logger");

const routes = require("../routes");

const app = express();

app.use(morgan(logs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(compress());

app.use(
    helmet({
        frameguard: false,
    })
);
app.use(cors());

app.use(passport.initialize());
passport.use("jwt", strategies.jwt);

mongoose.connect();

app.use("/v1", routes);

app.use(error.converter);
app.use(error.notFound);
app.use(error.handler);

exports.app = app;
