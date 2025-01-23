/* eslint-disable import/no-extraneous-dependencies */
import { PGlite } from '@electric-sql/pglite';
import { PrismaService } from '@libs/prisma';
import { readdir, readFile } from 'fs/promises';
import { join, resolve } from 'node:path';
import { PrismaPGlite } from 'pglite-prisma-adapter';

const rootPath = resolve(__dirname, '../../../../');

const migrationsPath = join(rootPath, 'prisma', 'migrations');

const getDirectories = async (source: string) => {
  const dirs = await readdir(source, { withFileTypes: true });

  return dirs.filter((dirent) => dirent.isDirectory()).map((dirent) => dirent.name);
};

const readMigrationFile = async (source: string) => readFile(source, 'utf-8');

const applyMigrations = async (pgClient: PGlite) => {
  const migrations = await getDirectories(migrationsPath);

  for (const migration of migrations) {
    const sql = await readMigrationFile(join(migrationsPath, migration, 'migration.sql'));

    await pgClient.exec(sql);
  }
};

export const prepareMockDatabase = async () => {
  const client = new PGlite();

  await applyMigrations(client);

  const adapter = new PrismaPGlite(client);

  return new PrismaService({ adapter });
};

export const truncateMockData = async (prismaClient: PrismaService, table?: string) => {
  if (table) {
    await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE ${table} RESTART IDENTITY CASCADE;`);
  } else {
    const tables = ['users', 'groups', 'items', 'users_to_groups', 'items_to_groups'];

    for (const x of tables) {
      await prismaClient.$executeRawUnsafe(`TRUNCATE TABLE ${x} RESTART IDENTITY CASCADE;`);
    }
  }
};
