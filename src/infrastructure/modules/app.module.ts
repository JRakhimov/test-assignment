import { AppConfig } from '@infrastructure/config';
import { AppController } from '@infrastructure/controllers/app.controller';
import { ConfigModule } from '@libs/config';
import { PrismaModule } from '@libs/prisma';
import { Module } from '@nestjs/common';
import { GroupModule } from './group.module';
import { ItemModule } from './item.module';
import { UserModule } from './user.module';

@Module({
  controllers: [AppController],
  imports: [PrismaModule, ConfigModule.forRoot(AppConfig), UserModule, ItemModule, GroupModule],
})
export class AppModule {}
