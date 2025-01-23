import { IsEnum, IsString } from 'class-validator';
import { ConfigDefaultValue } from './config.utils';

export enum NodeENV {
  production = 'production',
  development = 'development',
  test = 'test',
}

export enum AppENV {
  production = 'production',
  staging = 'staging',
  development = 'development',
  local = 'local',
}

export class BaseConfig {
  /**
   * @optional
   * @default process.env.NODE_ENV ?? NodeENV.development
   */
  @IsEnum(NodeENV)
  @ConfigDefaultValue(process.env.NODE_ENV ?? NodeENV.development)
  nodeEnv: NodeENV;

  /**
   * @default process.env.APP_ENV ?? AppENV.local
   */
  @IsString()
  @ConfigDefaultValue(process.env.APP_ENV ?? AppENV.local)
  appEnv: string;
}
