import { GroupAppService } from '@app/services/group.service';
import { GroupService } from '@domain/services/group.service';
import { GroupController } from '@infrastructure/controllers/group.controller';
import { GroupRepository } from '@infrastructure/database/group.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [GroupController],
  providers: [GroupAppService, GroupService, GroupRepository],
})
export class GroupModule {}
