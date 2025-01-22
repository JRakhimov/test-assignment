import { CreateItemInput } from '@app/dto/item.dto';
import { GroupAppService } from '@app/services/group.service';
import { Body, Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { Group, ItemToGroup, UserToGroup } from '@prisma/client';

@Controller('groups')
export class GroupController {
  constructor(private readonly groupService: GroupAppService) {}

  @Post('/')
  create(@Body() input: CreateItemInput): Promise<Group> {
    return this.groupService.createGroup(input);
  }

  @Post('/:groupId/users/:userId')
  linkUser(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<UserToGroup> {
    return this.groupService.linkUser({ groupId, userId });
  }

  @Post('/:groupId/items/:itemId')
  linkItem(
    @Param('groupId', ParseIntPipe) groupId: number,
    @Param('itemId', ParseIntPipe) itemId: number,
  ): Promise<ItemToGroup> {
    return this.groupService.linkItem({ groupId, itemId });
  }
}
