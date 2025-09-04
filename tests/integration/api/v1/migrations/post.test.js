import database from "infra/database";
import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await cleanDatabase();
});

async function cleanDatabase() {
  await database.query("drop schema public cascade;");
  await database.query("create schema public;");
}

test("POST to /api/v1/migrations should return 200", async () => {

  const response1 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST'
  });

  const response1Body = await response1.json();

  expect([201, 204]).toContain(response1.status);

  expect(response1Body).toEqual(expect.objectContaining({
    status: "success",
  }));

  if (response1Body.data.length > 0) {
    response1Body.data.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        path: expect.any(String),
        name: expect.any(String),
        timestamp: expect.any(Number),
      }));
    });
  }

  await database.query("SELECT * FROM pgmigrations;");
  const migrationsInDatabase = await database.query("SELECT * FROM pgmigrations;");
  expect(migrationsInDatabase.rows.length).toBe(response1Body.data.length);


  const response2 = await fetch("http://localhost:3000/api/v1/migrations", {
    method: 'POST'
  });

  const response2Body = await response2.json();

  expect([201, 200]).toContain(response2.status);

  expect(response2Body).toEqual(expect.objectContaining({
    status: "success",
  }));

  expect(response2Body.data.length).toBe(0);

});