import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

export const configValidator = (validationType: ClassConstructor<any>, data: object) => {
  const validatedConfig: any = plainToInstance(validationType, data, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(['Env variables validation failed:', errors.map((e) => e.toString()).join('')].join('\n\n'));
  }

  return validatedConfig;
};
