import { ModuleScanner } from '../../src/core/module-scanner';

describe('ModuleScanner', () => {
    it('should scan module metadata', () => {
        class TestModule {}
        Reflect.defineMetadata('module', { controllers: [] }, TestModule);

        const scanner = new ModuleScanner();
        const metadata = scanner.scan(TestModule);
        // console.log("")
        expect(metadata).toHaveProperty('controllers');
    });
});