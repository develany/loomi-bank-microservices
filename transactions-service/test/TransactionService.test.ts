import { BadRequestException, NotFoundException } from "@nestjs/common";
import { TransactionService } from "../src/modules/transactions/services/TransactionService";
import { CreateTransactionDto } from "../src/modules/transactions/dtos/CreateTransactionDto";
import { Transaction } from "../src/modules/transactions/entities/Transaction";
import { TransactionStatus } from "../src/modules/transactions/types/TransactionTypes";
import { ErrorMessages } from "../src/shared/constants/errorMessages";
import { AxiosResponse } from "axios";
import { PaginatedResult } from "../src/shared/interfaces/PaginatedResult";
import { ConfigService } from "../src/config/config.service";
import { LoggerService } from "../src/shared/services/logger.service";

describe("TransactionService", () => {
  let service: TransactionService;
  let mockRepository: any;
  let mockHttpService: any;
  let mockEventService: any;
  let mockConfigService: any;
  let mockLoggerService: any;

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

  // Helper para criar uma resposta Axios mockada
  const createAxiosResponse = <T>(data: T): AxiosResponse<T> => {
    return {
      data,
      status: 200,
      statusText: "OK",
      headers: {},
      config: { headers: {} } as any,
    };
  };

  beforeEach(() => {
    // Criar mocks simples usando objetos com funções jest.fn()
    mockRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      findByUser: jest.fn(),
    };

    mockHttpService = {
      get: jest.fn(),
      post: jest.fn(),
    };

    mockEventService = {
      publishTransactionCreated: jest.fn(),
    };

    // Mock do ConfigService com apenas as propriedades necessárias
    mockConfigService = {
      externalServices: {
        usersApi: "http://users-api",
      },
      logging: {
        level: "debug",
      },
      isProduction: false,
      isDevelopment: true,
    };

    // Mock do LoggerService com apenas os métodos necessários
    mockLoggerService = {
      setContext: jest.fn().mockReturnThis(),
      log: jest.fn(),
      debug: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      verbose: jest.fn(),
    };

    // Criar a instância do serviço com os mocks
    service = new TransactionService(
      mockRepository,
      mockHttpService,
      mockEventService,
      mockConfigService,
      mockLoggerService
    );
  });

  it("deve estar definido", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    beforeEach(() => {
      mockHttpService.get.mockImplementation((url: string) => {
        if (url.includes("sender-id")) {
          return Promise.resolve(
            createAxiosResponse({ id: "sender-id", name: "Sender" })
          );
        } else if (url.includes("receiver-id")) {
          return Promise.resolve(
            createAxiosResponse({ id: "receiver-id", name: "Receiver" })
          );
        }
        return Promise.resolve(createAxiosResponse(null));
      });
    });

    it("deve criar uma nova transação com sucesso", async () => {
      mockRepository.create.mockResolvedValue(mockTransaction);
      mockEventService.publishTransactionCreated.mockResolvedValue(undefined);

      const result = await service.create(mockCreateDto);

      expect(result).toEqual(mockTransaction);
      expect(mockHttpService.get).toHaveBeenCalledTimes(2);
      expect(mockRepository.create).toHaveBeenCalledWith({
        ...mockCreateDto,
        status: TransactionStatus.SUCCESS,
      });
      expect(mockEventService.publishTransactionCreated).toHaveBeenCalledWith(
        mockTransaction.id
      );
    });

    it("deve lançar BadRequestException quando o remetente e o destinatário são o mesmo usuário", async () => {
      const sameUserDto = {
        ...mockCreateDto,
        senderUserId: "same-id",
        receiverUserId: "same-id",
      };

      await expect(service.create(sameUserDto)).rejects.toThrow(
        new BadRequestException(ErrorMessages.SAME_USER_TRANSFER)
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar BadRequestException quando o remetente não for encontrado", async () => {
      mockHttpService.get.mockImplementation((url: string) => {
        if (url.includes("sender-id")) {
          return Promise.resolve(createAxiosResponse(null));
        } else if (url.includes("receiver-id")) {
          return Promise.resolve(
            createAxiosResponse({ id: "receiver-id", name: "Receiver" })
          );
        }
        return Promise.resolve(createAxiosResponse(null));
      });

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new BadRequestException(ErrorMessages.SENDER_USER_NOT_FOUND)
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar BadRequestException quando o destinatário não for encontrado", async () => {
      mockHttpService.get.mockImplementation((url: string) => {
        if (url.includes("sender-id")) {
          return Promise.resolve(
            createAxiosResponse({ id: "sender-id", name: "Sender" })
          );
        } else if (url.includes("receiver-id")) {
          return Promise.resolve(createAxiosResponse(null));
        }
        return Promise.resolve(createAxiosResponse(null));
      });

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new BadRequestException(ErrorMessages.RECEIVER_USER_NOT_FOUND)
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar BadRequestException quando o serviço de usuários retornar erro", async () => {
      mockHttpService.get.mockRejectedValue({
        response: {
          data: {
            message: "Service unavailable",
          },
        },
      });

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new BadRequestException("Service unavailable")
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });

    it("deve lançar BadRequestException genérica quando ocorrer erro na criação", async () => {
      mockHttpService.get.mockImplementation((url: string) => {
        if (url.includes("sender-id")) {
          return Promise.resolve(
            createAxiosResponse({ id: "sender-id", name: "Sender" })
          );
        } else if (url.includes("receiver-id")) {
          return Promise.resolve(
            createAxiosResponse({ id: "receiver-id", name: "Receiver" })
          );
        }
        return Promise.resolve(createAxiosResponse(null));
      });

      mockRepository.create.mockRejectedValue(new Error("Database error"));

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new BadRequestException(ErrorMessages.TRANSACTION_CREATION_FAILED)
      );
    });

    it("deve lançar BadRequestException quando o serviço de eventos falhar", async () => {
      mockRepository.create.mockResolvedValue(mockTransaction);
      mockEventService.publishTransactionCreated.mockRejectedValue(
        new Error("Event service error")
      );

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new BadRequestException(ErrorMessages.TRANSACTION_CREATION_FAILED)
      );
    });

    it("deve lançar BadRequestException quando o serviço de usuários não retornar resposta", async () => {
      mockHttpService.get.mockRejectedValue(new Error("Network error"));

      await expect(service.create(mockCreateDto)).rejects.toThrow(
        new BadRequestException(ErrorMessages.USERS_SERVICE_ERROR)
      );
      expect(mockRepository.create).not.toHaveBeenCalled();
    });
  });

  describe("findById", () => {
    it("deve retornar uma transação quando encontrada", async () => {
      mockRepository.findById.mockResolvedValue(mockTransaction);

      const result = await service.findById("transaction-id");

      expect(result).toEqual(mockTransaction);
      expect(mockRepository.findById).toHaveBeenCalledWith("transaction-id");
    });

    it("deve lançar NotFoundException quando a transação não for encontrada", async () => {
      mockRepository.findById.mockResolvedValue(null);

      await expect(service.findById("nonexistent-id")).rejects.toThrow(
        new NotFoundException(ErrorMessages.TRANSACTION_NOT_FOUND)
      );
    });

    it("deve propagar erros ao buscar uma transação", async () => {
      const error = new Error("Database error");
      mockRepository.findById.mockRejectedValue(error);

      await expect(service.findById("transaction-id")).rejects.toThrow(error);
    });
  });

  describe("findByUser", () => {
    it("deve retornar transações paginadas para um usuário", async () => {
      const mockPaginatedResult: PaginatedResult<Transaction> = {
        data: [mockTransaction],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockRepository.findByUser.mockResolvedValue(mockPaginatedResult);

      const result = await service.findByUser("user-id", 1, 10);

      expect(result).toEqual(mockPaginatedResult);
      expect(mockRepository.findByUser).toHaveBeenCalledWith("user-id", 1, 10);
    });

    it("deve usar valores padrão para paginação quando não fornecidos", async () => {
      const mockPaginatedResult: PaginatedResult<Transaction> = {
        data: [mockTransaction],
        meta: {
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      mockRepository.findByUser.mockResolvedValue(mockPaginatedResult);

      await service.findByUser("user-id");

      expect(mockRepository.findByUser).toHaveBeenCalledWith("user-id", 1, 10);
    });

    it("deve propagar erros ao buscar transações por usuário", async () => {
      const error = new Error("Database error");
      mockRepository.findByUser.mockRejectedValue(error);

      await expect(service.findByUser("user-id")).rejects.toThrow(error);
    });
  });
});
