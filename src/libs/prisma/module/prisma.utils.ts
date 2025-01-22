import { Logger } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';

export const prismaLogsArgs: () => { log: Prisma.LogDefinition[] } | object = () =>
  process.env.PRISMA_LOGS ? { log: [{ emit: 'event', level: 'query' }] } : {};

export const prismaLogs = (client: PrismaClient, index = 'main') => {
  const logger = new Logger(`PrismaClient[${index}]`);

  if (process.env.PRISMA_LOGS) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    client.$on('query', async ({ query, params, duration }: { query: string; params: string; duration: number }) => {
      const data: {
        query: string;
        params: string | undefined;
        duration: number;
      } = {
        query,
        duration,
        params: undefined,
      };

      if (process.env.APP_ENV === 'local') {
        data.params = params;
      }

      if (duration > (process.env.PRISMA_SLOW_INDICATOR_MS ? Number(process.env.PRISMA_SLOW_INDICATOR_MS) : 500)) {
        logger.warn('Slow query detected', JSON.stringify(data, null, 2));
      } else {
        logger.log('Prisma query', JSON.stringify(data, null, 2));
      }
    });
  }
};
