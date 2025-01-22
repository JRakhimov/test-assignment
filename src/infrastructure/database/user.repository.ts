import { CreateUserInput } from '@app/dto/user.dto';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserRepository {
  private logger = new Logger(UserRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findByUsername(params: { username: string }) {
    const result = await this.prisma.user.findUnique({
      where: { username: params.username },
    });

    return result;
  }

  async create(params: CreateUserInput) {
    const result = await this.prisma.user.create({
      data: { username: params.username },
    });

    return result;
  }
}
