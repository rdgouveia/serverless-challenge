const employeeRoutes = require("./src/routes/employee");
require("dotenv").config();

const healthCheck = (event, context, callback) => {
  callback(null, {
    statusCode: 200,
    body: JSON.stringify({
      message: "Server on!",
    }),
  });
};

module.exports = {
  healthCheck,
  ...employeeRoutes,
};
