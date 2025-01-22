import { CreateItemInput, GetUserUniqueItemsInput } from '@app/dto/item.dto';
import { ItemService } from '@domain/services/item.service';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ItemAppService {
  private logger = new Logger(ItemAppService.name);

  constructor(private readonly itemService: ItemService) {}

  createItem(params: CreateItemInput) {
    return this.itemService.createItem(params);
  }

  async getUserUniqueItems(params: GetUserUniqueItemsInput) {
    return this.itemService.getUserUniqueItems(params);
  }
}
