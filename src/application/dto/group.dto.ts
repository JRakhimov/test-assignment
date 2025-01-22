import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGroupInput {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class LinkItemInput {
  groupId: number;

  itemId: number;
}

export class LinkUserInput {
  groupId: number;

  userId: number;
}
