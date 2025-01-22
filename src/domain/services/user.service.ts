import { CreateUserInput } from '@app/dto/user.dto';
import { UserRepository } from '@infrastructure/database/user.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  async createUser(params: CreateUserInput) {
    const userExists = await this.userRepository.findByUsername(params);

    if (userExists) {
      throw new BadRequestException('User with provided username already exists');
    }

    return this.userRepository.create(params);
  }
}
