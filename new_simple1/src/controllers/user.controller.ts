// controllers/user.controller.ts
import { Controller, Get } from '../decorators';
import { UserService } from '../services/user.service';
import { container } from '../container';

@Controller('/users')
export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = container.get(UserService);
  }

  @Get('/')
  getAllUsers(req: any, res: any) {
    const users = this.userService.getUsers();
    res.json(users);
  }
}
