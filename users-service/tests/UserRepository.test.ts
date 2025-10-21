import { DataSource, Repository, FindManyOptions } from "typeorm";
import { UserRepository } from "../src/repositories/UserRepository";
import { User } from "../src/entities/User";

describe("UserRepository", () => {
  let userRepository: UserRepository;
  let mockDataSource: Partial<DataSource>;
  let mockEntityManager: any;
  let mockBaseRepository: {
    findOne: jest.Mock;
    findAndCount: jest.Mock;
    update: jest.Mock;
  };

  const mockUser: User = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    address: "Test Address",
    bankingDetails: { agency: "001", account: "123456" },
    profilePicture: null,
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(() => {
    // Mock do EntityManager
    mockEntityManager = {
      findOne: jest.fn(),
      find: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn(),
      save: jest.fn()
    };

    // Mock do DataSource
    mockDataSource = {
      createEntityManager: jest.fn().mockReturnValue(mockEntityManager)
    };

    // Mock dos métodos herdados de Repository com tipagem explícita de jest.Mock
    mockBaseRepository = {
      findOne: jest.fn(),
      findAndCount: jest.fn(),
      update: jest.fn()
    };

    // Criação do repositório com o DataSource mockado
    userRepository = new UserRepository(mockDataSource as DataSource);

    // Substituição dos métodos herdados pelos mocks
    userRepository.findOne = mockBaseRepository.findOne as any;
    userRepository.findAndCount = mockBaseRepository.findAndCount as any;
    userRepository.update = mockBaseRepository.update as any;
  });

  describe("findById", () => {
    it("deve encontrar um usuário pelo ID", async () => {
      mockBaseRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findById("1");

      expect(result).toEqual(mockUser);
      expect(mockBaseRepository.findOne).toHaveBeenCalledWith({ where: { id: "1" } });
    });

    it("deve retornar null quando o usuário não for encontrado", async () => {
      mockBaseRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findById("nonexistent");

      expect(result).toBeNull();
    });
  });

  describe("findByEmail", () => {
    it("deve encontrar um usuário pelo email", async () => {
      mockBaseRepository.findOne.mockResolvedValue(mockUser);

      const result = await userRepository.findByEmail("test@example.com");

      expect(result).toEqual(mockUser);
      expect(mockBaseRepository.findOne).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
    });

    it("deve retornar null quando o email não for encontrado", async () => {
      mockBaseRepository.findOne.mockResolvedValue(null);

      const result = await userRepository.findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });
  });

  describe("findAll", () => {
    it("deve retornar usuários paginados", async () => {
      const mockUsers = [mockUser];
      const mockTotal = 1;
      mockBaseRepository.findAndCount.mockResolvedValue([mockUsers, mockTotal]);

      const result = await userRepository.findAll(1, 10);

      expect(result).toEqual([mockUsers, mockTotal]);
      expect(mockBaseRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: "DESC" }
      });
    });

    it("deve usar valores padrão para paginação quando não fornecidos", async () => {
      const mockUsers = [mockUser];
      const mockTotal = 1;
      mockBaseRepository.findAndCount.mockResolvedValue([mockUsers, mockTotal]);

      await userRepository.findAll();

      expect(mockBaseRepository.findAndCount).toHaveBeenCalledWith({
        skip: 0,
        take: 10,
        order: { createdAt: "DESC" }
      });
    });
  });

  describe("updateUser", () => {
    it("deve atualizar um usuário e retornar o usuário atualizado", async () => {
      const updateData = { name: "Updated Name" };
      const updatedUser = { ...mockUser, ...updateData };
      
      mockBaseRepository.update.mockResolvedValue({ affected: 1 });
      userRepository.findById = jest.fn().mockResolvedValue(updatedUser);

      const result = await userRepository.updateUser("1", updateData);

      expect(result).toEqual(updatedUser);
      expect(mockBaseRepository.update).toHaveBeenCalledWith("1", updateData);
      expect(userRepository.findById).toHaveBeenCalledWith("1");
    });
  });

  describe("updateProfilePicture", () => {
    it("deve atualizar a foto de perfil e retornar o usuário atualizado", async () => {
      const profilePicture = "https://example.com/photo.jpg";
      const updatedUser = { ...mockUser, profilePicture };
      
      mockBaseRepository.update.mockResolvedValue({ affected: 1 });
      userRepository.findById = jest.fn().mockResolvedValue(updatedUser);

      const result = await userRepository.updateProfilePicture("1", profilePicture);

      expect(result).toEqual(updatedUser);
      expect(mockBaseRepository.update).toHaveBeenCalledWith("1", { profilePicture });
      expect(userRepository.findById).toHaveBeenCalledWith("1");
    });
  });
});