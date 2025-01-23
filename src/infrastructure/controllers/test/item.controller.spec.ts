import { ItemAppService } from '@app/services/item.service';
import { ItemService } from '@domain/services/item.service';
import { GroupRepository } from '@infrastructure/database/group.repository';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { UserRepository } from '@infrastructure/database/user.repository';
import { PrismaService } from '@libs/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from '../item.controller';
import { prepareMockDatabase, truncateMockData } from './utils';

describe('ItemController Integration', () => {
  let prismaServiceMock: PrismaService;

  let itemController: ItemController;
  let itemRepository: ItemRepository;

  let groupRepository: GroupRepository;
  let userRepository: UserRepository;

  beforeAll(async () => {
    prismaServiceMock = await prepareMockDatabase();

    const itemModule: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [{ provide: PrismaService, useValue: prismaServiceMock }, ItemService, ItemAppService, ItemRepository],
    }).compile();

    itemController = itemModule.get<ItemController>(ItemController);
    itemRepository = itemModule.get<ItemRepository>(ItemRepository);

    const groupModule: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: prismaServiceMock }, GroupRepository],
    }).compile();

    groupRepository = groupModule.get<GroupRepository>(GroupRepository);

    const userModule: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: prismaServiceMock }, UserRepository],
    }).compile();

    userRepository = userModule.get<UserRepository>(UserRepository);
  });

  afterAll(async () => {
    await prismaServiceMock.$disconnect();
  });

  afterEach(async () => {
    await truncateMockData(prismaServiceMock);
  });

  it('should create an item', async () => {
    const params = { title: 'item' };

    const result = await itemController.create(params);

    expect(result.id).toBe(1);
    expect(result.title).toBe('item');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  describe("user's unique items", () => {
    it('should return empty array if user not found', async () => {
      const result = await itemController.getUserItems('john');

      expect(result).toHaveLength(0);
    });

    it('should return unique items #1', async () => {
      const user = await userRepository.create({ username: 'user' });

      const groupA = await groupRepository.create({ title: 'A' });
      const groupB = await groupRepository.create({ title: 'B' });

      const itemA1 = await itemRepository.create({ title: 'A1' });
      const itemA2 = await itemRepository.create({ title: 'A2' });
      const itemA3 = await itemRepository.create({ title: 'A3' });

      const itemB1 = await itemRepository.create({ title: 'B1' });

      await groupRepository.linkUser({ userId: user.id, groupId: groupA.id });
      await groupRepository.linkUser({ userId: user.id, groupId: groupB.id });

      await groupRepository.linkItem({ itemId: itemA1.id, groupId: groupA.id });
      await groupRepository.linkItem({ itemId: itemA2.id, groupId: groupA.id });

      await groupRepository.linkItem({ itemId: itemA1.id, groupId: groupB.id });
      await groupRepository.linkItem({ itemId: itemB1.id, groupId: groupB.id });
      await groupRepository.linkItem({ itemId: itemA3.id, groupId: groupB.id });

      const result = await itemController.getUserItems('user');

      expect(result).toContain('A1');
      expect(result).toContain('A2');
      expect(result).toContain('B1');
      expect(result).toContain('A3');
      expect(result).toHaveLength(4);
    });

    it('should return unique items #2', async () => {
      const user = await userRepository.create({ username: 'user' });

      const groupA = await groupRepository.create({ title: 'A' });
      const groupB = await groupRepository.create({ title: 'B' });

      const itemA1 = await itemRepository.create({ title: 'A1' });
      const itemA2 = await itemRepository.create({ title: 'A2' });

      const itemB1 = await itemRepository.create({ title: 'B1' });
      const itemB2 = await itemRepository.create({ title: 'B2' });

      await groupRepository.linkUser({ userId: user.id, groupId: groupA.id });

      await groupRepository.linkItem({ itemId: itemA1.id, groupId: groupA.id });
      await groupRepository.linkItem({ itemId: itemA2.id, groupId: groupA.id });

      await groupRepository.linkItem({ itemId: itemB1.id, groupId: groupB.id });
      await groupRepository.linkItem({ itemId: itemB2.id, groupId: groupB.id });

      const result = await itemController.getUserItems('user');

      expect(result).toContain('A1');
      expect(result).toContain('A2');
      expect(result).toHaveLength(2);
    });

    it('should return unique items #3', async () => {
      const user = await userRepository.create({ username: 'user' });

      const groupA = await groupRepository.create({ title: 'A' });
      const groupB = await groupRepository.create({ title: 'B' });
      const groupC = await groupRepository.create({ title: 'C' });

      const itemA1 = await itemRepository.create({ title: 'A1' });
      const itemA2 = await itemRepository.create({ title: 'A2' });

      const itemB1 = await itemRepository.create({ title: 'B1' });

      const itemC1 = await itemRepository.create({ title: 'C1' });

      await groupRepository.linkUser({ userId: user.id, groupId: groupA.id });
      await groupRepository.linkUser({ userId: user.id, groupId: groupB.id });
      await groupRepository.linkUser({ userId: user.id, groupId: groupC.id });

      await groupRepository.linkItem({ itemId: itemA1.id, groupId: groupA.id });
      await groupRepository.linkItem({ itemId: itemA2.id, groupId: groupA.id });

      await groupRepository.linkItem({ itemId: itemB1.id, groupId: groupB.id });
      await groupRepository.linkItem({ itemId: itemC1.id, groupId: groupB.id });

      await groupRepository.linkItem({ itemId: itemC1.id, groupId: groupC.id });
      await groupRepository.linkItem({ itemId: itemA2.id, groupId: groupC.id });

      const result = await itemController.getUserItems('user');

      expect(result).toContain('A1');
      expect(result).toContain('A2');
      expect(result).toContain('B1');
      expect(result).toContain('C1');
      expect(result).toHaveLength(4);
    });
  });
});
