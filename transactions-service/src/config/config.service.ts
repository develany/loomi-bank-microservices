import { Injectable } from "@nestjs/common";
import { ConfigService as NestConfigService } from "@nestjs/config";

@Injectable()
export class ConfigService {
  constructor(private configService: NestConfigService) {}

  get nodeEnv(): string {
    return this.configService.get<string>("NODE_ENV");
  }

  get port(): number {
    return this.configService.get<number>("PORT");
  }

  get isDevelopment(): boolean {
    return this.nodeEnv === "development";
  }

  get isProduction(): boolean {
    return this.nodeEnv === "production";
  }

  get isTest(): boolean {
    return this.nodeEnv === "test";
  }

  get database() {
    return {
      host: this.configService.get<string>("DB_HOST"),
      port: this.configService.get<number>("DB_PORT"),
      username: this.configService.get<string>("DB_USERNAME"),
      password: this.configService.get<string>("DB_PASSWORD"),
      database: this.configService.get<string>("DB_DATABASE"),
    };
  }

  get rabbitmq() {
    return {
      url: this.configService.get<string>("RABBITMQ_URL"),
    };
  }

  get externalServices() {
    return {
      usersApi: this.configService.get<string>("USERS_API"),
    };
  }

  get logging() {
    return {
      level: this.configService.get<string>("LOG_LEVEL"),
    };
  }
}
