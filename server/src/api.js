const cors = require("cors"),
  router = express.Router(),
  dotenv = require("dotenv");

import express from "express";
import bodyParser from "body-parser";
import compression from "compression";
import morgan from "morgan";
import customerRoutes from "../routes/customers";
import studentRoutes from "../routes/students";
import challengeRoutes from "../routes/challenges";
import runCronJobs from "../modules/CheckCustomers";
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

dotenv.config();

const fromEmailAddress = process.env.FROM_EMAIL_ADDRESS;
const prodApiUrl = process.env.PRODUCTION_API_SERVER;
const apiPort = process.env.API_PORT;

const app = express();
app.use(cors());
app.use(compression());
app.use(morgan("tiny"));
app.use(
  bodyParser.urlencoded({
    extended: true,
    limit: "20mb"
  })
);
app.use(bodyParser.json({ limit: "20mb" }));

// Swagger set up
const options = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "HPE Hack Shack Challenges API",
      version: "1.0.0",
      description: "HPE Hack Shack Challenges API documentation",
      license: {
        name: "MIT",
        url: "https://choosealicense.com/licenses/mit/"
      },
      contact: {
        name: "HPEDEV",
        url: "https://hackshack.hpedev.io",
        email: fromEmailAddress
      }
    },
    servers: [
      {
        url: `http://localhost:${apiPort}}/api`,
        description: "Local (development) server"
      },
      {
        url: prodApiUrl,
        description: "Main (production) server"
      }
    ]
  },
  apis: ["./models/*.js", "./routes/*.js"]
};
const swaggerSpec = swaggerJsdoc(options);
router.use("/api/docs", swaggerUi.serve);
router.get(
  "/api/docs",
  swaggerUi.setup(swaggerSpec, {
    explorer: true
  })
);

app.get("/swagger.json", function(req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

router.get("/", (req, res) => {
  console.log("inside base route");
  res.json({
    hello: "HPE Hack Shack Challenge"
  });
});

router.get("/test", (req, res) => {
  res.json({
    hello: "test"
  });
});

// Model routes
app.use("/api", studentRoutes);
app.use("/api", customerRoutes);
app.use("/api", challengeRoutes);

app.use(express.json());
app.use("", router);
app.listen(apiPort, () => {
  console.log(`HPE HackShack Challenges API listening on port ${apiPort}!`); // eslint-disable-line no-console
  runCronJobs();
});

module.exports = app;
