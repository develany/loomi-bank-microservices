// Make Jest's test functions available globally
require('@jest/globals');

// Mock AppDataSource
jest.mock('../src/config/database', () => ({
    AppDataSource: {
        getRepository: jest.fn(),
        createEntityManager: jest.fn(),
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

// Mock logger
jest.mock('../src/utils/logger', () => ({
    logger: {
        info: jest.fn(),
        error: jest.fn(),
        debug: jest.fn(),
        warn: jest.fn()
    }
}));

// Clear all mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});

// Mock cleanup after all tests
afterAll(async () => {
    // Cleanup mocks if needed
});