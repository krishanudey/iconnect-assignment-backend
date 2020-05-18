const { app } = require("./config/express");
const { port, env } = require("./config/vars");
const logger = require("./config/logger");

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
