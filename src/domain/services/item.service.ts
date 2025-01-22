import { CreateItemInput, GetUserUniqueItemsInput } from '@app/dto/item.dto';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ItemService {
  private logger = new Logger(ItemService.name);

  constructor(private readonly itemRepository: ItemRepository) {}

  async createItem(params: CreateItemInput) {
    return this.itemRepository.create(params);
  }

  async getUserUniqueItems(params: GetUserUniqueItemsInput) {
    const items = await this.itemRepository.getUserUniqueItems(params);

    return items.map((x) => x.title);
  }
}
