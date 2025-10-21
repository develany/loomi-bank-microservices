import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from "@nestjs/common";
import { ITransactionService } from "../interfaces/ITransactionService";
import { ITransactionRepository } from "../interfaces/ITransactionRepository";
import { Transaction } from "../entities/Transaction";
import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { PaginatedResult } from "../../../shared/interfaces/PaginatedResult";
import { HttpService } from "../../../shared/services/http.service";
import { EventService } from "../../../shared/services/event.service";
import { ConfigService } from "../../../config/config.service";
import { LoggerService } from "../../../shared/services/logger.service";
import { ErrorMessages } from "../../../shared/constants/errorMessages";
import { TransactionStatus } from "../types/TransactionTypes";

@Injectable()
export class TransactionService implements ITransactionService {
  constructor(
    private readonly transactionRepository: ITransactionRepository,
    private readonly httpService: HttpService,
    private readonly eventService: EventService,
    private readonly configService: ConfigService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext("TransactionService");
  }

  private async validateUsers(
    senderUserId: string,
    receiverUserId: string
  ): Promise<void> {
    try {
      if (senderUserId === receiverUserId) {
        throw new BadRequestException(ErrorMessages.SAME_USER_TRANSFER);
      }

      const usersApi = this.configService.externalServices.usersApi;
      this.logger.debug(`Validating users with API: ${usersApi}`);

      const [sender, receiver] = await Promise.all([
        this.httpService.get(`${usersApi}/api/users/${senderUserId}`),
        this.httpService.get(`${usersApi}/api/users/${receiverUserId}`),
      ]);

      if (!sender.data) {
        throw new BadRequestException(ErrorMessages.SENDER_USER_NOT_FOUND);
      }

      if (!receiver.data) {
        throw new BadRequestException(ErrorMessages.RECEIVER_USER_NOT_FOUND);
      }

      this.logger.debug("Users validated successfully");
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      if (error.response) {
        this.logger.error(
          `User validation error: ${error.response.data.message}`,
          error.stack
        );
        throw new BadRequestException(
          error.response.data.message || ErrorMessages.USERS_SERVICE_ERROR
        );
      }

      this.logger.error(`User validation error: ${error.message}`, error.stack);
      throw new BadRequestException(ErrorMessages.USERS_SERVICE_ERROR);
    }
  }

  async create(data: CreateTransactionDto): Promise<Transaction> {
    try {
      this.logger.log(
        `Creating transaction from ${data.senderUserId} to ${data.receiverUserId} for amount ${data.amount}`
      );

      await this.validateUsers(data.senderUserId, data.receiverUserId);

      const transaction = await this.transactionRepository.create({
        ...data,
        status: TransactionStatus.SUCCESS,
      });

      await this.eventService.publishTransactionCreated(transaction.id);

      this.logger.log(`Transaction created successfully: ${transaction.id}`);
      return transaction;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(
        `Failed to create transaction: ${error.message}`,
        error.stack
      );
      throw new BadRequestException(ErrorMessages.TRANSACTION_CREATION_FAILED);
    }
  }

  async findById(id: string): Promise<Transaction> {
    this.logger.debug(`Finding transaction by ID: ${id}`);

    const transaction = await this.transactionRepository.findById(id);
    if (!transaction) {
      this.logger.warn(`Transaction not found: ${id}`);
      throw new NotFoundException(ErrorMessages.TRANSACTION_NOT_FOUND);
    }

    return transaction;
  }

  async findByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResult<Transaction>> {
    this.logger.debug(
      `Finding transactions for user: ${userId}, page: ${page}, limit: ${limit}`
    );
    return await this.transactionRepository.findByUser(userId, page, limit);
  }
}
