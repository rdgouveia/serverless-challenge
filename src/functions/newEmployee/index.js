const { connect, disconnect } = require("../../config/database");
const Employee = require("../../models/Employee");
const joiSchema = require("./schema");

/**
 * @param {string} name - Employee's name on body (required)
 * @param {number} age - Employee's age on body (required)
 * @param {string} role - Employee's role on body (required)
 */
module.exports = async (event, _, callback) => {
  const params = joiSchema.validate(JSON.parse(event.body));

  if (params.error) {
    return callback(null, {
      statusCode: 422,
      body: JSON.stringify({
        ok: false,
        message: params.error.details[0].message,
      }),
    });
  }

  try {
    const mongoDB = await connect();
    const employeeModel = mongoDB.model("Employee", Employee);
    const employee = await employeeModel.create(params.value);

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
