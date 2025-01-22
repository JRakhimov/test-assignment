import { CreateUserInput } from '@app/dto/user.dto';
import { UserService } from '@domain/services/user.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserAppService {
  private logger = new Logger(UserAppService.name);

  constructor(private readonly userService: UserService) {}

  createUser(params: CreateUserInput) {
    return this.userService.createUser(params);
  }
}
