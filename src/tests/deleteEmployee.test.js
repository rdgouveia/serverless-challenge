const deleteEmployee = require("../functions/deleteEmployee");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Employee = require("../models/Employee");
const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

let mongod;
let id;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env["TEST_DATABASE_URL"] = mongod.getUri();
  const mongoIntance = await mongoose.connect(mongod.getUri());
  const MongoModel = mongoIntance.model("Employee", Employee);

  const seedEmployee = await MongoModel.create({
    name: "Rafael A.",
    age: 22,
    role: "Boss",
  });

  id = seedEmployee._id;

  await mongoIntance.disconnect();
});

afterAll(async () => {
  await mongod.stop();
});

test("Should delete employee", async () => {
  const data = {
    pathParameters: { id: id.toString() },
  };

  await deleteEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(true);
    expect(JSON.parse(response.body).message).toBe("Employee deleted");
  });
});

test("Should return error missing params", async () => {
  const data = {};

  await deleteEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe("id is required");
  });
});

test("Should return employee not found", async () => {
  const data = {
    pathParameters: { id: "6531b07d759e919d089942f2" },
  };

  await deleteEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(404);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe("Employee not found");
  });
});
