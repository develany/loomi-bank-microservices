import { Repository } from "typeorm";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Transaction } from "../entities/Transaction";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { PaginatedResult } from "../../../shared/interfaces/PaginatedResult";
import { LoggerService } from "../../../shared/services/logger.service";

@Injectable()
export class TransactionRepository implements ITransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private readonly repository: Repository<Transaction>,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext("TransactionRepository");
  }

  async create(data: Partial<Transaction>): Promise<Transaction> {
    try {
      this.logger.debug(`Creating transaction: ${JSON.stringify(data)}`);
      const transaction = this.repository.create(data);
      return await this.repository.save(transaction);
    } catch (error) {
      this.logger.error(
        `Error creating transaction: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findById(id: string): Promise<Transaction> {
    try {
      this.logger.debug(`Finding transaction by ID: ${id}`);
      return await this.repository.findOne({ where: { id } });
    } catch (error) {
      this.logger.error(
        `Error finding transaction by ID: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }

  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<Transaction>> {
    try {
      this.logger.debug(
        `Finding transactions for user: ${userId}, page: ${page}, limit: ${limit}`
      );

      const [transactions, total] = await this.repository.findAndCount({
        where: [{ senderUserId: userId }, { receiverUserId: userId }],
        order: {
          createdAt: "DESC",
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      return {
        data: transactions,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      this.logger.error(
        `Error finding transactions for user: ${error.message}`,
        error.stack
      );
      throw error;
    }
  }
}
