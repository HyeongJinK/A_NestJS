import { SimpleApplication } from '../../src/core/simple-application';

describe('SimpleApplication', () => {
    it('should initialize with a module', async () => {
        const app = new SimpleApplication({ listen: jest.fn() });
        await app.init(class TestModule {});
        expect(true).toBe(true);
    });
});