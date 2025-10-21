import { Test, TestingModule } from "@nestjs/testing";
import { TransactionService } from "../src/modules/transactions/services/TransactionService";
import { TransactionRepository } from "../src/modules/transactions/repositories/TransactionRepository";
import { CreateTransactionDto } from "../src/modules/transactions/dtos/CreateTransactionDto";
import { BadRequestException } from "@nestjs/common";

jest.mock("axios");

describe("TransactionService", () => {
  let service: TransactionService;
  let repository: TransactionRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: TransactionRepository,
          useValue: {
            create: jest.fn(),
            findById: jest.fn(),
            findByUser: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repository = module.get<TransactionRepository>(TransactionRepository);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  describe("create", () => {
    it("should create a new transaction", async () => {
      const createDto: CreateTransactionDto = {
        senderUserId: "1",
        receiverUserId: "2",
        amount: 100,
        description: "Test transaction",
      };

      const mockTransaction = {
        id: "test-id",
        ...createDto,
        status: "SUCCESS",
        createdAt: new Date(),
      };

      jest.spyOn(repository, "create").mockResolvedValue(mockTransaction);

      const result = await service.create(createDto);

      expect(result).toEqual(mockTransaction);
      expect(repository.create).toHaveBeenCalledWith({
        ...createDto,
        status: "SUCCESS",
      });
    });

    it("should throw BadRequestException when sender user is not found", async () => {
      const createDto: CreateTransactionDto = {
        senderUserId: "invalid-id",
        receiverUserId: "2",
        amount: 100,
      };

      await expect(service.create(createDto)).rejects.toThrow(
        BadRequestException
      );
    });
  });
});
