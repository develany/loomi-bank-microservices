import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./config/database";
import userRoutes from "./routes/userRoutes";
import { mockAuth } from "./middlewares/mockAuth";
import { errorHandler } from "./middlewares/errorHandler";
import config from "./config/config";
import { logger } from "./utils/logger";
import { specs, swaggerUi } from "./config/swagger";

const app = express();
const PORT = config.server.port;

// Middlewares
app.use(express.json());
app.use(mockAuth);

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Routes
app.use("/api", userRoutes);

// Error handling
app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    logger.info("Database connection established");
    app.listen(PORT, () => {
      logger.info(`Users service is running on port ${PORT}`);
      logger.info(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to database", error as Error);
    process.exit(1);
  });