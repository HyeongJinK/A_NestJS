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






class EventBus {
    private listeners = new Map<string, Function[]>();

    // 이벤트 등록
    on(event: string, listener: Function) {
        if (!this.listeners.has(event)) {   // 이벤트가 등록되어 있지 않다면
            this.listeners.set(event, []);  // 이벤트를 등록, 빈 배열로 초기화
        }
        this.listeners.get(event)!.push(listener);  // 이벤트에 리스너 추가
    }

    // 이벤트 발생
    emit(event: string, payload: any) {
        const listeners = this.listeners.get(event) || [];  // 이벤트에 등록된 리스너 가져오기 (없으면 빈 배열)
        listeners.forEach(listener => listener(payload));   // 이벤트에 등록된 리스너 호출
    }
}

// 모듈 A
class UserModule {
    constructor(private eventBus: EventBus) {}

    createUser(user: { id: number; name: string }) {
        console.log('User created:', user);
        this.eventBus.emit('userCreated', user);    // 이벤트 발생
    }
}

// 모듈 B
class NotificationModule {
    constructor(private eventBus: EventBus) {
        this.eventBus.on('userCreated', (user: any) => this.notify(user));
    }

    notify(user: any) {
        console.log('Notification sent for user:', user.name);
    }
}

// 이벤트 버스 생성 및 모듈 초기화
const eventBus = new EventBus();
const userModule = new UserModule(eventBus);
const notificationModule = new NotificationModule(eventBus);

// 사용자 생성 및 이벤트 발생
userModule.createUser({ id: 1, name: 'John Doe' });








class UserService {
    getUser() {
        return { id: 1, name: 'John Doe' };
    }
}

class AuthService {
    constructor(private userService: UserService) {}

    authenticate(userId: number) {
        const user = this.userService.getUser();
        return user.id === userId ? 'Authenticated' : 'Not Authenticated';
    }
}

const userService = new UserService();
const authService = new AuthService(userService);

console.log(authService.authenticate(1)); // Authenticated