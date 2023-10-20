const getEmployee = require("../functions/getEmployee");
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

test("Should return employee info", async () => {
  const data = {
    pathParameters: { id: id.toString() },
  };

  await getEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(true);
    expect(JSON.parse(response.body).employee.name).toBe("Rafael A.");
    expect(JSON.parse(response.body).employee.age).toBe(22);
    expect(JSON.parse(response.body).employee.role).toBe("Boss");
    expect(JSON.parse(response.body).employee._id).toBe(id.toString());
  });
});

test("Should return error missing params", async () => {
  const data = {};

  await getEmployee(data, null, (_, response) => {
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

  await getEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(404);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe("Employee not found");
  });
});
