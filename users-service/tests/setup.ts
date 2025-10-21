// Make Jest's test functions available globally
require('@jest/globals');
const { redis } = require('../src/config/redis');

// Mock AppDataSource
jest.mock('../src/config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
        destroy: jest.fn().mockResolvedValue(undefined),
    },
}));

// Mock Redis
jest.mock('../src/config/redis', () => ({
    redis: {
        get: jest.fn(),
        set: jest.fn(),
        del: jest.fn(),
        quit: jest.fn().mockResolvedValue(undefined),
    },
}));

// Mock RabbitMQ events
jest.mock('../src/services/EventService', () => ({
    EventService: {
        publishUserUpdated: jest.fn(),
    },
}));

// Clear all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

// Close connections after all tests
afterAll(async () => {
    await redis.quit();
});