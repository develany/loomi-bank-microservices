import { DataSource } from "typeorm";
import { User } from "../entities/User";
import config from "./config";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: config.database.host,
  port: config.database.port,
  username: config.database.username,
  password: config.database.password,
  database: config.database.database,
  synchronize: true,
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
