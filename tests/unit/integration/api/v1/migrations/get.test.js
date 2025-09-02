import database from "infra/database";

async function cleanDatabase() {
  await database.query("drop schema public cascade;");
  await database.query("create schema public;");
}

beforeAll(cleanDatabase);

test("GET to /api/v1/migrations should return 200", async () => {

  const response = await fetch("http://localhost:3000/api/v1/migrations");

  const responseBody = await response.json();
  expect(responseBody).toEqual(expect.objectContaining({
    status: "success",
  }));

  expect([201, 204]).toContain(response.status);

  if (responseBody.data.length > 0) {
    responseBody.data.forEach((item) => {
      expect(item).toEqual(expect.objectContaining({
        path: expect.any(String),
        name: expect.any(String),
        timestamp: expect.any(Number),
      }));
    });
  } 
});