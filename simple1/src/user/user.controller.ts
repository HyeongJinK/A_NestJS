import { Controller } from '../decorators/controller.decorator';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}

    getAllUsers() {
        return this.userService.getUsers();
    }
}