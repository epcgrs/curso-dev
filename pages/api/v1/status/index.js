import database from 'infra/database.js'

async function status(request, response) {

  const updatedAt = new Date().toISOString();

  response.status(200).json({
    updated_at: updatedAt,
    postgress_version: await database.getPostgresVersion(),
    max_connections: await database.getMaxConnections(),
    used_connections: await database.getUsedConnections()
  });
}

export default status;
