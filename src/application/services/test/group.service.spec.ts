import { GroupService } from '@domain/services/group.service';
import { GroupRepository } from '@infrastructure/database/group.repository';
import { ItemRepository } from '@infrastructure/database/item.repository';
import { UserRepository } from '@infrastructure/database/user.repository';
import { Test, TestingModule } from '@nestjs/testing';

describe('GroupAppService', () => {
  let groupService: GroupService;
  let groupRepositoryMock: Partial<GroupRepository>;
  let userRepositoryMock: Partial<UserRepository>;
  let itemRepositoryMock: Partial<ItemRepository>;

  beforeEach(async () => {
    groupRepositoryMock = {
      create: jest.fn().mockResolvedValue({ id: 1, title: 'A' }),
      findById: jest.fn().mockResolvedValue({ id: 1, title: 'A' }),
      getUserGroupPair: jest.fn().mockResolvedValue(null),
      getItemGroupPair: jest.fn().mockResolvedValue(null),
      linkUser: jest.fn().mockResolvedValue({ groupId: 1, userId: 1 }),
      linkItem: jest.fn().mockResolvedValue({ groupId: 1, itemId: 1 }),
    };

    userRepositoryMock = {
      findById: jest.fn().mockResolvedValue({ id: 1, username: 'user' }),
    };

    itemRepositoryMock = {
      findById: jest.fn().mockResolvedValue({ id: 1, title: 'item' }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GroupService,
        { provide: GroupRepository, useValue: groupRepositoryMock },
        { provide: UserRepository, useValue: userRepositoryMock },
        { provide: ItemRepository, useValue: itemRepositoryMock },
      ],
    }).compile();

    groupService = module.get<GroupService>(GroupService);
  });

  it('should create a group successfully', async () => {
    const title = 'A';

    const result = await groupService.createGroup({ title });

    expect(groupRepositoryMock.create).toHaveBeenCalledWith({ title });
    expect(result).toEqual({ id: 1, title: 'A' });
  });

  describe('link user', () => {
    it('should link a user to a group successfully', async () => {
      const params = {
        userId: 1,
        groupId: 1,
      };

      const result = await groupService.linkUser(params);

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toEqual({ id: 1, title: 'A' });

      expect(userRepositoryMock.findById).toHaveBeenCalledWith({ id: params.userId });
      expect(await userRepositoryMock.findById!({ id: params.userId })).toEqual({ id: 1, username: 'user' });

      expect(groupRepositoryMock.getUserGroupPair).toHaveBeenCalledWith(params);
      expect(await groupRepositoryMock.getUserGroupPair!(params)).toBeNull();

      expect(groupRepositoryMock.linkUser).toHaveBeenCalledWith(params);
      expect(result).toEqual(params);
    });

    it('should throw an error if the group does not exist', async () => {
      const params = {
        userId: 1,
        groupId: 2,
      };

      groupRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(groupService.linkUser(params)).rejects.toThrow(`Group with id ${params.groupId} does not exist`);

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toBeNull();

      expect(userRepositoryMock.findById).not.toHaveBeenCalled();
      expect(groupRepositoryMock.getUserGroupPair).not.toHaveBeenCalled();
      expect(groupRepositoryMock.linkUser).not.toHaveBeenCalled();
    });

    it('should throw an error if the user does not exist', async () => {
      const params = {
        userId: 2,
        groupId: 1,
      };

      userRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(groupService.linkUser(params)).rejects.toThrow(`User with id ${params.userId} does not exist`);

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toEqual({ id: 1, title: 'A' });

      expect(userRepositoryMock.findById).toHaveBeenCalledWith({ id: params.userId });
      expect(await userRepositoryMock.findById!({ id: params.userId })).toBeNull();

      expect(groupRepositoryMock.getUserGroupPair).not.toHaveBeenCalled();
      expect(groupRepositoryMock.linkUser).not.toHaveBeenCalled();
    });

    it('should throw an error if the user is already linked to the group', async () => {
      const params = {
        userId: 1,
        groupId: 1,
      };

      groupRepositoryMock.getUserGroupPair = jest.fn().mockResolvedValue(params);

      await expect(groupService.linkUser(params)).rejects.toThrow('User is already linked to the group');

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toEqual({ id: 1, title: 'A' });

      expect(userRepositoryMock.findById).toHaveBeenCalledWith({ id: params.userId });
      expect(await userRepositoryMock.findById!({ id: params.userId })).toEqual({ id: 1, username: 'user' });

      expect(groupRepositoryMock.getUserGroupPair).toHaveBeenCalledWith(params);
      expect(await groupRepositoryMock.getUserGroupPair!(params)).toEqual(params);

      expect(groupRepositoryMock.linkUser).not.toHaveBeenCalled();
    });
  });

  describe('link item', () => {
    it('should link an item to a group successfully', async () => {
      const params = {
        itemId: 1,
        groupId: 1,
      };

      const result = await groupService.linkItem(params);

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toEqual({ id: 1, title: 'A' });

      expect(itemRepositoryMock.findById).toHaveBeenCalledWith({ id: params.itemId });
      expect(await itemRepositoryMock.findById!({ id: params.itemId })).toEqual({ id: 1, title: 'item' });

      expect(groupRepositoryMock.getItemGroupPair).toHaveBeenCalledWith(params);
      expect(await groupRepositoryMock.getItemGroupPair!(params)).toBeNull();

      expect(groupRepositoryMock.linkItem).toHaveBeenCalledWith(params);
      expect(result).toEqual(params);
    });

    it('should throw an error if the group does not exist', async () => {
      const params = {
        itemId: 1,
        groupId: 2,
      };

      groupRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(groupService.linkItem(params)).rejects.toThrow(`Group with id ${params.groupId} does not exist`);

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toBeNull();

      expect(itemRepositoryMock.findById).not.toHaveBeenCalled();
      expect(groupRepositoryMock.getItemGroupPair).not.toHaveBeenCalled();
      expect(groupRepositoryMock.linkItem).not.toHaveBeenCalled();
    });

    it('should throw an error if the item does not exist', async () => {
      const params = {
        itemId: 2,
        groupId: 1,
      };

      itemRepositoryMock.findById = jest.fn().mockResolvedValue(null);

      await expect(groupService.linkItem(params)).rejects.toThrow(`Item with id ${params.itemId} does not exist`);

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toEqual({ id: 1, title: 'A' });

      expect(itemRepositoryMock.findById).toHaveBeenCalledWith({ id: params.itemId });
      expect(await itemRepositoryMock.findById!({ id: params.itemId })).toBeNull();

      expect(groupRepositoryMock.getItemGroupPair).not.toHaveBeenCalled();
      expect(groupRepositoryMock.linkItem).not.toHaveBeenCalled();
    });

    it('should throw an error if the item is already linked to the group', async () => {
      const params = {
        itemId: 1,
        groupId: 1,
      };

      groupRepositoryMock.getItemGroupPair = jest.fn().mockResolvedValue(params);

      await expect(groupService.linkItem(params)).rejects.toThrow('Item is already linked to the group');

      expect(groupRepositoryMock.findById).toHaveBeenCalledWith({ id: params.groupId });
      expect(await groupRepositoryMock.findById!({ id: params.groupId })).toEqual({ id: 1, title: 'A' });

      expect(itemRepositoryMock.findById).toHaveBeenCalledWith({ id: params.itemId });
      expect(await itemRepositoryMock.findById!({ id: params.itemId })).toEqual({ id: 1, title: 'item' });

      expect(groupRepositoryMock.getItemGroupPair).toHaveBeenCalledWith(params);
      expect(await groupRepositoryMock.getItemGroupPair!(params)).toEqual(params);

      expect(groupRepositoryMock.linkItem).not.toHaveBeenCalled();
    });
  });
});
