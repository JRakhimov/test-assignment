import { CreateGroupInput, LinkItemInput, LinkUserInput } from '@app/dto/group.dto';
import { GroupService } from '@domain/services/group.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroupAppService {
  private logger = new Logger(GroupAppService.name);

  constructor(private readonly groupService: GroupService) {}

  createGroup(params: CreateGroupInput) {
    return this.groupService.createGroup(params);
  }

  async linkUser(params: LinkUserInput) {
    return this.groupService.linkUser(params);
  }

  linkItem(params: LinkItemInput) {
    return this.groupService.linkItem(params);
  }
}
