import { CreateGroupInput, LinkItemInput, LinkUserInput } from '@app/dto/group.dto';
import { GroupRepository } from '@infrastructure/database/group.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroupService {
  private logger = new Logger(GroupService.name);

  constructor(private readonly groupRepository: GroupRepository) {}

  async createGroup(params: CreateGroupInput) {
    return this.groupRepository.create(params);
  }

  async linkUser(params: LinkUserInput) {
    const pairExists = await this.groupRepository.getUserGroupPair(params);

    if (pairExists) {
      throw new BadRequestException('User is already linked to the group');
    }

    return this.groupRepository.linkUser(params);
  }

  async linkItem(params: LinkItemInput) {
    const pairExists = await this.groupRepository.getItemGroupPair(params);

    if (pairExists) {
      throw new BadRequestException('Item is already linked to the group');
    }

    return this.groupRepository.linkItem(params);
  }
}
