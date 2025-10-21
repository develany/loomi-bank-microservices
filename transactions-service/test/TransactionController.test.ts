import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from "../src/modules/transactions/controllers/TransactionController";
import { TransactionService } from "../src/modules/transactions/services/TransactionService";
import { LoggerService } from "../src/shared/services/logger.service";
import { CreateTransactionDto } from "../src/modules/transactions/dtos/CreateTransactionDto";
import { Transaction } from "../src/modules/transactions/entities/Transaction";
import { TransactionStatus } from "../src/modules/transactions/types/TransactionTypes";
import { BadRequestException, NotFoundException } from "@nestjs/common";

describe("TransactionController", () => {
  let controller: TransactionController;
  let service: TransactionService;
  let logger: LoggerService;

  const mockTransaction: Transaction = {
    id: "transaction-id",
    senderUserId: "sender-id",
    receiverUserId: "receiver-id",
    amount: 100,
    description: "Test transaction",
    status: TransactionStatus.SUCCESS,
    createdAt: new Date(),
  };

  const mockCreateDto: CreateTransactionDto = {
    senderUserId: "sender-id",
    receiverUserId: "receiver-id",
    amount: 100,
    description: "Test transaction",
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        {
          provide: TransactionService,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByUser: jest.fn(),
          },
        },
        {
          provide: LoggerService,
          useValue: {
            setContext: jest.fn(),
            log: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
    logger = module.get<LoggerService>(LoggerService);
  });

  it("deve estar definido", () => {
    expect(controller).toBeDefined();
  });

  describe("create", () => {
    it("deve criar uma nova transação", async () => {
      jest.spyOn(service, "create").mockResolvedValue(mockTransaction);
      jest.spyOn(logger, "log");

      const result = await controller.create(mockCreateDto);

      expect(result).toEqual(mockTransaction);
      expect(service.create).toHaveBeenCalledWith(mockCreateDto);
      expect(logger.log).toHaveBeenCalledWith("Creating new transaction");
    });

    it("deve propagar erros do serviço", async () => {
      const error = new BadRequestException("Erro ao criar transação");
      jest.spyOn(service, "create").mockRejectedValue(error);

      await expect(controller.create(mockCreateDto)).rejects.toThrow(error);
    });
  });

  describe("findOne", () => {
    it("deve retornar uma transação pelo ID", async () => {
      jest.spyOn(service, "findById").mockResolvedValue(mockTransaction);
      jest.spyOn(logger, "log");

      const result = await controller.findOne("transaction-id");

      expect(result).toEqual(mockTransaction);
      expect(service.findById).toHaveBeenCalledWith("transaction-id");
      expect(logger.log).toHaveBeenCalledWith(
        "Finding transaction by ID: transaction-id"
      );
    });

    it("deve propagar erros do serviço quando a transação não for encontrada", async () => {
      const error = new NotFoundException("Transação não encontrada");
      jest.spyOn(service, "findById").mockRejectedValue(error);

      await expect(controller.findOne("nonexistent-id")).rejects.toThrow(error);
    });
  });

  describe("findByUser", () => {
    it("deve retornar transações paginadas para um usuário", async () => {
      const mockPaginatedResult = {
        data: [mockTransaction],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      jest.spyOn(service, "findByUser").mockResolvedValue(mockPaginatedResult);
      jest.spyOn(logger, "log");

      const result = await controller.findByUser("user-id", 1, 10);

      expect(result).toEqual(mockPaginatedResult);
      expect(service.findByUser).toHaveBeenCalledWith("user-id", 1, 10);
      expect(logger.log).toHaveBeenCalledWith(
        "Finding transactions for user: user-id, page: 1, limit: 10"
      );
    });

    it("deve usar valores padrão para paginação quando não fornecidos", async () => {
      const mockPaginatedResult = {
        data: [mockTransaction],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      jest.spyOn(service, "findByUser").mockResolvedValue(mockPaginatedResult);

      await controller.findByUser("user-id");

      expect(service.findByUser).toHaveBeenCalledWith("user-id", 1, 10);
    });

    it("deve aceitar parâmetros de string para paginação", async () => {
      const mockPaginatedResult = {
        data: [mockTransaction],
        meta: {
          total: 1,
          page: 2,
          limit: 5,
          totalPages: 1,
        },
      };

      jest.spyOn(service, "findByUser").mockResolvedValue(mockPaginatedResult);

      // Simulando parâmetros de query que vêm como string
      const result = await controller.findByUser(
        "user-id",
        "2" as unknown as number,
        "5" as unknown as number
      );

      expect(result).toEqual(mockPaginatedResult);
      // No controlador atual, não há conversão explícita, então os valores são passados como estão
      expect(service.findByUser).toHaveBeenCalledWith(
        "user-id",
        "2" as unknown as number,
        "5" as unknown as number
      );
    });

    it("deve propagar erros do serviço", async () => {
      const error = new Error("Erro ao buscar transações");
      jest.spyOn(service, "findByUser").mockRejectedValue(error);

      await expect(controller.findByUser("user-id")).rejects.toThrow(error);
    });
  });
});