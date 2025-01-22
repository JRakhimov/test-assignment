import { CreateItemInput, GetUserUniqueItemsInput } from '@app/dto/item.dto';
import { PrismaService } from '@libs/prisma';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ItemRepository {
  private logger = new Logger(ItemRepository.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(params: CreateItemInput) {
    const result = await this.prisma.item.create({
      data: { title: params.title },
    });

    return result;
  }

  async getUserUniqueItems(params: GetUserUniqueItemsInput) {
    const result = await this.prisma.$kysely
      .selectFrom('items as i')
      .innerJoin('items_to_groups as itg', 'i.id', 'itg.item_id')
      .innerJoin('groups as g', 'g.id', 'itg.group_id')
      .innerJoin('users_to_groups as utg', 'utg.group_id', 'g.id')
      .innerJoin('users as u', 'u.id', 'utg.user_id')
      .where('username', '=', params.username)
      .select('i.title')
      .distinct()
      .execute();

    return result;
  }
}
