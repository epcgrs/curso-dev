import { Client } from "pg";
import migrationRunner from 'node-pg-migrate';
import { join } from "node:path";

async function query (queryObject) {
  let client = await getNewClient();

  try {
    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.error("Database query error:", error);
    throw error;
  } finally {
    await client.end();
  }
}

export default {
  query,
  getPostgresVersion: async () => {
    const result = await query("SELECT version();");
    return result.rows[0].version;
  },
  getMaxConnections: async () => {
    const result = await query("SHOW max_connections;");
    return parseInt(result.rows[0].max_connections);
  },

  getUsedConnections: async () => {

    const databaseName = process.env.POSTGRES_DB;
    const result = await query({
      text: `
        SELECT count(*)::int AS total
        FROM pg_stat_activity
        WHERE datname = $1;
      `,
      values: [databaseName]
    });


    return parseInt(result.rows[0].total);
  },
  runMigrations: async (dryRun = true) => {
    const dbClient = await getNewClient();

    const migrationsDir = process.env.NODE_ENV === "production"
      ? resolve(process.cwd(), "infra", "migrations")
      : join("infra", "migrations");

    if (!migrationsDir) {
      throw new Error(`Migrations dir not found: ${migrationsDir}`);
    }

    const result = await migrationRunner({
      databaseUrl: process.env.DATABASE_URL,
      dryRun: dryRun,
      dir: migrationsDir,
      direction: 'up',
      migrationsTable: 'pgmigrations',
      client: dbClient
    });
    await dbClient.end();
    return result;
  },
  getNewClient
}

async function getNewClient() {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: getSSLValues()
  });

  await client.connect();
  return client;
}

function getSSLValues() {
  if (process.env.POSTGRES_CA) {
    return {
      ca: process.env.POSTGRES_CA,
    };
  }

  return process.env.NODE_ENV === "production" ? true : false;
}