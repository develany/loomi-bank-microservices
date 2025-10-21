import { Repository } from "typeorm";
import { TransactionRepository } from "../src/modules/transactions/repositories/TransactionRepository";
import { Transaction } from "../src/modules/transactions/entities/Transaction";
import { TransactionStatus } from "../src/modules/transactions/types/TransactionTypes";
import { LoggerService } from "../src/shared/services/logger.service";
import { PaginatedResult } from "../src/shared/interfaces/PaginatedResult";

describe("TransactionRepository", () => {
  let repository: TransactionRepository;
  let typeormRepository: Repository<Transaction>;
  let loggerService: LoggerService;

  const mockTransaction: Transaction = {
    id: "transaction-id",
    senderUserId: "sender-id",
    receiverUserId: "receiver-id",
    amount: 100,
    description: "Test transaction",
    status: TransactionStatus.SUCCESS,
    createdAt: new Date(),
  };

  const mockCreateDto: Partial<Transaction> = {
    senderUserId: "sender-id",
    receiverUserId: "receiver-id",
    amount: 100,
    description: "Test transaction",
    status: TransactionStatus.SUCCESS,
  };

  beforeEach(() => {
    typeormRepository = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      findAndCount: jest.fn(),
    } as unknown as Repository<Transaction>;

    loggerService = {
      setContext: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
    } as unknown as LoggerService;

    repository = new TransactionRepository(typeormRepository, loggerService);
  });

  it("deve estar definido", () => {
    expect(repository).toBeDefined();
  });

  describe("create", () => {
    it("deve criar uma nova transação", async () => {
      jest.spyOn(typeormRepository, "create").mockReturnValue(mockTransaction);
      jest.spyOn(typeormRepository, "save").mockResolvedValue(mockTransaction);

      const result = await repository.create(mockCreateDto);

      expect(result).toEqual(mockTransaction);
      expect(typeormRepository.create).toHaveBeenCalledWith(mockCreateDto);
      expect(typeormRepository.save).toHaveBeenCalledWith(mockTransaction);
    });

    it("deve propagar erros ao criar uma transação", async () => {
      const error = new Error("Database error");
      jest.spyOn(typeormRepository, "create").mockReturnValue(mockTransaction);
      jest.spyOn(typeormRepository, "save").mockRejectedValue(error);
      jest.spyOn(loggerService, "error");

      await expect(repository.create(mockCreateDto)).rejects.toThrow(error);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("deve encontrar uma transação pelo ID", async () => {
      jest.spyOn(typeormRepository, "findOne").mockResolvedValue(mockTransaction);

      const result = await repository.findById("transaction-id");

      expect(result).toEqual(mockTransaction);
      expect(typeormRepository.findOne).toHaveBeenCalledWith({
        where: { id: "transaction-id" },
      });
    });

    it("deve retornar null quando a transação não for encontrada", async () => {
      jest.spyOn(typeormRepository, "findOne").mockResolvedValue(null);

      const result = await repository.findById("nonexistent-id");

      expect(result).toBeNull();
    });

    it("deve propagar erros ao buscar uma transação por ID", async () => {
      const error = new Error("Database error");
      jest.spyOn(typeormRepository, "findOne").mockRejectedValue(error);
      jest.spyOn(loggerService, "error");

      await expect(repository.findById("transaction-id")).rejects.toThrow(error);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });

  describe("findByUser", () => {
    it("deve retornar transações paginadas para um usuário", async () => {
      const mockTransactions = [mockTransaction];
      const mockTotal = 1;

      jest.spyOn(typeormRepository, "findAndCount").mockResolvedValue([mockTransactions, mockTotal]);

      const result = await repository.findByUser("user-id", 1, 10);

      const expectedResult: PaginatedResult<Transaction> = {
        data: mockTransactions,
        meta: {
          total: mockTotal,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      expect(result).toEqual(expectedResult);
      
      expect(typeormRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          { senderUserId: "user-id" },
          { receiverUserId: "user-id" }
        ],
        order: {
          createdAt: "DESC",
        },
        skip: 0,
        take: 10,
      });
    });

    it("deve usar valores padrão para paginação quando não fornecidos", async () => {
      const mockTransactions = [mockTransaction];
      const mockTotal = 1;

      jest.spyOn(typeormRepository, "findAndCount").mockResolvedValue([mockTransactions, mockTotal]);

      await repository.findByUser("user-id");

      expect(typeormRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          { senderUserId: "user-id" },
          { receiverUserId: "user-id" }
        ],
        order: {
          createdAt: "DESC",
        },
        skip: 0,
        take: 10,
      });
    });

    it("deve calcular corretamente o número total de páginas", async () => {
      const mockTransactions = Array(5).fill(mockTransaction);
      const mockTotal = 25;

      jest.spyOn(typeormRepository, "findAndCount").mockResolvedValue([mockTransactions, mockTotal]);

      const result = await repository.findByUser("user-id", 2, 10);

      expect(result.meta).toEqual({
        total: mockTotal,
        page: 2,
        limit: 10,
        totalPages: 3, // 25 itens / 10 por página = 2.5 -> arredonda para 3 páginas
      });
      
      expect(typeormRepository.findAndCount).toHaveBeenCalledWith({
        where: [
          { senderUserId: "user-id" },
          { receiverUserId: "user-id" }
        ],
        order: {
          createdAt: "DESC",
        },
        skip: 10, // (page - 1) * limit = (2 - 1) * 10 = 10
        take: 10,
      });
    });

    it("deve propagar erros ao buscar transações por usuário", async () => {
      const error = new Error("Database error");
      jest.spyOn(typeormRepository, "findAndCount").mockRejectedValue(error);
      jest.spyOn(loggerService, "error");

      await expect(repository.findByUser("user-id")).rejects.toThrow(error);
      expect(loggerService.error).toHaveBeenCalled();
    });
  });
});