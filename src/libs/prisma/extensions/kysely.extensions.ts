import { Kysely, PostgresAdapter, PostgresIntrospector, PostgresQueryCompiler } from 'kysely';
import kyselyExtension from 'prisma-extension-kysely';

import type { DB } from '../kysely/types';

export const KyselyExtension = kyselyExtension({
  kysely: (driver) =>
    new Kysely<DB>({
      dialect: {
        createDriver: () => driver,
        createAdapter: () => new PostgresAdapter(),
        createIntrospector: (db) => new PostgresIntrospector(db),
        createQueryCompiler: () => new PostgresQueryCompiler(),
      },
      plugins: [],
    }),
});
