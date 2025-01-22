import { ItemAppService } from '@app/services/item.service';
import { ItemService } from '@domain/services/item.service';
import { ItemController } from '@infrastructure/controllers/item.controller';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ItemController],
  providers: [ItemAppService, ItemService, ItemRepository],
  exports: [ItemRepository],
})
export class ItemModule {}
