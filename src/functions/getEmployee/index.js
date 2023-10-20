const { connect, disconnect } = require("../../config/database");
const Employee = require("../../models/Employee");
const joiSchema = require("./schema");

/**
 * @param {string} id - _id from MongoDB on path parameter (required)
 */
module.exports = async (event, _, callback) => {
  const params = joiSchema.validate(event.pathParameters?.id);

  if (params.error) {
    return callback(null, {
      statusCode: 422,
      body: JSON.stringify({ ok: false, message: "id is required" }),
    });
  }

  try {
    const mongoDB = await connect();
    const employeeModel = mongoDB.model("Employee", Employee);

    const employee = await employeeModel
      .findOne({ _id: params.value })
      .select("-__v")
      .lean();

    if (!employee) {
      await disconnect(mongoDB);
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ ok: false, message: "Employee not found" }),
      });
    }

    await disconnect(mongoDB);
    return callback(null, {
      statusCode: 200,
      body: JSON.stringify({ ok: true, employee }),
    });
  } catch (e) {
    console.log(e);
    return callback(null, {
      statusCode: 500,
      body: JSON.stringify({ ok: false, message: "Internal Server Error" }),
    });
  }
};
