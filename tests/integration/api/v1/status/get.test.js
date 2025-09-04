import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.postgress_version).toBeDefined();
  expect(responseBody.postgress_version).toMatch(/PostgreSQL/);
  expect(typeof responseBody.postgress_version).toBe('string');

  expect(responseBody.max_connections).toBeDefined();
  expect(typeof responseBody.max_connections).toBe('number');
  expect(responseBody.max_connections).toBeGreaterThan(0);

  expect(responseBody.used_connections).toBeDefined();
  expect(typeof responseBody.used_connections).toBe('number');
  expect(responseBody.used_connections).toBeLessThanOrEqual(responseBody.max_connections);

});