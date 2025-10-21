import { UserService } from "../src/services/UserService";
import { User } from "../src/entities/User";
import { AppError } from "../src/utils/AppError";
import { ErrorMessages } from "../src/constants/errorMessages";
import { UpdateUserDto } from "../src/dtos/UpdateUserDto";

describe("UserService", () => {
  let userService: UserService;
  let mockUserRepository: any;
  let mockCacheService: any;
  let mockEventService: any;

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
    mockUserRepository = {
      findById: jest.fn(),
      findByEmail: jest.fn(),
      findAll: jest.fn(),
      updateUser: jest.fn(),
      updateProfilePicture: jest.fn()
    };

    mockCacheService = {
      get: jest.fn(),
      set: jest.fn(),
      del: jest.fn()
    };

    mockEventService = {
      publishUserUpdated: jest.fn()
    };

    userService = new UserService(
      mockUserRepository,
      mockCacheService,
      mockEventService
    );
  });

  describe("findAll", () => {
    it("deve retornar uma lista paginada de usuários", async () => {
      const mockUsers = [mockUser];
      const mockTotal = 1;
      mockUserRepository.findAll.mockResolvedValue([mockUsers, mockTotal]);

      const result = await userService.findAll(1, 10);

      expect(result).toEqual({ users: mockUsers, total: mockTotal });
      expect(mockUserRepository.findAll).toHaveBeenCalledWith(1, 10);
    });

    it("deve lançar um erro quando o método findAll não está implementado", async () => {
      mockUserRepository.findAll = undefined;

      await expect(userService.findAll(1, 10)).rejects.toThrow(
        new AppError("Method not implemented", 500)
      );
    });

    it("deve propagar erros do repositório", async () => {
      mockUserRepository.findAll.mockRejectedValue(new Error("Database error"));

      await expect(userService.findAll(1, 10)).rejects.toThrow("Database error");
    });
  });

  describe("findById", () => {
    it("deve retornar um usuário do cache quando disponível", async () => {
      const userId = "1";
      mockCacheService.get.mockResolvedValue(JSON.stringify(mockUser));

      const result = await userService.findById(userId);

      expect(result).toEqual(mockUser);
      expect(mockCacheService.get).toHaveBeenCalledWith(`user:${userId}`);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
    });

    it("deve buscar do banco de dados e armazenar no cache quando não estiver no cache", async () => {
      const userId = "1";
      mockCacheService.get.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(mockUser);

      const result = await userService.findById(userId);

      expect(result).toEqual(mockUser);
      expect(mockCacheService.get).toHaveBeenCalledWith(`user:${userId}`);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockCacheService.set).toHaveBeenCalledWith(
        `user:${userId}`,
        JSON.stringify(mockUser),
        "EX",
        60
      );
    });

    it("deve lançar um erro quando o usuário não for encontrado", async () => {
      const userId = "nonexistent";
      mockCacheService.get.mockResolvedValue(null);
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.findById(userId)).rejects.toThrow(
        new AppError(ErrorMessages.USER_NOT_FOUND, 404)
      );
    });

    it("deve propagar AppError quando ocorrer", async () => {
      const userId = "1";
      mockCacheService.get.mockResolvedValue(null);
      mockUserRepository.findById.mockRejectedValue(
        new AppError("Custom error", 400)
      );

      await expect(userService.findById(userId)).rejects.toThrow(
        new AppError("Custom error", 400)
      );
    });

    it("deve converter erros genéricos em AppError", async () => {
      const userId = "1";
      mockCacheService.get.mockResolvedValue(null);
      mockUserRepository.findById.mockRejectedValue(new Error("Database error"));

      await expect(userService.findById(userId)).rejects.toThrow(
        new AppError("Error finding user", 500)
      );
    });
  });

  describe("update", () => {
    const updateData: UpdateUserDto = {
      name: "Updated Name",
      address: "Updated Address"
    };

    it("deve atualizar um usuário com sucesso", async () => {
      const userId = "1";
      const updatedUser = { ...mockUser, ...updateData };
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(updatedUser);

      const result = await userService.update(userId, updateData);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateUser).toHaveBeenCalledWith(userId, updateData);
      expect(mockCacheService.del).toHaveBeenCalledWith(`user:${userId}`);
      expect(mockEventService.publishUserUpdated).toHaveBeenCalledWith(userId);
    });

    it("deve lançar um erro quando o usuário não for encontrado", async () => {
      const userId = "nonexistent";
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.update(userId, updateData)).rejects.toThrow(
        new AppError(ErrorMessages.USER_NOT_FOUND, 404)
      );
    });

    it("deve verificar se o email já está em uso", async () => {
      const userId = "1";
      const updateWithEmail: UpdateUserDto = {
        email: "existing@example.com"
      };
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.findByEmail.mockResolvedValue({ id: "2", email: "existing@example.com" });

      await expect(userService.update(userId, updateWithEmail)).rejects.toThrow(
        new AppError(ErrorMessages.EMAIL_IN_USE, 400)
      );
    });

    it("deve permitir atualizar para o mesmo email", async () => {
      const userId = "1";
      const updateWithSameEmail: UpdateUserDto = {
        email: mockUser.email
      };
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue({ ...mockUser });

      await userService.update(userId, updateWithSameEmail);

      expect(mockUserRepository.findByEmail).not.toHaveBeenCalled();
    });

    it("deve lançar um erro quando a atualização falhar", async () => {
      const userId = "1";
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateUser.mockResolvedValue(null);

      await expect(userService.update(userId, updateData)).rejects.toThrow(
        new AppError("Failed to update user", 500)
      );
    });
  });

  describe("updateProfilePicture", () => {
    it("deve atualizar a foto de perfil com sucesso", async () => {
      const userId = "1";
      const profilePicture = "https://example.com/photo.jpg";
      const updatedUser = { ...mockUser, profilePicture };
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateProfilePicture.mockResolvedValue(updatedUser);

      const result = await userService.updateProfilePicture(userId, profilePicture);

      expect(result).toEqual(updatedUser);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.updateProfilePicture).toHaveBeenCalledWith(userId, profilePicture);
      expect(mockCacheService.del).toHaveBeenCalledWith(`user:${userId}`);
      expect(mockEventService.publishUserUpdated).toHaveBeenCalledWith(userId);
    });

    it("deve lançar um erro quando o usuário não for encontrado", async () => {
      const userId = "nonexistent";
      const profilePicture = "https://example.com/photo.jpg";
      
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(userService.updateProfilePicture(userId, profilePicture)).rejects.toThrow(
        new AppError(ErrorMessages.USER_NOT_FOUND, 404)
      );
    });

    it("deve lançar um erro quando a atualização da foto falhar", async () => {
      const userId = "1";
      const profilePicture = "https://example.com/photo.jpg";
      
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.updateProfilePicture.mockResolvedValue(null);

      await expect(userService.updateProfilePicture(userId, profilePicture)).rejects.toThrow(
        new AppError("Failed to update profile picture", 500)
      );
    });
  });
});