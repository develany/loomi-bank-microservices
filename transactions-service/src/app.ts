import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ConfigModule } from "./config/config.module";
import { ConfigService } from "./config/config.service";
import { TypeOrmConfigService } from "./config/database";
import { Transaction } from "./modules/transactions/entities/Transaction";
import { TransactionController } from "./modules/transactions/controllers/TransactionController";
import { TransactionService } from "./modules/transactions/services/TransactionService";
import { TransactionRepository } from "./modules/transactions/repositories/TransactionRepository";
import { LoggerModule } from "./shared/services/logger.module";
import { LoggerService } from "./shared/services/logger.service";
import { HttpModule } from "./shared/services/http.module";
import { EventModule } from "./shared/services/event.module";

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useClass: TypeOrmConfigService,
    }),
    TypeOrmModule.forFeature([Transaction]),
    LoggerModule,
    HttpModule,
    EventModule,
  ],
  controllers: [TransactionController],
  providers: [
    TransactionService,
    TransactionRepository,
    {
      provide: "ITransactionRepository",
      useClass: TransactionRepository,
    },
    {
      provide: "ITransactionService",
      useClass: TransactionService,
    },
  ],
})
export class AppModule {}
