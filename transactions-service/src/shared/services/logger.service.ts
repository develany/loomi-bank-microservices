import {
  Injectable,
  LoggerService as NestLoggerService,
  Scope,
} from "@nestjs/common";
import { ConfigService } from "../../config/config.service";

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService implements NestLoggerService {
  private context?: string;

  constructor(private configService: ConfigService) {}

  setContext(context: string) {
    this.context = context;
    return this;
  }

  log(message: string, context?: string) {
    this.printLog("info", message, context);
  }

  error(message: string, trace?: string, context?: string) {
    this.printLog("error", message, context, trace);
  }

  warn(message: string, context?: string) {
    this.printLog("warn", message, context);
  }

  debug(message: string, context?: string) {
    this.printLog("debug", message, context);
  }

  verbose(message: string, context?: string) {
    this.printLog("verbose", message, context);
  }

  private printLog(
    level: string,
    message: string,
    context?: string,
    trace?: string
  ) {
    if (this.shouldLog(level)) {
      const currentContext = context || this.context;
      const now = new Date();
      const logEntry = {
        level,
        message,
        context: currentContext,
        timestamp: now.toISOString(),
        trace,
      };

      console.log(JSON.stringify(logEntry));
    }
  }

  private shouldLog(level: string): boolean {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      verbose: 4,
      debug: 5,
      silly: 6,
    };

    const configLevel = this.configService.logging.level || "info";
    return levels[level] <= levels[configLevel];
  }
}
