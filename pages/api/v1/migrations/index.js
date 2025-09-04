import database from 'infra/database.js';

export default async function migrations(request, response) {

  if (request.method !== 'GET' && request.method !== 'POST') {
    response.setHeader("Allow", ["GET", "POST"]);
    return response.status(405).end(`Method ${request.method} Not Allowed`);
  }

  if (request.method === 'GET') {
    return migrationGet(request, response);
  }
  if (request.method === 'POST') {
    return migrationPost(request, response);
  }

}

async function migrationGet(request, response) {
  try {
    const migrations = await database.runMigrations();
    
    if (migrations.length > 0) {
      response.status(201).json({
        status: "success",
        data: migrations
      });
    }
    response.status(200).json({
      status: "success",
      data: []
    });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}

async function migrationPost(request, response) {
  try {
    const migratedMigrations = await database.runMigrations(false);

    if (migratedMigrations.length > 0) {
      response.status(201).json({
        status: "success",
        data: migratedMigrations
      });
    } 
    
    response.status(200).json({
      status: "success",
      data: []
    });
  } catch (error) {
    response.status(500).json({ error: "Internal Server Error", details: error.message });
  }
}
