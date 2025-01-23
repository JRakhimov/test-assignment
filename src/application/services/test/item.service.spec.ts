import { ItemService } from '@domain/services/item.service';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('ItemAppService', () => {
  let itemService: ItemService;
  let itemRepositoryMock: Partial<ItemRepository>;

  beforeEach(async () => {
    itemRepositoryMock = {
      create: jest.fn().mockResolvedValue({ id: 1, title: 'test_item' }),
      getUserUniqueItems: jest.fn().mockResolvedValue([
        { id: 1, title: 'test_item' },
        { id: 2, title: 'second_item' },
      ]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ItemService, { provide: ItemRepository, useValue: itemRepositoryMock }],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
  });

  it('should create an item successfully', async () => {
    const params = { title: 'test_item' };

    const result = await itemService.createItem(params);

    expect(itemRepositoryMock.create).toHaveBeenCalledWith(params);
    expect(result).toEqual({ id: 1, title: 'test_item' });
  });

  describe('getUserUniqueItems', () => {
    it("should get user's unique items successfully", async () => {
      const result = await itemService.getUserUniqueItems({ username: 'test_user' });

      expect(itemRepositoryMock.getUserUniqueItems).toHaveBeenCalled();
      expect(result).toEqual(['test_item', 'second_item']);
    });

    it('should get empty array if user not found', async () => {
      itemRepositoryMock.getUserUniqueItems = jest.fn().mockResolvedValue([]);

      const result = await itemService.getUserUniqueItems({ username: 'unknown_user' });

      expect(itemRepositoryMock.getUserUniqueItems).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
