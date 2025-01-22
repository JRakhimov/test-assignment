import { PrismaClient } from '@prisma/client';
import { KyselyExtension } from '../extensions/kysely.extensions';
import { prismaLogs, prismaLogsArgs } from './prisma.utils';

export function extendClient(base: PrismaClient) {
  prismaLogs(base);

  return base.$extends(KyselyExtension);
}

class UntypedExtendedClient extends PrismaClient {
  constructor(options?: object) {
    super({
      ...options,
      ...prismaLogsArgs(),
    });

    // eslint-disable-next-line no-constructor-return
    return extendClient(this) as this;
  }
}

const ExtendedPrismaClient = UntypedExtendedClient as unknown as new (
  options?: ConstructorParameters<typeof PrismaClient>[0],
) => ReturnType<typeof extendClient>;

export { ExtendedPrismaClient };
