import 'dotenv/config';

import { DynamicModule, Global, Module, ValueProvider } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { CONFIG_OPTIONS } from './config.constants';
import { ConfigService } from './config.service';

@Global()
@Module({})
export class ConfigModule {
  static forRoot(options: ClassConstructor<any>): DynamicModule {
    const configOptions: ValueProvider = {
      provide: CONFIG_OPTIONS,
      useValue: options,
    };

    return {
      global: true,
      module: ConfigModule,
      providers: [ConfigService, configOptions],
      exports: [ConfigService, configOptions],
    };
  }
}
