class ModuleContainer {
    private modules = new Map<string, any>();

    // 모듈 등록
    register(moduleName: string, moduleInstance: any) {
        if (this.modules.has(moduleName)) {
            throw new Error(`Module ${moduleName} is already registered.`);
        }
        this.modules.set(moduleName, moduleInstance);
    }

    // 모듈 로딩
    get(moduleName: string): any {
        const module = this.modules.get(moduleName);
        if (!module) {
            throw new Error(`Module ${moduleName} not found.`);
        }
        return module;
    }
}



class UserService {
    getUser() {
        return { id: 1, name: 'John Doe' };
    }
}

class UserModule {
    private userService: UserService;

    constructor() {
        this.userService = new UserService();
    }

    getService() {
        return this.userService;
    }
}

// 모듈 컨테이너 초기화 및 모듈 등록
const container = new ModuleContainer();
container.register('UserModule', new UserModule());

// 모듈 로딩 및 의존성 관리
const userModule = container.get('UserModule') as UserModule;
console.log(userModule.getService().getUser());