import { CreateUserInput } from '@app/dto/user.dto';
import { UserAppService } from '@app/services/user.service';
import { Body, Controller, Post } from '@nestjs/common';
import { User } from '@prisma/client';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserAppService) {}

  @Post('/')
  create(@Body() input: CreateUserInput): Promise<User> {
    return this.userService.createUser(input);
  }
}
