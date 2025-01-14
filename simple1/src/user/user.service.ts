// src/user/user.service.ts
import { Injectable } from '../decorators/injectable.decorator';

@Injectable()
export class UserService {
    getUsers() {
        return ['User1', 'User2'];
    }
}