import { Module } from "@nestjs/common";
import { HttpService } from "./http.service";
import { LoggerModule } from "./logger.module";

@Module({
  imports: [LoggerModule],
  providers: [HttpService],
  exports: [HttpService],
})
export class HttpModule {}
