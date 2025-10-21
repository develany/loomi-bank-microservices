/// <reference types="jest" />

declare const beforeAll: typeof jest.beforeAll;
declare const beforeEach: typeof jest.beforeEach;
declare const afterAll: typeof jest.afterAll;
declare const afterEach: typeof jest.afterEach;
declare const describe: typeof jest.describe;
declare const it: typeof jest.it;
declare const expect: typeof jest.expect;

declare namespace NodeJS {
    interface Global {
        expect: jest.Expect;
    }
}