import 'dotenv/config';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaClient } from '../generated/prisma/client/index.js';

const connectionString: string = process.env.DATABASE_URL ?? '';

const adapter: PrismaBetterSqlite3 = new PrismaBetterSqlite3({
  url: connectionString,
});
const prisma: PrismaClient = new PrismaClient({ adapter });

export { prisma };
