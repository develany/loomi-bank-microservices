import { Request, Response } from "express";
import { UserController } from "../src/controllers/UserController";
import { UserService } from "../src/services/UserService";
import { User } from "../src/entities/User";
import { UpdateUserDto } from "../src/dtos/UpdateUserDto";
import { UpdateProfilePictureDto } from "../src/dtos/UpdateProfilePictureDto";

// Mocks para os serviços
jest.mock("../src/services/UserService");
jest.mock("../src/config/database", () => ({
  AppDataSource: {
    createEntityManager: jest.fn()
  }
}));

describe("UserController", () => {
  let userController: UserController;
  let mockUserService: jest.MockedObject<UserService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

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
    // Limpar todos os mocks
    jest.clearAllMocks();

    // Criar mock do UserService
    const UserServiceMock = UserService as jest.MockedClass<typeof UserService>;
    mockUserService = {
      findAll: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      updateProfilePicture: jest.fn()
    } as unknown as jest.MockedObject<UserService>;

    // Criar uma instância do UserController e substituir o serviço
    userController = new UserController();
    (userController as any).userService = mockUserService;

    // Configuração dos mocks de Request e Response
    mockRequest = {
      params: {},
      query: {},
      body: {}
    };

    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis()
    };
  });

  describe("findAll", () => {
    it("deve retornar uma lista paginada de usuários", async () => {
      const mockUsers = [mockUser];
      const mockTotal = 1;
      (mockUserService.findAll as jest.Mock).mockResolvedValue({ users: mockUsers, total: mockTotal });

      mockRequest.query = { page: "1", limit: "10" };

      await userController.findAll(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findAll).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalledWith({
        users: mockUsers,
        pagination: {
          total: mockTotal,
          page: 1,
          limit: 10,
          pages: 1
        }
      });
    });

    it("deve usar valores padrão para paginação quando não fornecidos", async () => {
      const mockUsers = [mockUser];
      const mockTotal = 1;
      (mockUserService.findAll as jest.Mock).mockResolvedValue({ users: mockUsers, total: mockTotal });

      mockRequest.query = {};

      await userController.findAll(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findAll).toHaveBeenCalledWith(1, 10);
    });
  });

  describe("findOne", () => {
    it("deve retornar um usuário pelo ID", async () => {
      (mockUserService.findById as jest.Mock).mockResolvedValue(mockUser);
      mockRequest.params = { userId: "1" };

      await userController.findOne(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.findById).toHaveBeenCalledWith("1");
      expect(mockResponse.json).toHaveBeenCalledWith(mockUser);
    });
  });

  describe("update", () => {
    it("deve atualizar um usuário", async () => {
      const updateData: UpdateUserDto = {
        name: "Updated Name",
        address: "Updated Address"
      };

      const updatedUser = { ...mockUser, ...updateData };
      (mockUserService.update as jest.Mock).mockResolvedValue(updatedUser);

      mockRequest.params = { userId: "1" };
      mockRequest.body = updateData;

      await userController.update(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.update).toHaveBeenCalledWith("1", updateData);
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });
  });

  describe("updateProfilePicture", () => {
    it("deve atualizar a foto de perfil de um usuário", async () => {
      const profilePictureData: UpdateProfilePictureDto = {
        profilePicture: "https://example.com/photo.jpg"
      };

      const updatedUser = { ...mockUser, profilePicture: profilePictureData.profilePicture };
      (mockUserService.updateProfilePicture as jest.Mock).mockResolvedValue(updatedUser);

      mockRequest.params = { userId: "1" };
      mockRequest.body = profilePictureData;

      await userController.updateProfilePicture(mockRequest as Request, mockResponse as Response);

      expect(mockUserService.updateProfilePicture).toHaveBeenCalledWith(
        "1",
        profilePictureData.profilePicture
      );
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });
  });
});