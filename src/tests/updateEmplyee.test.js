const updateEmployee = require("../functions/updateEmployee");
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

test("Should update employee", async () => {
  const data = {
    pathParameters: { id: id.toString() },
    body: JSON.stringify({
      name: "Rafael B.",
    }),
  };

  await updateEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(200);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(true);
    expect(JSON.parse(response.body).employee.name).toBe("Rafael B.");
  });
});

test("Should return error missing params", async () => {
  const data = {
    body: JSON.stringify({
      name: "Rafael B.",
    }),
  };

  await updateEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe("id is required");
  });
});

test("Should return error params [01]", async () => {
  const data = {
    pathParameters: { id: id.toString() },
    body: JSON.stringify({
      name: 12,
    }),
  };

  await updateEmployee(data, null, (_, response) => {
    expect(response.statusCode).toBe(422);
    expect(response.body).not.toBeUndefined();
    expect(JSON.parse(response.body).ok).toBe(false);
    expect(JSON.parse(response.body).message).toBe('"name" must be a string');
  });
});
