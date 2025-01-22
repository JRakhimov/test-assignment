import { UserAppService } from '@app/services/user.service';
import { UserService } from '@domain/services/user.service';
import { UserController } from '@infrastructure/controllers/user.controller';
import { UserRepository } from '@infrastructure/database/user.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [UserController],
  providers: [UserAppService, UserService, UserRepository],
  exports: [UserRepository],
})
export class UserModule {}
