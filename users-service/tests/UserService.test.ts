const { UserService } = require("../src/services/UserService");
const { UserRepository } = require("../src/repositories/UserRepository");
const { redis } = require("../src/config/redis");
const { EventService } = require("../src/services/EventService");

jest.mock("../src/repositories/UserRepository");

describe("UserService", () => {
  let userService: typeof UserService;
  const mockUser = {
    id: "1",
    name: "Test User",
    email: "test@example.com",
    address: "Test Address",
    bankingDetails: { agency: "001", account: "123456" },
    profilePicture: null,
  };

  beforeEach(() => {
    userService = new UserService();
    jest.clearAllMocks();
  });

  describe("findById", () => {
    it("should return user from cache if available", async () => {
      const userId = "1";
      (redis.get as jest.Mock).mockResolvedValueOnce(JSON.stringify(mockUser));

      const result = await userService.findById(userId);

      expect(result).toEqual(mockUser);
      expect(redis.get).toHaveBeenCalledWith(`user:${userId}`);
    });

    it("should fetch from database and cache if not in cache", async () => {
      const userId = "1";
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      (UserRepository.prototype.findById as jest.Mock).mockResolvedValueOnce(
        mockUser
      );

      const result = await userService.findById(userId);

      expect(result).toEqual(mockUser);
      expect(redis.get).toHaveBeenCalledWith(`user:${userId}`);
      expect(redis.set).toHaveBeenCalledWith(
        `user:${userId}`,
        JSON.stringify(mockUser),
        "EX",
        60
      );
    });

    it("should throw error if user not found", async () => {
      const userId = "1";
      (redis.get as jest.Mock).mockResolvedValueOnce(null);
      (UserRepository.prototype.findById as jest.Mock).mockResolvedValueOnce(
        null
      );

      await expect(userService.findById(userId)).rejects.toThrow(
        "User not found"
      );
    });
  });

  describe("update", () => {
    it("should update user and publish event", async () => {
      const userId = "1";
      const updateData = { name: "Updated Name" };

      (UserRepository.prototype.findById as jest.Mock).mockResolvedValueOnce(
        mockUser
      );
      (UserRepository.prototype.updateUser as jest.Mock).mockResolvedValueOnce({
        ...mockUser,
        ...updateData,
      });

      const result = await userService.update(userId, updateData);

      expect(result.name).toBe(updateData.name);
      expect(redis.del).toHaveBeenCalledWith(`user:${userId}`);
      expect(EventService.publishUserUpdated).toHaveBeenCalledWith(userId);
    });
  });
});
