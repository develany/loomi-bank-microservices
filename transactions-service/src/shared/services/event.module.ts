import { Module } from "@nestjs/common";
import { EventService } from "./event.service";
import { LoggerModule } from "./logger.module";

@Module({
  imports: [LoggerModule],
  providers: [EventService],
  exports: [EventService],
})
export class EventModule {}
