import { Transaction } from "../entities/Transaction";
import { PaginatedResult } from "../../../shared/interfaces/PaginatedResult";

export interface ITransactionRepository {
  create(data: Partial<Transaction>): Promise<Transaction>;
  findById(id: string): Promise<Transaction>;
  findByUser(
    userId: string,
    page?: number,
    limit?: number
  ): Promise<PaginatedResult<Transaction>>;
}
