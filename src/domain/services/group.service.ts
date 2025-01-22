import { CreateGroupInput, LinkItemInput, LinkUserInput } from '@app/dto/group.dto';
import { GroupRepository } from '@infrastructure/database/group.repository';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { UserRepository } from '@infrastructure/database/user.repository';
import { BadRequestException, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroupService {
  private logger = new Logger(GroupService.name);

  constructor(
    private readonly groupRepository: GroupRepository,
    private readonly userRepository: UserRepository,
    private readonly itemRepository: ItemRepository,
  ) {}

  async createGroup(params: CreateGroupInput) {
    return this.groupRepository.create(params);
  }

  async linkUser(params: LinkUserInput) {
    const groupExists = await this.groupRepository.findById({ id: params.groupId });

    if (!groupExists) {
      throw new BadRequestException(`Group with id ${params.groupId} does not exist`);
    }

    const userExists = await this.userRepository.findById({ id: params.userId });

    if (!userExists) {
      throw new BadRequestException(`User with id ${params.userId} does not exist`);
    }

    const pairExists = await this.groupRepository.getUserGroupPair(params);

    if (pairExists) {
      throw new BadRequestException('User is already linked to the group');
    }

    return this.groupRepository.linkUser(params);
  }

  async linkItem(params: LinkItemInput) {
    const groupExists = await this.groupRepository.findById({ id: params.groupId });

    if (!groupExists) {
      throw new BadRequestException(`Group with id ${params.groupId} does not exist`);
    }

    const itemExists = await this.itemRepository.findById({ id: params.itemId });

    if (!itemExists) {
      throw new BadRequestException(`Item with id ${params.itemId} does not exist`);
    }

    const pairExists = await this.groupRepository.getItemGroupPair(params);

    if (pairExists) {
      throw new BadRequestException('Item is already linked to the group');
    }

    return this.groupRepository.linkItem(params);
  }
}
