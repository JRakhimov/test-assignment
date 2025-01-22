import { CreateGroupInput, LinkItemInput, LinkUserInput } from '@app/dto/group.dto';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class GroupRepository {
  private logger = new Logger(GroupRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async findById(params: { id: number }) {
    const result = await this.prisma.group.findUnique({
      where: { id: params.id },
    });

    return result;
  }

  async create(params: CreateGroupInput) {
    const result = await this.prisma.group.create({
      data: { title: params.title },
    });

    return result;
  }

  async getUserGroupPair(params: LinkUserInput) {
    const result = await this.prisma.userToGroup.findUnique({
      where: {
        userId_groupId: {
          groupId: params.groupId,
          userId: params.userId,
        },
      },
    });

    return result;
  }

  async linkUser(params: LinkUserInput) {
    const result = await this.prisma.userToGroup.create({
      data: { group: { connect: { id: params.groupId } }, user: { connect: { id: params.userId } } },
    });

    return result;
  }

  async getItemGroupPair(params: LinkItemInput) {
    const result = await this.prisma.itemToGroup.findUnique({
      where: {
        itemId_groupId: {
          groupId: params.groupId,
          itemId: params.itemId,
        },
      },
    });

    return result;
  }

  async linkItem(params: LinkItemInput) {
    const result = await this.prisma.itemToGroup.create({
      data: { group: { connect: { id: params.groupId } }, item: { connect: { id: params.itemId } } },
    });

    return result;
  }
}
