import { Transaction } from "../entities/Transaction";
import { CreateTransactionDto } from "../dtos/CreateTransactionDto";
import { PaginatedResult } from "../../../shared/interfaces/PaginatedResult";

export interface ITransactionService {
  create(data: CreateTransactionDto): Promise<Transaction>;
  findById(id: string): Promise<Transaction>;
  findByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<Transaction>>;
}
