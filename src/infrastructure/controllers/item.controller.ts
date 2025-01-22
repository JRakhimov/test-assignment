import { CreateItemInput } from '@app/dto/item.dto';
import { ItemAppService } from '@app/services/item.service';
import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Item } from '@prisma/client';

@Controller('items')
export class ItemController {
  constructor(private readonly itemService: ItemAppService) {}

  @Post('/')
  create(@Body() input: CreateItemInput): Promise<Item> {
    return this.itemService.createItem(input);
  }

  @Get('/')
  async getUserItems(@Query('username') username?: string): Promise<string[]> {
    if (username == null) {
      throw new BadRequestException(`Query parameter 'username' is required`);
    }

    return this.itemService.getUserUniqueItems({ username });
  }
}
