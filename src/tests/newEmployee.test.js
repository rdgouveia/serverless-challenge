const newEmployee = require("../functions/newEmployee");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env["TEST_DATABASE_URL"] = mongod.getUri();
});

afterAll(async () => {
  await mongod.stop();
});

test("Should return the new employee", async () => {
  const data = {
    body: JSON.stringify({
      name: "Rafael A.",
      age: 22,
      role: "Boss",
    }),
  };

  await newEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(true);
    expect(JSON.parse(response.body).employee.name).toBe("Rafael A.");
    expect(JSON.parse(response.body).employee.age).toBe(22);
    expect(JSON.parse(response.body).employee.role).toBe("Boss");
  });
});

test("Should return error missing params [01]", async () => {
  const data = {
    body: JSON.stringify({
      age: 22,
      role: "Chefe",
    }),
  };

  await newEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe('"name" is required');
  });
});

test("Should return error missing params [02]", async () => {
  const data = {
    body: JSON.stringify({
      name: "Rafael A.",
      role: "Chefe",
    }),
  };

  await newEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe('"age" is required');
  });
});

test("Should return error missing params [02]", async () => {
  const data = {
    body: JSON.stringify({
      name: "Rafael A.",
      age: 22,
    }),
  };

  await newEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe('"role" is required');
  });
});
