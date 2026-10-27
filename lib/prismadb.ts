import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "@/generated/prisma/client";

declare global {
  var prisma: PrismaClient | undefined
}

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL must be set to initialize Prisma");
  }

  const databaseUrl = new URL(connectionString);

  if (databaseUrl.protocol !== "mysql:") {
    throw new Error("DATABASE_URL must use the mysql:// protocol");
  }

  const adapter = new PrismaMariaDb({
    host: databaseUrl.hostname,
    port: Number(databaseUrl.port || 3306),
    user: decodeURIComponent(databaseUrl.username),
    password: decodeURIComponent(databaseUrl.password),
    database: decodeURIComponent(databaseUrl.pathname.replace(/^\/+/, "")),
    connectionLimit: 10,
  });

  return new PrismaClient({ adapter });
};

const prismadb = globalThis.prisma || createPrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = prismadb

export default prismadb;

