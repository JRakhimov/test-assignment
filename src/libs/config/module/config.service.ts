/* eslint-disable @typescript-eslint/no-explicit-any */
import { Inject, Injectable } from '@nestjs/common';
import { ClassConstructor } from 'class-transformer';
import { CONFIG_OPTIONS } from './config.constants';
import { configValidator } from './config.validator';

@Injectable()
export class ConfigService<T> {
  private internalConfig: T;

  constructor(
    @Inject(CONFIG_OPTIONS)
    protected readonly ConfigClass: ClassConstructor<any>,
  ) {
    const config = new this.ConfigClass();

    configValidator(this.ConfigClass, config);
    this.internalConfig = config as T;
  }

  get config() {
    return this.internalConfig;
  }
}
