
const express = require('express');
const bodyParser = require('body-parser');
// const loggerSetup = require('./src/config/winstonLogger');

// Create an instance of Express
const app = express();

// Import routes, server configuration, database connection, and middleware
const routes = require('./src/routes/routes');
const server = require('./src/config/server');
const db = require('./src/config/dbConnection');
const middleware = require('./src/utils/middleware');

// Parse incoming JSON requests
app.use(bodyParser.json());

// Custom authentication middleware fo  r admin and customer role based validation.
app.use(middleware.auth);

// Route handling
app.use('/', routes);

// Set up logger
// const logger = loggerSetup.create();

try {

  server.up(app);
  db.connect();
} catch (error) {
  // Log any errors that occur during server startup or database connection
  console.log("error while doing server up", error.message);
  logger.error(`An error occurred: ${error}`);
}
