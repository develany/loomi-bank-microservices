import * as Joi from "joi";

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid("development", "production", "test")
    .default("development"),
  PORT: Joi.number().default(3000),

  // Database
  DB_HOST: Joi.string().default("localhost"),
  DB_PORT: Joi.number().default(5432),
  DB_USERNAME: Joi.string().default("postgres"),
  DB_PASSWORD: Joi.string().default("postgres"),
  DB_DATABASE: Joi.string().default("loomi_transactions"),

  // RabbitMQ
  RABBITMQ_URL: Joi.string().default("amqp://localhost"),

  // External Services
  USERS_API: Joi.string().default("http://users-service:3000"),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid("error", "warn", "info", "http", "verbose", "debug", "silly")
    .default("info"),
});
