const { connect, disconnect } = require("../../config/database");
const Employee = require("../../models/Employee");
const { joiSchemaBody, joiSchemaId } = require("./schema");

/**
 * @param {string} id - _id from MongoDB on path parameter (required)
 * @param {string} name - Employee's name on body (optional)
 * @param {number} age - Employee's age on body (optional)
 * @param {string} role - Employee's role on body (optional)
 */
module.exports = async (event, _, callback) => {
  const params = joiSchemaBody.validate(JSON.parse(event.body));
  const id = joiSchemaId.validate(event.pathParameters?.id);

  if (params.error) {
    return callback(null, {
      statusCode: 422,
      body: JSON.stringify({
        ok: false,
        message: params.error.details[0].message,
      }),
    });
  }

  if (id.error) {
    return callback(null, {
      statusCode: 422,
      body: JSON.stringify({ ok: false, message: "id is required" }),
    });
  }

  try {
    const mongoDB = await connect();
    const employeeModel = mongoDB.model("Employee", Employee);

    const employee = await employeeModel
      .findOneAndUpdate(
        { _id: id.value },
        { ...params.value },
        { returnOriginal: false }
      )
      .select("-__v")
      .lean();

    if (!employee) {
      await disconnect(mongoDB);
      return callback(null, {
        statusCode: 404,
        body: JSON.stringify({ ok: false, message: "User not found" }),
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
