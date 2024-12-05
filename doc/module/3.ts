class DynamicModuleContainer {
    private modules = new Map<string, () => any>();

    // 모듈 등록
    register(moduleName: string, loader: () => any) {
        this.modules.set(moduleName, loader);
    }

    // 동적 로딩
    async load(moduleName: string) {
        const loader = this.modules.get(moduleName);
        if (!loader) {
            throw new Error(`Module ${moduleName} not registered.`);
        }
        return loader();
    }
}

// 동적 로딩 예제
const dynamicContainer = new DynamicModuleContainer();

// 모듈 등록
dynamicContainer.register('LazyModule', async () => {
    const module = { name: 'Lazy Loaded Module' };
    console.log('Module Loaded:', module.name);
    return module;
});

// 동적 로딩
(async () => {
    const lazyModule = await dynamicContainer.load('LazyModule');
    console.log('Using Module:', lazyModule.name);
})();