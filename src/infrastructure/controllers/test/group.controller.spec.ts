import { GroupAppService } from '@app/services/group.service';
import { GroupService } from '@domain/services/group.service';
import { GroupRepository } from '@infrastructure/database/group.repository';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { UserRepository } from '@infrastructure/database/user.repository';
import { Item, PrismaService, User } from '@libs/prisma';
import { Test, TestingModule } from '@nestjs/testing';
import { GroupController } from '../group.controller';
import { prepareMockDatabase, truncateMockData } from './utils';

describe('GroupController Integration', () => {
  let prismaServiceMock: PrismaService;

  let groupController: GroupController;
  let groupRepository: GroupRepository;

  let testUser: User;
  let testItem: Item;

  beforeAll(async () => {
    prismaServiceMock = await prepareMockDatabase();

    const userModule: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: prismaServiceMock }, UserRepository],
    }).compile();

    const userRepository = userModule.get<UserRepository>(UserRepository);

    const itemModule: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PrismaService, useValue: prismaServiceMock }, ItemRepository],
    }).compile();

    const itemRepository = itemModule.get<ItemRepository>(ItemRepository);

    const groupModule: TestingModule = await Test.createTestingModule({
      controllers: [GroupController],
      providers: [
        { provide: PrismaService, useValue: prismaServiceMock },
        { provide: UserRepository, useValue: userRepository },
        { provide: ItemRepository, useValue: itemRepository },
        GroupService,
        GroupAppService,
        GroupRepository,
      ],
    }).compile();

    groupController = groupModule.get<GroupController>(GroupController);
    groupRepository = groupModule.get<GroupRepository>(GroupRepository);

    testUser = await userRepository.create({ username: 'user' });

    testItem = await itemRepository.create({ title: 'item' });
  });

  afterAll(async () => {
    await truncateMockData(prismaServiceMock);

    await prismaServiceMock.$disconnect();
  });

  it('should create a group', async () => {
    const params = { title: 'group' };

    const result = await groupController.create(params);

    expect(result.id).toBe(1);
    expect(result.title).toBe('group');
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.updatedAt).toBeInstanceOf(Date);
  });

  describe('link user', () => {
    it('should successfully link user to group', async () => {
      const result = await groupController.linkUser(1, testUser.id);

      const pairCreated = await groupRepository.getUserGroupPair({ groupId: 1, userId: testUser.id });

      expect(result.groupId).toBe(1);
      expect(result.userId).toBe(testUser.id);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(pairCreated).not.toBeNull();
    });

    it('should throw error if pair exists', async () => {
      await expect(groupController.linkUser(1, testUser.id)).rejects.toThrow('User is already linked to the group');
    });

    it('should throw error if group does not exist', async () => {
      await expect(groupController.linkUser(2, testUser.id)).rejects.toThrow(`Group with id ${2} does not exist`);

      const pairCreated = await groupRepository.getUserGroupPair({ groupId: 2, userId: testUser.id });

      expect(pairCreated).toBeNull();
    });

    it('should throw error if user does not exist', async () => {
      await expect(groupController.linkUser(1, 99)).rejects.toThrow(`User with id ${99} does not exist`);

      const pairCreated = await groupRepository.getUserGroupPair({ groupId: 2, userId: testUser.id });

      expect(pairCreated).toBeNull();
    });
  });

  describe('link item', () => {
    it('should successfully link item to group', async () => {
      const result = await groupController.linkItem(1, testItem.id);

      const pairCreated = await groupRepository.getItemGroupPair({ groupId: 1, itemId: testItem.id });

      expect(result.groupId).toBe(1);
      expect(result.itemId).toBe(testItem.id);
      expect(result.createdAt).toBeInstanceOf(Date);
      expect(result.updatedAt).toBeInstanceOf(Date);
      expect(pairCreated).not.toBeNull();
    });

    it('should throw error if pair exists', async () => {
      await expect(groupController.linkItem(1, testItem.id)).rejects.toThrow('Item is already linked to the group');
    });

    it('should throw error if group does not exist', async () => {
      await expect(groupController.linkItem(2, testItem.id)).rejects.toThrow(`Group with id ${2} does not exist`);

      const pairCreated = await groupRepository.getItemGroupPair({ groupId: 2, itemId: testItem.id });

      expect(pairCreated).toBeNull();
    });

    it('should throw error if item does not exist', async () => {
      await expect(groupController.linkItem(1, 99)).rejects.toThrow(`Item with id ${99} does not exist`);

      const pairCreated = await groupRepository.getItemGroupPair({ groupId: 2, itemId: testItem.id });

      expect(pairCreated).toBeNull();
    });
  });
});
