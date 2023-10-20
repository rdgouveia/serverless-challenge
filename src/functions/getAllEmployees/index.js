const { connect, disconnect } = require("../../config/database");
const Employee = require("../../models/Employee");
const joiSchema = require("./schema");
const isEmpty = require("lodash.isempty");

/**
 * @param {number} page - page used on pagination, the first one should be 1, passed on query string parameters (required)
 */
module.exports = async (event, _, callback) => {
  const params = joiSchema.validate(event.queryStringParameters?.page);

  if (params.error) {
    return callback(null, {
      statusCode: 422,
      body: JSON.stringify({ ok: false, message: "Page number required" }),
    });
  }

  try {
    const mongoDB = await connect();
    const employeeModel = mongoDB.model("Employee", Employee);
    const skip = (params.value - 1) * 10;
    const employees = await employeeModel.find().skip(skip).limit(11);

    if (isEmpty(employees)) {
      await disconnect(mongoDB);

      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ ok: false, message: "Employees not found" }),
      });
    }

    let morePages = false;

    if (employees.length === 11) {
      morePages = true;
      employees.pop();
    }

    await disconnect(mongoDB);

    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ ok: true, employees, morePages }),
    });
  } catch (e) {
    console.log(e);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: "Internal Server Error" }),
    });
  }
};
