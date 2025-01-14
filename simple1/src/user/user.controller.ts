import { Controller } from '../decorators/controller.decorator';
import {Get, Post} from "../decorators/request.decorator";

@Controller('users')
export class UserController {
    // @ts-ignore
    @Get('/')
    getUsers() {
        return ['User1', 'User2'];
    }

    // @ts-ignore
    @Post('/')
    createUser() {
        return 'User created';
    }
}