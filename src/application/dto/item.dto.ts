import { IsNotEmpty, IsString } from 'class-validator';

export class CreateItemInput {
  @IsString()
  @IsNotEmpty()
  title: string;
}

export class GetUserUniqueItemsInput {
  username: string;
}
