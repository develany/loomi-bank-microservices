import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from './modules/transactions/entities/Transaction';
import { TransactionController } from './modules/transactions/controllers/TransactionController';
import { TransactionService } from './modules/transactions/services/TransactionService';
import { TransactionRepository } from './modules/transactions/repositories/TransactionRepository';
import { AppDataSource } from './config/database';

@Module({
    imports: [
        TypeOrmModule.forRoot(AppDataSource.options),
        TypeOrmModule.forFeature([Transaction]),
    ],
    controllers: [TransactionController],
    providers: [TransactionService, TransactionRepository],
})
export class AppModule { }