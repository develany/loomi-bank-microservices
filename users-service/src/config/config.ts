export default {
  database: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || "postgres",
    password: process.env.DB_PASSWORD || "postgres",
    database: process.env.DB_DATABASE || "loomibank",
  },
  redis: {
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
  },
  rabbitmq: {
    url: process.env.RABBITMQ_URL || "amqp://localhost",
    exchanges: {
      userEvents: "user_events",
    },
  },
  server: {
    port: process.env.PORT || 3001,
  },
};
