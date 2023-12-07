import express from "express";
import cors from "cors";
import logger from "morgan";
import bodyParser from "body-parser";
import sequelize from "./database/database";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../docs/swagger.json";
import { router } from "./routes/route";

export const app = express();

app.use(express.json());
app.use(cors());
app.use(logger("dev"));

// middleware
app.use(bodyParser.json());

app.use(router);

// Add this middleware to catch promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  // Application-specific logging, throwing an error, or other logic here
});

// Add this middleware to catch uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.stack);
  // Application-specific logging, throwing an error, or other logic here
  process.exit(1); // Exit the process after logging the error
});

//Documentation route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

sequelize.sync({ force: true }).then(() => {
  console.log("Models synchronized with database");
});
