import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { TransactionService } from "../services/TransactionService";
import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { Transaction } from "../entities/Transaction";
import { PaginatedResult } from "../../../shared/interfaces/PaginatedResult";
import { LoggerService } from "../../../shared/services/logger.service";

@ApiTags("transactions")
@Controller("api/transactions")
@UseInterceptors(ClassSerializerInterceptor)
export class TransactionController {
  constructor(
    private readonly transactionService: TransactionService,
    private readonly logger: LoggerService
  ) {
    this.logger.setContext("TransactionController");
  }

  @Post()
  @ApiOperation({ summary: "Create a new transaction" })
  @ApiResponse({ status: 201, description: "Transaction created successfully" })
  @ApiResponse({ status: 400, description: "Bad request" })
  async create(@Body() data: CreateTransactionDto): Promise<Transaction> {
    this.logger.log("Creating new transaction");
    return this.transactionService.create(data);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get transaction by ID" })
  @ApiParam({ name: "id", description: "Transaction ID" })
  @ApiResponse({ status: 200, description: "Transaction found" })
  @ApiResponse({ status: 404, description: "Transaction not found" })
  async findOne(@Param("id") id: string): Promise<Transaction> {
    this.logger.log(`Finding transaction by ID: ${id}`);
    return this.transactionService.findById(id);
  }

  @Get("user/:userId")
  @ApiOperation({ summary: "Get transactions by user ID" })
  @ApiParam({ name: "userId", description: "User ID" })
  @ApiQuery({ name: "page", required: false, description: "Page number" })
  @ApiQuery({ name: "limit", required: false, description: "Items per page" })
  @ApiResponse({ status: 200, description: "Transactions found" })
  async findByUser(
    @Param("userId") userId: string,
    @Query("page") page: number = 1,
    @Query("limit") limit: number = 10
  ): Promise<PaginatedResult<Transaction>> {
    this.logger.log(
      `Finding transactions for user: ${userId}, page: ${page}, limit: ${limit}`
    );
    return this.transactionService.findByUser(userId, page, limit);
  }
}
