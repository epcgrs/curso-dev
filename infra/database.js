import { Client } from "pg"

async function query (queryObject) {
  const client = new Client({
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
  });
  
  await client.connect();

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
  query: query,
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
        WHERE backend_type = 'client backend'
        AND datname = $1;
      `,
      values: [databaseName]
    });


    return parseInt(result.rows[0].total);
  }
}